import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatchService } from '../../../../core/services/match.service';
import { MatchWithDetails } from '../../../../core/models/match.model';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-match-detail',
  templateUrl: './match-detail.component.html',
  styleUrls: ['./match-detail.component.css']
})
export class MatchDetailComponent implements OnInit {
  match: MatchWithDetails | null = null;
  loading = false;
  error: string | null = null;
  matchId!: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private matchService: MatchService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.matchId = id;
      this.loadMatch();
    }
  }

  loadMatch(): void {
    this.loading = true;
    this.error = null;

    this.matchService.getById(this.matchId).subscribe({
      next: (match) => {
        this.match = match;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading match:', err);
        this.error = 'Error al cargar el partido';
        this.loading = false;
      }
    });
  }

  getStatusLabel(status: string): string {
    const labels: { [key: string]: string } = {
      'scheduled': 'Programado',
      'ongoing': 'En Vivo',
      'finished': 'Finalizado',
      'postponed': 'Pospuesto',
      'cancelled': 'Cancelado'
    };
    return labels[status] || status;
  }

  getStatusClass(status: string): string {
    return `status-${status}`;
  }

  canUpdateResult(): boolean {
    if (!this.match) return false;
    const currentUser = this.authService.usuarioActualValue;
    if (!currentUser) return false;
    
    return currentUser.role === 'admin' || 
           currentUser.role === 'referee' ||
           this.match.refereeId === currentUser.id;
  }

  updateResult(): void {
    if (this.match) {
      this.router.navigate(['/tournaments/matches', this.match.id, 'update']);
    }
  }

  goBack(): void {
    if (this.match) {
      const tournamentId = this.match.tournamentId || this.match.tournament?.id;
      if (tournamentId) {
        this.router.navigate(['/tournaments/detail', tournamentId]);
      } else {
        // Si no hay tournamentId, volver a la lista de torneos
        this.router.navigate(['/tournaments/list']);
      }
    }
  }

  getWinnerIndicator(teamId: string | undefined): boolean {
    if (!this.match || !teamId) return false;
    if (this.match.status !== 'finished') return false;
    
    // Determinar ganador por marcador
    if (this.match.scoreHome !== null && this.match.scoreHome !== undefined &&
        this.match.scoreAway !== null && this.match.scoreAway !== undefined) {
      if (this.match.scoreHome > this.match.scoreAway) {
        return teamId === this.match.homeTeam?.id;
      } else if (this.match.scoreAway > this.match.scoreHome) {
        return teamId === this.match.awayTeam?.id;
      }
    }
    return false;
  }
}
