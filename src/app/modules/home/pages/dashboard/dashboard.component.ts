import { Component, OnInit } from '@angular/core';
import { Tournament } from '../../../../core/models/tournament.model';
import { AuthService } from '../../../../core/services/auth.service';
import { TournamentService } from '../../../../core/services/tournament.service';
import { User } from '../../../../core/models/user.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  currentUser: User | null = null;
  tournaments: Tournament[] = [];
  myTournaments: Tournament[] = [];
  loading = false;
  error: string | null = null;

  constructor(
    private tournamentService: TournamentService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.usuarioActualValue;
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.loading = true;
    this.error = null;

    // Cargar torneos según el rol
    if (this.isPlayer()) {
      this.loadPlayerTournaments();
    } else if (this.isOrganizer()) {
      this.loadOrganizerTournaments();
    } else if (this.isReferee()) {
      this.loadRefereeTournaments();
    }
  }

  loadPlayerTournaments(): void {
    // Obtener torneos seguidos del usuario
    this.tournamentService.getFollowedTournaments().subscribe({
      next: (tournaments) => {
        this.tournaments = tournaments;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading followed tournaments:', err);
        this.tournaments = [];
        this.loading = false;
      }
    });
  }

  loadOrganizerTournaments(): void {
    // Obtener torneos creados por el organizador
    this.tournamentService.getMyTournaments().subscribe({
      next: (tournaments) => {
        this.myTournaments = tournaments;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading my tournaments:', err);
        this.myTournaments = [];
        this.loading = false;
      }
    });
  }

  loadRefereeTournaments(): void {
    // Torneos en los que el árbitro está asignado
    // TODO: Implementar GET /tournaments/assigned en el backend cuando se implemente la funcionalidad de árbitros
    this.tournaments = [];
    this.loading = false;
  }

  isPlayer(): boolean {
    return this.currentUser?.role === 'player';
  }

  isOrganizer(): boolean {
    return this.currentUser?.role === 'organizer';
  }

  isReferee(): boolean {
    return this.currentUser?.role === 'referee';
  }

  getRoleTitle(): string {
    if (this.isPlayer()) return 'Panel de Jugador';
    if (this.isOrganizer()) return 'Panel de Organizador';
    if (this.isReferee()) return 'Panel de Árbitro';
    return 'Dashboard';
  }
}