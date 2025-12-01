import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Team } from '../../../../core/models/team.model';
import { TeamService } from '../../../tournaments/services/team.service';

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
        console.log('[MyTeams] Equipos cargados exitosamente:', teams);
        this.teams = teams;
        this.loading = false;
      },
      error: (err) => {
        console.error('[MyTeams] Error completo:', err);
        console.error('[MyTeams] Error status:', err?.status);
        console.error('[MyTeams] Error message:', err?.message);

        // Manejar diferentes tipos de error
        if (err?.status === 401) {
          this.error = 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.';
          // Opcional: redirigir al login después de 2 segundos
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 2000);
        } else if (err?.status === 403) {
          this.error = 'No tienes permisos para ver estos equipos.';
        } else if (err?.status === 0) {
          this.error = 'No se puede conectar con el servidor. Verifica que el backend esté corriendo.';
        } else {
          this.error = `Error al cargar tus equipos: ${err?.message || 'Error desconocido'}`;
        }

        this.loading = false;
      }
    });
  }

  createTeam(): void {
    this.router.navigate(['/teams/create']);
  }

  viewTeam(teamId: string): void {
    // Intentar navegar al detalle del equipo
    this.router.navigate(['/teams', teamId]);
  }

  /**
   * Alternativa: Ver información básica del equipo sin navegar
   * Esto evita el error 403 mostrando solo la info disponible en la lista
   */
  viewTeamInfo(team: Team, event: Event): void {
    event.stopPropagation();

    const message = `
Información del Equipo:
━━━━━━━━━━━━━━━━━━━━

Nombre: ${team.name}
${team.shortName ? `Nombre corto: ${team.shortName}` : ''}
${team.description ? `Descripción: ${team.description}` : ''}
${team.contactEmail ? `Email: ${team.contactEmail}` : ''}
${team.contactPhone ? `Teléfono: ${team.contactPhone}` : ''}

Creado: ${new Date(team.createdAt).toLocaleDateString('es-MX')}

⚠️ Nota: Si eres el capitán de este equipo pero no puedes ver sus detalles completos, contacta al administrador para que te agregue como miembro del equipo.
    `.trim();

    alert(message);
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
