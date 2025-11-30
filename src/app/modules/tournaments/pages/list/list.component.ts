import { Component, OnInit } from '@angular/core';
import { Tournament, TournamentFilters } from '../../../../core/models/tournament.model';
import { TournamentService, PaginatedResponse } from '../../services/tournament.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
  tournaments: Tournament[] = [];
  loading = false;
  error: string | null = null;

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

  constructor(private tournamentService: TournamentService) {}

  ngOnInit(): void {
    this.loadTournaments();
  }

  loadTournaments(): void {
    this.loading = true;
    this.error = null;

    this.tournamentService.getTournaments(this.filters).subscribe({
      next: (response: PaginatedResponse<Tournament>) => {
        this.tournaments = response.content;
        this.currentPage = response.page;
        this.pageSize = response.size;
        this.totalPages = response.totalPages;
        this.totalElements = response.totalElements;
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
}