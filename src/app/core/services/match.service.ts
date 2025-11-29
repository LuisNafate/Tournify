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
    // Extraer tournamentId del request
    const tournamentId = match.tournamentId;
    if (!tournamentId) {
      return throwError(() => new Error('Tournament ID is required'));
    }

    // Preparar request para el backend
    // Enviamos los datos tal cual, el backend debe manejar estos nombres
    const backendRequest: any = {
      homeTeamId: match.homeTeamId,
      awayTeamId: match.awayTeamId,
      matchNumber: match.matchNumber
    };

    // Campos opcionales
    if (match.scheduledAt) backendRequest.scheduledAt = match.scheduledAt;
    if (match.location) backendRequest.location = match.location;
    if (match.roundName) backendRequest.roundName = match.roundName;
    if (match.roundNumber) backendRequest.roundNumber = match.roundNumber;
    if (match.groupId) backendRequest.groupId = match.groupId;
    if (match.refereeId) backendRequest.refereeId = match.refereeId;

    console.log('MatchService: Sending to backend:', backendRequest);

    return this.http.post<Match>(`${environment.apiUrl}/tournaments/${tournamentId}/matches`, backendRequest)
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
   * @param score1 Marcador equipo 1
   * @param score2 Marcador equipo 2
   * @param winnerId ID del equipo ganador (opcional)
   * @param status Estado del partido (opcional)
   * @param notes Notas del partido (opcional)
   * @returns Observable con el partido actualizado
   */
  updateScore(
    matchId: string, 
    score1: number, 
    score2: number, 
    winnerId?: string,
    status?: string,
    notes?: string
  ): Observable<Match> {
    const body: any = { score1, score2 };
    if (winnerId) body.winnerId = winnerId;
    if (status) body.status = status;
    if (notes) body.notes = notes;
    
    return this.http.put<Match>(`${this.apiUrl}/${matchId}/result`, body)
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
