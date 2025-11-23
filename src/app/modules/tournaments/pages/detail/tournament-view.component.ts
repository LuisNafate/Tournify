import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
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

  private _isOrganizer: boolean = false;
  private userSubscription?: Subscription;

  constructor(
    private router: Router,
    private authService: AuthService
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
}
