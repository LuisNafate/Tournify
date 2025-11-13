import { Component, OnInit } from '@angular/core';
import { TournamentService } from '../../../tournaments/services/tournament.service';
import { Tournament } from '../../../../core/models/tournament.model';
import { AuthService } from '../../../../core/services/auth.service';
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
    // Torneos en los que el jugador está inscrito o siguiendo
    this.tournamentService.getTournaments({ page: 0, limit: 6 }).subscribe({
      next: (response) => {
        this.tournaments = response.content;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading tournaments:', err);
        this.error = 'Error al cargar los torneos.';
        this.loading = false;
      }
    });
  }

  loadOrganizerTournaments(): void {
    // Torneos creados por el organizador
    this.tournamentService.getTournaments({ page: 0, limit: 10 }).subscribe({
      next: (response) => {
        // Filtrar los torneos creados por el usuario actual
        // Nota: Asumiendo que los torneos tienen un campo ownerId o createdBy
        this.myTournaments = response.content;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading tournaments:', err);
        this.error = 'Error al cargar tus torneos.';
        this.loading = false;
      }
    });
  }

  loadRefereeTournaments(): void {
    // Torneos en los que el árbitro está asignado
    this.tournamentService.getTournaments({ page: 0, limit: 6 }).subscribe({
      next: (response) => {
        this.tournaments = response.content;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading tournaments:', err);
        this.error = 'Error al cargar los torneos asignados.';
        this.loading = false;
      }
    });
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