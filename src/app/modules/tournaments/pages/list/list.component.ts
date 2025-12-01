import { Component, OnInit } from '@angular/core';
import { Tournament, TournamentFilters } from '../../../../core/models/tournament.model';
import { TournamentService, PaginatedResponse } from '../../services/tournament.service';
import { SportService } from '../../../../core/services/sport.service';
import { AuthService } from '../../../../core/services/auth.service';
import { Sport } from '../../../../core/models/sport.model';
import { User } from '../../../../core/models/user.model';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
  tournaments: Tournament[] = [];
  loading = false;
  error: string | null = null;
  sports: Sport[] = [];
  currentUser: User | null = null;

  // Paginación
  currentPage = 0;
  pageSize = 10;
  totalPages = 0;
  totalElements = 0;

  // Filtros
  filters: TournamentFilters = {
    page: 0,
    limit: 10
  };

  // Variables para filtros
  searchTerm: string = '';
  selectedSportId: string = '';
  selectedStatus: 'registration' | 'upcoming' | 'ongoing' | 'finished' | '' = '';
  selectedType: 'league' | 'elimination' | 'hybrid' | '' = '';

  constructor(
    private tournamentService: TournamentService,
    private sportService: SportService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.usuarioActualValue;
    this.loadSports();
    this.loadTournaments();
  }

  loadSports(): void {
    this.sportService.getAll().subscribe({
      next: (sports) => {
        this.sports = sports;
      },
      error: (err) => {
        console.error('Error loading sports:', err);
      }
    });
  }

  loadTournaments(): void {
    this.loading = true;
    this.error = null;

    // Si es organizador, usar endpoint específico
    const serviceCall = this.currentUser?.role === 'organizer' 
      ? this.tournamentService.getMyTournaments()
      : this.tournamentService.getTournaments(this.filters);

    serviceCall.subscribe({
      next: (response: PaginatedResponse<Tournament>) => {
        let filteredTournaments = response.content;

        // Si es organizador, aplicar filtros en el frontend
        if (this.currentUser?.role === 'organizer') {
          // Filtro por deporte
          if (this.selectedSportId) {
            filteredTournaments = filteredTournaments.filter(t => t.sportId === this.selectedSportId);
          }
          // Filtro por estado
          if (this.selectedStatus) {
            filteredTournaments = filteredTournaments.filter(t => t.status === this.selectedStatus);
          }
          // Filtro por tipo
          if (this.selectedType) {
            filteredTournaments = filteredTournaments.filter(t => t.tournamentType === this.selectedType);
          }
          // Filtro por búsqueda
          if (this.searchTerm) {
            const term = this.searchTerm.toLowerCase();
            filteredTournaments = filteredTournaments.filter(t => 
              t.name.toLowerCase().includes(term) || 
              (t.description && t.description.toLowerCase().includes(term))
            );
          }
        }

        this.tournaments = filteredTournaments;
        this.currentPage = 0;
        this.pageSize = filteredTournaments.length;
        this.totalPages = 1;
        this.totalElements = filteredTournaments.length;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading tournaments:', err);
        this.error = 'Error al cargar los torneos. Por favor, intenta de nuevo.';
        this.loading = false;
      }
    });
  }

  applyFilters(newFilters: Partial<TournamentFilters>): void {
    this.filters = { ...this.filters, ...newFilters, page: 0 };
    this.loadTournaments();
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages - 1) {
      this.filters.page = (this.filters.page || 0) + 1;
      this.loadTournaments();
    }
  }

  previousPage(): void {
    if (this.currentPage > 0) {
      this.filters.page = (this.filters.page || 0) - 1;
      this.loadTournaments();
    }
  }

  goToPage(page: number): void {
    this.filters.page = page;
    this.loadTournaments();
  }

  // Métodos de filtrado
  onSearch(): void {
    this.applyFilters({ search: this.searchTerm || undefined });
  }

  onSportChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.selectedSportId = target.value;
    this.applyFilters({ sportId: this.selectedSportId || undefined });
  }

  onStatusChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.selectedStatus = target.value as any;
    this.applyFilters({ status: this.selectedStatus || undefined });
  }

  onTypeChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.selectedType = target.value as any;
    this.applyFilters({ tournamentType: this.selectedType || undefined });
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedSportId = '';
    this.selectedStatus = '';
    this.selectedType = '';
    this.filters = { page: 0, limit: 10 };
    this.loadTournaments();
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxPages = Math.min(this.totalPages, 5);
    let startPage = Math.max(0, this.currentPage - 2);
    const endPage = Math.min(this.totalPages - 1, startPage + maxPages - 1);
    
    if (endPage - startPage < maxPages - 1) {
      startPage = Math.max(0, endPage - maxPages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  }
}