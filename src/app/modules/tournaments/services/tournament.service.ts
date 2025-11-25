import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import {
  Tournament,
  TournamentWithDetails,
  TournamentFilters,
  CreateTournamentRequest,
  UpdateTournamentRequest
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
        params = params.set('page', (filters.page + 1).toString()); // Backend usa páginas base 1
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

    return this.http.get<Tournament[]>(this.apiUrl, { params }).pipe(
      map((tournaments: Tournament[]) => {
        // Adaptar el array a la estructura de paginación esperada
        const page = filters?.page || 0;
        const size = filters?.limit || 10;
        return {
          content: tournaments,
          page: page,
          size: size,
          totalElements: tournaments.length,
          totalPages: 1 // Sin información real de paginación del backend
        };
      })
    );
  }

  /**
   * Obtener mis torneos (organizador)
   * GET /tournaments/my-tournaments
   */
  getMyTournaments(): Observable<PaginatedResponse<Tournament>> {
    return this.http.get<Tournament[]>(`${this.apiUrl}/my-tournaments`).pipe(
      map((tournaments: Tournament[]) => {
        return {
          content: tournaments,
          page: 0,
          size: tournaments.length,
          totalElements: tournaments.length,
          totalPages: 1
        };
      })
    );
  }

  /**
   * Obtener detalle de un torneo específico
   * GET /tournaments/{id}
   */
  getTournamentById(id: string): Observable<TournamentWithDetails> {
    return this.http.get<TournamentWithDetails>(`${this.apiUrl}/${id}`);
  }

  /**
   * Seguir un torneo
   * POST /tournaments/{id}/follow
   */
  followTournament(id: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${id}/follow`, {});
  }

  /**
   * Dejar de seguir un torneo
   * DELETE /tournaments/{id}/follow
   */
  unfollowTournament(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}/follow`);
  }

  /**
   * Crear un nuevo torneo con imagen
   * POST /tournaments (multipart/form-data)
   */
  createTournament(data: CreateTournamentRequest, imageFile: File | null): Observable<Tournament> {
    const formData = new FormData();

    // 1. Agregamos el JSON en el campo 'data' (como espera el backend Ktor)
    // Es importante hacer JSON.stringify porque formData solo acepta strings o blobs
    formData.append('data', JSON.stringify(data));

    // 2. Agregamos la imagen en el campo 'image' si existe
    if (imageFile) {
      formData.append('image', imageFile);
    }

    // Nota: No establezcas el Content-Type header manualmente aquí.
    // Angular/Navegador lo hará automáticamente con el boundary correcto para Multipart.
    return this.http.post<Tournament>(this.apiUrl, formData);
  }

  /**
   * Actualizar un torneo existente
   * PUT /tournaments/{id}
   */
  updateTournament(id: string, tournament: UpdateTournamentRequest): Observable<Tournament> {
    return this.http.put<Tournament>(`${this.apiUrl}/${id}`, tournament);
  }

  /**
   * Inscribir un equipo al torneo
   * POST /tournaments/{id}/join
   */
  joinTournament(tournamentId: string, teamId: string): Observable<HttpResponse<any>> {
    // Devolver la respuesta completa para que el frontend pueda distinguir
    // entre aprobación inmediata y solicitud pendiente según el backend.
    return this.http.post<any>(`${this.apiUrl}/${tournamentId}/join`, { teamId }, { observe: 'response' });
  }

  /**
   * Generar bracket de eliminación
   * POST /tournaments/{id}/generate-bracket
   */
  generateBracket(tournamentId: string, startDate?: string): Observable<any> {
    const body = startDate ? { startDate } : {};
    return this.http.post(`${this.apiUrl}/${tournamentId}/generate-bracket`, body);
  }

  /**
   * Eliminar un torneo
   * DELETE /tournaments/{id}
   */
  deleteTournament(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  /**
   * Obtener registros pendientes de un torneo
   * GET /tournaments/{id}/registrations
   */
  getRegistrations(tournamentId: string, status?: string): Observable<any[]> {
    let params = new HttpParams();
    if (status) {
      params = params.set('status', status);
    }
    return this.http.get<any[]>(`${this.apiUrl}/${tournamentId}/registrations`, { params });
  }

  /**
   * Aprobar un registro de equipo
   * POST /tournaments/{tournamentId}/registrations/{registrationId}/approve
   */
  approveRegistration(tournamentId: string, registrationId: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${tournamentId}/registrations/${registrationId}/approve`, {});
  }

  /**
   * Rechazar un registro de equipo
   * POST /tournaments/{tournamentId}/registrations/{registrationId}/reject
   */
  rejectRegistration(tournamentId: string, registrationId: string, reason?: string): Observable<void> {
    const body = reason ? { reason } : {};
    return this.http.post<void>(`${this.apiUrl}/${tournamentId}/registrations/${registrationId}/reject`, body);
  }

  /**
   * Iniciar un torneo
   * POST /tournaments/{id}/start
   */
  startTournament(tournamentId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/${tournamentId}/start`, {});
  }

  /**
   * Finalizar un torneo
   * POST /tournaments/{id}/finish
   */
  finishTournament(tournamentId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/${tournamentId}/finish`, {});
  }
}
