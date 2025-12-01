import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatchService } from '../../../../core/services/match.service';
import { TournamentService } from '../../services/tournament.service';
import { MatchWithDetails } from '../../../../core/models/match.model';

interface BracketRound {
  name: string;
  number: number;
  matches: MatchWithDetails[];
}

/**
 * Componente para visualizar el bracket de eliminación
 * Muestra el árbol de partidos en formato de llave
 */
@Component({
  selector: 'app-bracket',
  templateUrl: './bracket.component.html',
  styleUrls: ['./bracket.component.css']
})
export class BracketComponent implements OnInit {
  tournamentId!: string;
  matches: MatchWithDetails[] = [];
  rounds: BracketRound[] = [];
  loading = false;
  error: string | null = null;
  generatingBracket = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private matchService: MatchService,
    private tournamentService: TournamentService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('tournamentId');
    if (id) {
      this.tournamentId = id;
      this.loadBracket();
    }
  }

  loadBracket(): void {
    this.loading = true;
    this.error = null;

    this.matchService.getByTournament(this.tournamentId).subscribe({
      next: (matches) => {
        this.matches = matches;
        this.organizeBracket(matches);
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading bracket:', err);
        this.error = 'Error al cargar el bracket';
        this.loading = false;
      }
    });
  }

  /**
   * Organiza los partidos por rondas
   */
  organizeBracket(matches: MatchWithDetails[]): void {
    // Agrupar por roundNumber
    const roundsMap = new Map<number, MatchWithDetails[]>();
    
    matches.forEach(match => {
      const roundNum = match.roundNumber || 0;
      if (!roundsMap.has(roundNum)) {
        roundsMap.set(roundNum, []);
      }
      roundsMap.get(roundNum)!.push(match);
    });

    // Convertir a array y ordenar
    this.rounds = Array.from(roundsMap.entries())
      .map(([number, matches]) => ({
        name: matches[0]?.roundName || `Ronda ${number}`,
        number: number,
        matches: matches.sort((a, b) => (a.matchNumber || 0) - (b.matchNumber || 0))
      }))
      .sort((a, b) => a.number - b.number);
  }

  /**
   * Genera el bracket automáticamente
   */
  generateBracket(): void {
    if (!confirm('¿Estás seguro de que deseas generar el bracket? Esta acción no se puede deshacer.')) {
      return;
    }

    this.generatingBracket = true;
    this.error = null;

    // Llamar al servicio para generar bracket
    this.tournamentService.generateBracket(this.tournamentId).subscribe({
      next: (response: any) => {
        console.log('Bracket generado:', response);
        this.generatingBracket = false;
        // Recargar bracket
        this.loadBracket();
      },
      error: (err: any) => {
        console.error('Error generating bracket:', err);
        this.error = err.message || 'Error al generar el bracket';
        this.generatingBracket = false;
      }
    });
  }

  /**
   * Navega al detalle de un partido
   */
  viewMatch(matchId: string): void {
    this.router.navigate(['/tournaments/matches', matchId]);
  }

  /**
   * Retorna la clase CSS según el estado del partido
   */
  getMatchClass(match: MatchWithDetails): string {
    if (match.status === 'finished') return 'match-finished';
    if (match.status === 'ongoing') return 'match-live';
    if (!match.homeTeamId || !match.awayTeamId) return 'match-tbd';
    return 'match-scheduled';
  }

  /**
   * Determina si un equipo es el ganador
   */
  isWinner(match: MatchWithDetails, teamId: string | null | undefined): boolean {
    if (!teamId || match.status !== 'finished') return false;
    
    if (match.scoreHome !== null && match.scoreHome !== undefined && 
        match.scoreAway !== null && match.scoreAway !== undefined) {
      if (match.homeTeamId === teamId) {
        return match.scoreHome > match.scoreAway;
      }
      if (match.awayTeamId === teamId) {
        return match.scoreAway > match.scoreHome;
      }
    }
    
    return match.winnerId ? match.winnerId === teamId : false;
  }

  /**
   * Volver al detalle del torneo
   */
  goBack(): void {
    this.router.navigate(['/tournaments/detail', this.tournamentId]);
  }
}
