import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { MatchService } from '../../../../core/services/match.service';
import { Subscription } from 'rxjs';

// componente para vista del torneo
@Component({
  selector: 'app-tournament-view',
  templateUrl: './tournament-view.component.html',
  styleUrls: ['./tournament-view.component.css']
})
export class TournamentViewComponent implements OnChanges, OnInit, OnDestroy {
  @Input() tournament: any;
  @Input() followLoading: boolean = false;
  @Output() followToggle = new EventEmitter<void>();
  @Output() deleteTournament = new EventEmitter<void>();
  @Output() startTournament = new EventEmitter<void>();
  @Output() finishTournament = new EventEmitter<void>();

  matches: any[] = [];
  private _isOrganizer: boolean = false;
  private userSubscription?: Subscription;

  constructor(
    private router: Router,
    private authService: AuthService,
    private matchService: MatchService
  ) {}

  ngOnInit(): void {
    // Suscribirse a cambios en el usuario
    this.userSubscription = this.authService.usuarioActual$.subscribe(user => {
      console.log('User changed:', user);
      this._isOrganizer = this.checkIsOrganizer();
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['tournament'] && this.tournament) {
      this._isOrganizer = this.checkIsOrganizer();
      // Log para debugging de la imagen
      console.log('Tournament data:', {
        name: this.tournament.name,
        imageUrl: this.tournament.imageUrl,
        bannerUrl: this.tournament.bannerUrl
      });
      // Cargar partidos del torneo
      this.loadMatches();
    }
  }

  ngOnDestroy(): void {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  joinTournament(): void {
    if (this.tournament) {
      this.router.navigate(['/tournaments/join', this.tournament.id]);
    }
  }

  viewMatches(): void {
    if (this.tournament) {
      this.router.navigate(['/tournaments', this.tournament.id, 'matches']);
    }
  }

  viewBracket(): void {
    if (this.tournament) {
      this.router.navigate(['/tournaments', this.tournament.id, 'bracket']);
    }
  }

  viewGroups(): void {
    if (this.tournament) {
      this.router.navigate(['/tournaments', this.tournament.id, 'groups']);
    }
  }

  hasGroups(): boolean {
    // Mostrar botón de grupos si:
    // 1. El torneo es de tipo 'hybrid' (tiene fase de grupos)
    // 2. O si tiene configuración de grupos
    return this.tournament?.tournamentType === 'hybrid' ||
           this.tournament?.tournamentType === 'league' ||
           (this.tournament?.groupConfig && this.tournament.groupConfig.numGroups > 0);
  }

  manageRegistrations(): void {
    if (this.tournament) {
      this.router.navigate(['/tournaments', this.tournament.id, 'registrations']);
    }
  }

  onFollowClick(): void {
    this.followToggle.emit();
  }

  editTournament(): void {
    if (this.tournament) {
      this.router.navigate(['/tournaments/edit', this.tournament.id]);
    }
  }

  onDeleteTournament(): void {
    const confirmMessage = `¿Estás seguro de que deseas eliminar el torneo "${this.tournament?.name}"?\n\nEsta acción no se puede deshacer.`;
    if (confirm(confirmMessage)) {
      this.deleteTournament.emit();
    }
  }

  onStartTournament(): void {
    const confirmMessage = `¿Estás seguro de que deseas iniciar el torneo "${this.tournament?.name}"?\n\nEsto cambiará el estado a "En curso" y cerrará las inscripciones.`;
    if (confirm(confirmMessage)) {
      this.startTournament.emit();
    }
  }

  onFinishTournament(): void {
    const confirmMessage = `¿Estás seguro de que deseas finalizar el torneo "${this.tournament?.name}"?\n\nEsto marcará el torneo como completado.`;
    if (confirm(confirmMessage)) {
      this.finishTournament.emit();
    }
  }

  isOrganizer(): boolean {
    return this._isOrganizer;
  }

  isReferee(): boolean {
    const currentUser = this.authService.usuarioActualValue;
    return currentUser?.role === 'referee';
  }

  isPlayer(): boolean {
    const currentUser = this.authService.usuarioActualValue;
    return currentUser?.role === 'player';
  }

  canStartTournament(): boolean {
    return this.tournament?.status === 'registration' || this.tournament?.status === 'upcoming';
  }

  canFinishTournament(): boolean {
    return this.tournament?.status === 'ongoing';
  }

  private checkIsOrganizer(): boolean {
    const currentUser = this.authService.usuarioActualValue;
    
    if (!currentUser || !this.tournament) {
      console.log('No user or no tournament');
      return false;
    }

    // Normalizar ambos IDs a string y comparar
    const currentUserId = String(currentUser.id).trim();
    const tournamentOrganizerId = String(this.tournament.organizerId).trim();
    const isOwner = currentUserId === tournamentOrganizerId;
    const hasOrganizerRole = currentUser.role === 'organizer' || currentUser.role === 'admin';

    // Log para debugging
    console.log('Checking organizer:', {
      currentUserId,
      currentUserRole: currentUser.role,
      tournamentOrganizerId,
      tournamentName: this.tournament.name,
      isOwner,
      hasOrganizerRole,
      canEdit: isOwner && hasOrganizerRole
    });

    // Debe ser el dueño del torneo Y tener rol de organizador/admin
    return isOwner && hasOrganizerRole;
  }

  getTeamInitials(name: string): string {
    if (!name) return '?';
    const words = name.trim().split(' ');
    if (words.length === 1) {
      return name.substring(0, 2).toUpperCase();
    }
    return words.map(w => w[0]).join('').substring(0, 2).toUpperCase();
  }

  getSportName(): string {
    if (!this.tournament?.sport) return '';
    if (typeof this.tournament.sport === 'string') {
      return this.tournament.sport;
    }
    return this.tournament.sport.name || '';
  }

  getOrganizerName(): string {
    if (!this.tournament?.organizer) return '';
    if (typeof this.tournament.organizer === 'string') {
      return this.tournament.organizer;
    }
    return this.tournament.organizer.username || '';
  }

  onImageError(event: any): void {
    // Ocultar imagen si falla la carga
    event.target.style.display = 'none';
  }

  onBannerImageError(event: any): void {
    // Usar imagen por defecto si falla la carga del banner
    event.target.src = 'assets/images/Background-featured-tournaments.png';
  }

  loadMatches(): void {
    if (!this.tournament?.id) return;
    
    this.matchService.getByTournament(this.tournament.id).subscribe({
      next: (matches) => {
        // Ordenar por fecha y estado (próximos primero)
        this.matches = matches.sort((a, b) => {
          // Prioridad: live > scheduled > finished
          const statusOrder: any = { 'live': 0, 'scheduled': 1, 'finished': 2, 'postponed': 3, 'cancelled': 4 };
          const statusDiff = (statusOrder[a.status] || 99) - (statusOrder[b.status] || 99);
          if (statusDiff !== 0) return statusDiff;
          
          // Si tienen el mismo estado, ordenar por fecha
          if (a.scheduledAt && b.scheduledAt) {
            return new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime();
          }
          return 0;
        });
      },
      error: (err) => {
        console.error('Error loading matches:', err);
        this.matches = [];
      }
    });
  }

  goToMatch(matchId: string): void {
    this.router.navigate(['/tournaments/matches', matchId]);
  }

  getMatchStatusClass(status: string): string {
    const classes: { [key: string]: string } = {
      'scheduled': 'status-scheduled',
      'live': 'status-live',
      'finished': 'status-finished',
      'postponed': 'status-postponed',
      'cancelled': 'status-cancelled'
    };
    return classes[status] || '';
  }

  getMatchStatusLabel(status: string): string {
    const labels: { [key: string]: string } = {
      'scheduled': 'Programado',
      'live': 'En Vivo',
      'finished': 'Finalizado',
      'postponed': 'Pospuesto',
      'cancelled': 'Cancelado'
    };
    return labels[status] || status;
  }
}
