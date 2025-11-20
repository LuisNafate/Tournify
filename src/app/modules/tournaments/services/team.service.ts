import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import {
  Team,
  TeamWithMembers,
  CreateTeamRequest,
  UpdateTeamRequest,
  AddMemberRequest,
  TeamMember
} from '../../../core/models/team.model';

/**
 * Servicio de Equipos
 * Maneja todas las operaciones relacionadas con equipos
 */
@Injectable({ providedIn: 'root' })
export class TeamService {
  private apiUrl = `${environment.apiUrl}/teams`;

  constructor(private http: HttpClient) {}

  /**
   * Obtiene todos los equipos del usuario actual
   * GET /teams/my
   */
  getMyTeams(): Observable<Team[]> {
    const url = `${this.apiUrl}/my`;
    console.log('[TeamService] Solicitando equipos desde:', url);

    return this.http.get<Team[]>(url)
      .pipe(
        tap((teams) => console.log('[TeamService] Equipos recibidos:', teams)),
        catchError((error) => {
          console.error('[TeamService] Error al obtener equipos:', error);
          return this.handleError(error);
        })
      );
  }

  /**
   * Obtiene un equipo por su ID con detalles completos
   * GET /teams/{id}
   */
  getTeamById(id: string): Observable<TeamWithMembers> {
    return this.http.get<TeamWithMembers>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  /**
   * Crea un nuevo equipo
   * POST /teams
   */
  createTeam(payload: CreateTeamRequest): Observable<Team> {
    return this.http.post<Team>(this.apiUrl, payload)
      .pipe(catchError(this.handleError));
  }

  /**
   * Actualiza un equipo existente
   * PUT /teams/{id}
   */
  updateTeam(id: string, payload: UpdateTeamRequest): Observable<Team> {
    return this.http.put<Team>(`${this.apiUrl}/${id}`, payload)
      .pipe(catchError(this.handleError));
  }

  /**
   * Elimina un equipo
   * DELETE /teams/{id}
   */
  deleteTeam(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  /**
   * Agrega un miembro al equipo
   * POST /teams/{id}/members
   */
  addMember(teamId: string, member: AddMemberRequest): Observable<TeamMember> {
    return this.http.post<TeamMember>(`${this.apiUrl}/${teamId}/members`, member)
      .pipe(catchError(this.handleError));
  }

  /**
   * Elimina un miembro del equipo
   * DELETE /teams/{teamId}/members/{memberId}
   */
  removeMember(teamId: string, memberId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${teamId}/members/${memberId}`)
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
      errorMessage = error.error?.message || error.error?.error || `Error ${error.status}: ${error.statusText}`;
    }

    console.error('Error en TeamService:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
