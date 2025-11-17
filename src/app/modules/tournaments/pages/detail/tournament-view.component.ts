import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';

// componente para vista del torneo
@Component({
  selector: 'app-tournament-view',
  templateUrl: './tournament-view.component.html',
  styleUrls: ['./tournament-view.component.css']
})
export class TournamentViewComponent {
  @Input() tournament: any;
  @Input() followLoading: boolean = false;
  @Output() followToggle = new EventEmitter<void>();
  @Output() deleteTournament = new EventEmitter<void>();

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  joinTournament(): void {
    if (this.tournament) {
      this.router.navigate(['/tournaments/join', this.tournament.id]);
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
    const currentUser = this.authService.usuarioActualValue;
    return this.tournament?.organizerId === currentUser?.id;
  }
}
