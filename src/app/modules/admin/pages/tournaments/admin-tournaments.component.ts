import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-admin-tournaments',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-tournaments.component.html',
  styleUrl: './admin-tournaments.component.css'
})
export class AdminTournamentsComponent implements OnInit {
  tournaments: any[] = [];
  loading = false;
  error: string | null = null;
  selectedStatus = '';
  currentPage = 0;
  pageSize = 20;
  totalPages = 1;

  statusOptions = [
    { value: '', label: 'Todos' },
    { value: 'upcoming', label: 'Próximos' },
    { value: 'registration', label: 'En Registro' },
    { value: 'ongoing', label: 'En Curso' },
    { value: 'finished', label: 'Finalizados' }
  ];

  constructor(
    private adminService: AdminService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadTournaments();
  }

  loadTournaments(): void {
    this.loading = true;
    this.error = null;

    this.adminService.getTournaments(
      this.currentPage,
      this.pageSize,
      this.selectedStatus || undefined
    ).subscribe({
      next: (response) => {
        this.tournaments = Array.isArray(response) ? response : response.content || [];
        this.totalPages = response.totalPages || 1;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading tournaments:', err);
        this.error = 'Error al cargar los torneos';
        this.loading = false;
      }
    });
  }

  onFilterChange(): void {
    this.currentPage = 0;
    this.loadTournaments();
  }

  viewTournament(tournamentId: string): void {
    this.router.navigate(['/tournaments/detail', tournamentId]);
  }

  suspendTournament(tournamentId: string, tournamentName: string): void {
    const reason = prompt(`¿Por qué deseas suspender el torneo "${tournamentName}"?`);
    if (reason === null) return;

    if (!reason.trim()) {
      alert('Debes proporcionar un motivo para la suspensión');
      return;
    }

    this.adminService.suspendTournament(tournamentId, reason).subscribe({
      next: () => {
        alert('Torneo suspendido exitosamente');
        this.loadTournaments();
      },
      error: (err) => {
        console.error('Error suspending tournament:', err);
        alert('Error al suspender el torneo');
      }
    });
  }

  deleteTournament(tournamentId: string, tournamentName: string): void {
    const confirmed = confirm(
      `¿Estás seguro de que deseas ELIMINAR el torneo "${tournamentName}"?\n\n` +
      `Esta acción es IRREVERSIBLE y eliminará:\n` +
      `- Todos los equipos inscritos\n` +
      `- Todos los partidos\n` +
      `- Todos los datos relacionados\n\n` +
      `Escribe "ELIMINAR" para confirmar`
    );

    if (!confirmed) return;

    const confirmation = prompt('Escribe "ELIMINAR" para confirmar:');
    if (confirmation !== 'ELIMINAR') {
      alert('Eliminación cancelada');
      return;
    }

    this.adminService.deleteTournament(tournamentId).subscribe({
      next: () => {
        alert('Torneo eliminado exitosamente');
        this.loadTournaments();
      },
      error: (err) => {
        console.error('Error deleting tournament:', err);
        alert('Error al eliminar el torneo');
      }
    });
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
      this.loadTournaments();
    }
  }

  previousPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.loadTournaments();
    }
  }

  getStatusBadgeClass(status: string): string {
    const classes: { [key: string]: string } = {
      'upcoming': 'status-upcoming',
      'registration': 'status-registration',
      'ongoing': 'status-ongoing',
      'finished': 'status-finished'
    };
    return classes[status] || 'status-upcoming';
  }

  getStatusLabel(status: string): string {
    const labels: { [key: string]: string } = {
      'upcoming': 'Próximo',
      'registration': 'En Registro',
      'ongoing': 'En Curso',
      'finished': 'Finalizado'
    };
    return labels[status] || status;
  }
}
