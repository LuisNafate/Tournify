import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import {
  Tournament,
  TournamentWithDetails,
  CreateTournamentRequest,
  UpdateTournamentRequest,
  TournamentFilters,
  TournamentStanding,
  FollowerStats
} from '../models/tournament.model';

/**
 * Servicio de Torneos
 * Maneja todas las operaciones CRUD de torneos, seguimiento y estadísticas
 */
@Injectable({
  providedIn: 'root'
})
export class TournamentService {
  private apiUrl = `${environment.apiUrl}/tournaments`;

  constructor(private http: HttpClient) {}

  /**
   * Obtiene todos los torneos con filtros opcionales
   * @param filters Filtros para la búsqueda
   * @returns Observable con array de torneos
   */
  getAll(filters?: TournamentFilters): Observable<Tournament[]> {
    let params = new HttpParams();

    if (filters) {
      if (filters.status) {
        if (Array.isArray(filters.status)) {
          filters.status.forEach(s => params = params.append('status', s));
        } else {
          params = params.set('status', filters.status);
        }
      }
      if (filters.sportId) params = params.set('sportId', filters.sportId);
      if (filters.tournamentType) params = params.set('tournamentType', filters.tournamentType);
      if (filters.search) params = params.set('search', filters.search);
      if (filters.organizerId) params = params.set('organizerId', filters.organizerId);
      if (filters.page) params = params.set('page', filters.page.toString());
      if (filters.limit) params = params.set('limit', filters.limit.toString());
    }

    return this.http.get<Tournament[]>(this.apiUrl, { params })
      .pipe(catchError(this.handleError));
  }

  /**
   * Obtiene un torneo por su ID con detalles completos
   * @param id ID del torneo
   * @returns Observable con el torneo detallado
   */
  getById(id: string): Observable<TournamentWithDetails> {
    return this.http.get<TournamentWithDetails>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  /**
   * Crea un nuevo torneo
   * @param tournament Datos del torneo a crear
   * @returns Observable con el torneo creado
   */
  create(tournament: CreateTournamentRequest): Observable<Tournament> {
    return this.http.post<Tournament>(this.apiUrl, tournament)
      .pipe(catchError(this.handleError));
  }

  /**
   * Actualiza un torneo existente
   * @param id ID del torneo
   * @param tournament Datos a actualizar
   * @returns Observable con el torneo actualizado
   */
  update(id: string, tournament: UpdateTournamentRequest): Observable<Tournament> {
    return this.http.put<Tournament>(`${this.apiUrl}/${id}`, tournament)
      .pipe(catchError(this.handleError));
  }

  /**
   * Elimina un torneo
   * @param id ID del torneo
   * @returns Observable vacío
   */
  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  /**
   * Seguir un torneo
   * @param tournamentId ID del torneo a seguir
   * @returns Observable con las estadísticas de seguidores
   */
  follow(tournamentId: string): Observable<FollowerStats> {
    return this.http.post<FollowerStats>(`${this.apiUrl}/${tournamentId}/follow`, {})
      .pipe(catchError(this.handleError));
  }

  /**
   * Dejar de seguir un torneo
   * @param tournamentId ID del torneo
   * @returns Observable con las estadísticas de seguidores
   */
  unfollow(tournamentId: string): Observable<FollowerStats> {
    return this.http.delete<FollowerStats>(`${this.apiUrl}/${tournamentId}/follow`)
      .pipe(catchError(this.handleError));
  }

  /**
   * Obtiene el estado de seguimiento de un torneo
   * @param tournamentId ID del torneo
   * @returns Observable con las estadísticas de seguidores
   */
  getFollowerStats(tournamentId: string): Observable<FollowerStats> {
    return this.http.get<FollowerStats>(`${this.apiUrl}/${tournamentId}/followers`)
      .pipe(catchError(this.handleError));
  }

  /**
   * Obtiene la tabla de posiciones de un torneo
   * @param tournamentId ID del torneo
   * @returns Observable con array de posiciones
   */
  getStandings(tournamentId: string): Observable<TournamentStanding[]> {
    return this.http.get<TournamentStanding[]>(`${this.apiUrl}/${tournamentId}/standings`)
      .pipe(catchError(this.handleError));
  }

  /**
   * Obtiene los torneos que el usuario actual está siguiendo
   * @returns Observable con array de torneos
   */
  getFollowedTournaments(): Observable<Tournament[]> {
    return this.http.get<Tournament[]>(`${this.apiUrl}/followed`)
      .pipe(catchError(this.handleError));
  }

  /**
   * Obtiene los torneos creados por el usuario actual
   * @returns Observable con array de torneos
   */
  getMyTournaments(): Observable<Tournament[]> {
    return this.http.get<Tournament[]>(`${this.apiUrl}/my-tournaments`)
      .pipe(catchError(this.handleError));
  }

  /**
   * Inicia un torneo (cambia su estado a 'ongoing')
   * @param tournamentId ID del torneo
   * @returns Observable con el torneo actualizado
   */
  start(tournamentId: string): Observable<Tournament> {
    return this.http.post<Tournament>(`${this.apiUrl}/${tournamentId}/start`, {})
      .pipe(catchError(this.handleError));
  }

  /**
   * Finaliza un torneo (cambia su estado a 'finished')
   * @param tournamentId ID del torneo
   * @returns Observable con el torneo actualizado
   */
  finish(tournamentId: string): Observable<Tournament> {
    return this.http.post<Tournament>(`${this.apiUrl}/${tournamentId}/finish`, {})
      .pipe(catchError(this.handleError));
  }

  /**
   * Registra un equipo en un torneo
   * @param tournamentId ID del torneo
   * @param teamData Datos del equipo
   * @returns Observable con el torneo actualizado
   */
  registerTeam(tournamentId: string, teamData: any): Observable<Tournament> {
    return this.http.post<Tournament>(`${this.apiUrl}/${tournamentId}/teams`, teamData)
      .pipe(catchError(this.handleError));
  }

  /**
   * Obtiene los equipos de un torneo
   * @param tournamentId ID del torneo
   * @returns Observable con array de equipos
   */
  getTeams(tournamentId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${tournamentId}/teams`)
      .pipe(catchError(this.handleError));
  }

  /**
   * Obtiene las registraciones (equipos inscritos) de un torneo
   * @param tournamentId ID del torneo
   * @returns Observable con array de registraciones
   */
  getRegistrations(tournamentId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${tournamentId}/registrations`)
      .pipe(catchError(this.handleError));
  }

  /**
   * Genera el bracket de eliminación para un torneo
   * @param tournamentId ID del torneo
   * @param startDate Fecha opcional de inicio de los partidos
   * @returns Observable con la respuesta de generación
   */
  generateBracket(tournamentId: string, startDate?: string): Observable<any> {
    const body = startDate ? { startDate } : {};
    return this.http.post<any>(`${this.apiUrl}/${tournamentId}/generate-bracket`, body)
      .pipe(catchError(this.handleError));
  }

  /**
   * Maneja errores de HTTP
   */
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Ocurrió un error desconocido';
    
    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Error del lado del servidor
      errorMessage = error.error?.message || `Error ${error.status}: ${error.statusText}`;
    }
    
    console.error('Error en TournamentService:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
