import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

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

  constructor(private router: Router) {}

  joinTournament(): void {
    if (this.tournament) {
      this.router.navigate(['/tournaments/join', this.tournament.id]);
    }
  }

  onFollowClick(): void {
    this.followToggle.emit();
  }
}
