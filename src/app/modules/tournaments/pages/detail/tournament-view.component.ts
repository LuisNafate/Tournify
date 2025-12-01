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

  isOrganizer(): boolean {
    return this._isOrganizer;
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

    // Log para debugging
    console.log('Checking organizer:', {
      currentUserId,
      currentUserRole: currentUser.role,
      tournamentOrganizerId,
      tournamentName: this.tournament.name,
      isMatch: currentUserId === tournamentOrganizerId
    });

    // Comparar IDs
    return currentUserId === tournamentOrganizerId;
  }
}
