import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Team } from '../../../../core/models/team.model';
import { TeamService } from '../../../tournaments/services/team.service';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-my-teams',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './my-teams.component.html',
  styleUrls: ['./my-teams.component.css']
})
export class MyTeamsComponent implements OnInit {
  teams: Team[] = [];
  loading = false;
  error: string | null = null;

  constructor(
    private teamService: TeamService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadMyTeams();
  }

  loadMyTeams(): void {
    this.loading = true;
    this.error = null;

    this.teamService.getMyTeams().subscribe({
      next: (teams) => {
        this.teams = teams;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading teams:', err);
        this.error = 'Error al cargar tus equipos. Por favor, intenta de nuevo.';
        this.loading = false;
      }
    });
  }

  createTeam(): void {
    this.router.navigate(['/teams/create']);
  }

  viewTeam(teamId: string): void {
    this.router.navigate(['/teams', teamId]);
  }

  deleteTeam(team: Team, event: Event): void {
    event.stopPropagation(); // Evitar que se active el click del card

    if (!confirm(`¿Estás seguro de que deseas eliminar el equipo "${team.name}"?`)) {
      return;
    }

    this.teamService.deleteTeam(team.id).subscribe({
      next: () => {
        this.teams = this.teams.filter(t => t.id !== team.id);
        alert('Equipo eliminado exitosamente');
      },
      error: (err) => {
        console.error('Error deleting team:', err);
        alert('Error al eliminar el equipo: ' + err.message);
      }
    });
  }
}
