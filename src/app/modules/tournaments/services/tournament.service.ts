import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import {
  Tournament,
  TournamentWithDetails,
  TournamentFilters
} from '../../../core/models/tournament.model';

export interface PaginatedResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

@Injectable({
  providedIn: 'root'
})
export class TournamentService {
  private apiUrl = `${environment.apiUrl}/tournaments`;

  constructor(private http: HttpClient) {}

  /**
   * Obtener lista de torneos con paginación y filtros
   * GET /tournaments
   */
  getTournaments(filters?: TournamentFilters): Observable<PaginatedResponse<Tournament>> {
    let params = new HttpParams();

    if (filters) {
      if (filters.page !== undefined) {
        params = params.set('page', filters.page.toString());
      }
      if (filters.limit !== undefined) {
        params = params.set('size', filters.limit.toString());
      }
      if (filters.status) {
        if (Array.isArray(filters.status)) {
          filters.status.forEach(s => {
            params = params.append('status', s);
          });
        } else {
          params = params.set('status', filters.status);
        }
      }
      if (filters.sportId) {
        params = params.set('sportId', filters.sportId);
      }
      if (filters.tournamentType) {
        params = params.set('tournamentType', filters.tournamentType);
      }
      if (filters.search) {
        params = params.set('search', filters.search);
      }
      if (filters.organizerId) {
        params = params.set('organizerId', filters.organizerId);
      }
    }

    return this.http.get<PaginatedResponse<Tournament>>(this.apiUrl, { params });
  }

  /**
   * Obtener detalle de un torneo específico
   * GET /tournaments/{id}
   */
  getTournamentById(id: string): Observable<TournamentWithDetails> {
    return this.http.get<TournamentWithDetails>(`${this.apiUrl}/${id}`);
  }
}
