import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TournamentService } from '../../services/tournament.service';
import { TournamentWithDetails } from '../../../../core/models/tournament.model';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})
export class DetailComponent implements OnInit {
  tournament: TournamentWithDetails | null = null;
  loading = false;
  error: string | null = null;
  followLoading = false;

  constructor(
    private route: ActivatedRoute,
    private tournamentService: TournamentService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadTournament(id);
    }
  }

  loadTournament(id: string): void {
    this.loading = true;
    this.error = null;

    this.tournamentService.getTournamentById(id).subscribe({
      next: (tournament: TournamentWithDetails) => {
        this.tournament = tournament;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading tournament:', err);
        this.error = 'Error al cargar el torneo. Por favor, intenta de nuevo.';
        this.loading = false;
      }
    });
  }

  toggleFollow(): void {
    if (!this.tournament) return;

    this.followLoading = true;
    const isFollowing = this.tournament.isFollowing;

    const action = isFollowing
      ? this.tournamentService.unfollowTournament(this.tournament.id)
      : this.tournamentService.followTournament(this.tournament.id);

    action.subscribe({
      next: () => {
        if (this.tournament) {
          this.tournament.isFollowing = !isFollowing;
          if (this.tournament.followersCount !== undefined) {
            this.tournament.followersCount += isFollowing ? -1 : 1;
          }
        }
        this.followLoading = false;
      },
      error: (err) => {
        console.error('Error toggling follow:', err);
        this.error = 'Error al actualizar el seguimiento. Intenta de nuevo.';
        this.followLoading = false;
      }
    });
  }
}
