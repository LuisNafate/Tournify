import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatchService } from '../../../../core/services/match.service';
import { TournamentService } from '../../services/tournament.service';
import { MatchWithDetails } from '../../../../core/models/match.model';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-matches-list',
  templateUrl: './matches-list.component.html',
  styleUrls: ['./matches-list.component.css']
})
export class MatchesListComponent implements OnInit {
  matches: MatchWithDetails[] = [];
  filteredMatches: MatchWithDetails[] = [];
  loading = false;
  error: string | null = null;
  tournamentId!: string;
  tournament: any = null;
  
  // Filtros
  selectedStatus: 'scheduled' | 'live' | 'finished' | 'postponed' | 'cancelled' | '' = '';
  selectedRound: string = '';
  availableRounds: string[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private matchService: MatchService,
    private tournamentService: TournamentService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('tournamentId');
    if (id) {
      this.tournamentId = id;
      this.loadTournament();
      this.loadMatches();
    }
  }

  loadTournament(): void {
    this.tournamentService.getTournamentById(this.tournamentId).subscribe({
      next: (tournament) => {
        this.tournament = tournament;
      },
      error: (err) => {
        console.error('Error loading tournament:', err);
      }
    });
  }

  loadMatches(): void {
    this.loading = true;
    this.error = null;

    this.matchService.getByTournament(this.tournamentId).subscribe({
      next: (matches) => {
        console.log('Partidos cargados desde API:', matches);
        this.matches = matches;
        this.filteredMatches = matches;
        this.extractRounds();
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading matches:', err);
        this.error = 'Error al cargar los partidos';
        this.loading = false;
      }
    });
  }

  extractRounds(): void {
    const rounds = new Set<string>();
    this.matches.forEach(match => {
      if (match.roundName) {
        rounds.add(match.roundName);
      }
    });
    this.availableRounds = Array.from(rounds).sort();
  }

  applyFilters(): void {
    this.filteredMatches = this.matches.filter(match => {
      const statusMatch = !this.selectedStatus || match.status === this.selectedStatus;
      const roundMatch = !this.selectedRound || match.roundName === this.selectedRound;
      return statusMatch && roundMatch;
    });
  }

  onStatusChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.selectedStatus = target.value as any;
    this.applyFilters();
  }

  onRoundChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.selectedRound = target.value;
    this.applyFilters();
  }

  clearFilters(): void {
    this.selectedStatus = '';
    this.selectedRound = '';
    this.filteredMatches = this.matches;
  }

  viewMatchDetail(matchId: string): void {
    this.router.navigate(['/tournaments/matches', matchId]);
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

  canUpdateResult(match: MatchWithDetails): boolean {
    const currentUser = this.authService.usuarioActualValue;
    if (!currentUser) return false;
    
    // Solo árbitros, admin o el referee asignado pueden actualizar
    return currentUser.role === 'admin' || 
           currentUser.role === 'referee' ||
           match.refereeId === currentUser.id;
  }

  updateResult(matchId: string, event: Event): void {
    event.stopPropagation();
    this.router.navigate(['/tournaments/matches', matchId, 'update']);
  }

  isOrganizer(): boolean {
    if (!this.tournament) return false;
    const currentUser = this.authService.usuarioActualValue;
    if (!currentUser) return false;
    
    return String(currentUser.id) === String(this.tournament.organizerId) ||
           currentUser.role === 'admin';
  }

  createMatch(): void {
    this.router.navigate(['/tournaments', this.tournamentId, 'matches', 'create']);
  }

  goBack(): void {
    this.router.navigate(['/tournaments/detail', this.tournamentId]);
  }
}
