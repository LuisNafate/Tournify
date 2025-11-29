import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import {
  Match,
  MatchWithDetails,
  CreateMatchRequest,
  UpdateMatchRequest
} from '../models/match.model';

/**
 * Servicio de Partidos
 * Maneja todas las operaciones relacionadas con partidos
 */
@Injectable({
  providedIn: 'root'
})
export class MatchService {
  private apiUrl = `${environment.apiUrl}/matches`;

  constructor(private http: HttpClient) {}

  /**
   * Obtiene todos los partidos de un torneo
   * @param tournamentId ID del torneo
   * @returns Observable con array de partidos
   */
  getByTournament(tournamentId: string): Observable<MatchWithDetails[]> {
    return this.http.get<MatchWithDetails[]>(`${environment.apiUrl}/tournaments/${tournamentId}/matches`)
      .pipe(catchError(this.handleError));
  }

  /**
   * Obtiene un partido por su ID
   * @param id ID del partido
   * @returns Observable con el partido detallado
   */
  getById(id: string): Observable<MatchWithDetails> {
    return this.http.get<MatchWithDetails>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  /**
   * Crea un nuevo partido
   * @param match Datos del partido a crear
   * @returns Observable con el partido creado
   */
  create(match: CreateMatchRequest): Observable<Match> {
    return this.http.post<Match>(this.apiUrl, match)
      .pipe(catchError(this.handleError));
  }

  /**
   * Actualiza un partido existente
   * @param id ID del partido
   * @param match Datos a actualizar
   * @returns Observable con el partido actualizado
   */
  update(id: string, match: UpdateMatchRequest): Observable<Match> {
    return this.http.put<Match>(`${this.apiUrl}/${id}`, match)
      .pipe(catchError(this.handleError));
  }

  /**
   * Elimina un partido
   * @param id ID del partido
   * @returns Observable vacío
   */
  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  /**
   * Inicia un partido (cambia su estado a 'ongoing')
   * @param matchId ID del partido
   * @returns Observable con el partido actualizado
   */
  start(matchId: string): Observable<Match> {
    return this.http.post<Match>(`${this.apiUrl}/${matchId}/start`, {})
      .pipe(catchError(this.handleError));
  }

  /**
   * Finaliza un partido (cambia su estado a 'finished')
   * @param matchId ID del partido
   * @returns Observable con el partido actualizado
   */
  finish(matchId: string): Observable<Match> {
    return this.http.post<Match>(`${this.apiUrl}/${matchId}/finish`, {})
      .pipe(catchError(this.handleError));
  }

  /**
   * Actualiza el marcador de un partido
   * @param matchId ID del partido
   * @param scoreHome Goles equipo local
   * @param scoreAway Goles equipo visitante
   * @returns Observable con el partido actualizado
   */
  updateScore(matchId: string, scoreHome: number, scoreAway: number): Observable<Match> {
    return this.http.patch<Match>(`${this.apiUrl}/${matchId}/score`, { scoreHome, scoreAway })
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
    
    console.error('Error en MatchService:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
