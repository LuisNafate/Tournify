import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import {
  TournamentGroup,
  GroupStanding,
  GroupStandingWithDetails,
  GroupWithStandings,
  TournamentGroupsData,
  GenerateGroupsRequest,
  AssignTeamsToGroupsRequest,
  GenerateGroupMatchesRequest
} from '../models/group.model';

/**
 * Servicio de Grupos
 * Maneja todas las operaciones relacionadas con grupos de torneos
 */
@Injectable({
  providedIn: 'root'
})
export class GroupService {
  private apiUrl = `${environment.apiUrl}/tournaments`;

  constructor(private http: HttpClient) {}

  /**
   * Obtiene todos los grupos de un torneo con sus tablas de posiciones
   * @param tournamentId ID del torneo
   * @returns Observable con los datos de grupos
   */
  getGroupsByTournament(tournamentId: string): Observable<TournamentGroupsData> {
    return this.http.get<any>(`${this.apiUrl}/${tournamentId}/groups`)
      .pipe(
        map(response => this.transformGroupsResponse(response)),
        catchError(this.handleError)
      );
  }

  /**
   * Obtiene un grupo específico por ID
   * @param groupId ID del grupo
   * @returns Observable con el grupo
   */
  getGroupById(groupId: string): Observable<TournamentGroup> {
    return this.http.get<TournamentGroup>(`${environment.apiUrl}/groups/${groupId}`)
      .pipe(catchError(this.handleError));
  }

  /**
   * Obtiene la tabla de posiciones de un grupo específico
   * @param groupId ID del grupo
   * @returns Observable con la tabla de posiciones
   */
  getGroupStandings(groupId: string): Observable<GroupStandingWithDetails[]> {
    return this.http.get<any>(`${environment.apiUrl}/groups/${groupId}/standings`)
      .pipe(
        map(response => this.transformStandingsResponse(response)),
        catchError(this.handleError)
      );
  }

  /**
   * Genera los grupos para un torneo
   * Caso de uso: GenerateGroupsUseCase
   * @param request Datos para generar grupos
   * @returns Observable con los grupos creados
   */
  generateGroups(request: GenerateGroupsRequest): Observable<TournamentGroup[]> {
    return this.http.post<TournamentGroup[]>(
      `${this.apiUrl}/${request.tournamentId}/groups/generate`,
      { numberOfGroups: request.numberOfGroups }
    ).pipe(catchError(this.handleError));
  }

  /**
   * Asigna equipos a los grupos creados
   * Caso de uso: AssignTeamsToGroupsUseCase
   * @param request Datos para asignar equipos
   * @returns Observable con el resultado
   */
  assignTeamsToGroups(request: AssignTeamsToGroupsRequest): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}/${request.tournamentId}/groups/assign-teams`,
      { randomize: request.randomize ?? true }
    ).pipe(catchError(this.handleError));
  }

  /**
   * Genera los partidos de fase de grupos (Round Robin)
   * Caso de uso: GenerateGroupMatchesUseCase
   * @param request Datos para generar partidos
   * @returns Observable con los partidos creados
   */
  generateGroupMatches(request: GenerateGroupMatchesRequest): Observable<any> {
    const body = request.startDate ? { startDate: request.startDate } : {};
    return this.http.post<any>(
      `${this.apiUrl}/${request.tournamentId}/groups/generate-matches`,
      body
    ).pipe(catchError(this.handleError));
  }

  /**
   * Automatiza todo el proceso: crear grupos, asignar equipos y generar partidos
   * @param tournamentId ID del torneo
   * @param numberOfGroups Número de grupos a crear
   * @param randomize Si se asignan equipos aleatoriamente
   * @param startDate Fecha de inicio de los partidos (opcional)
   * @returns Observable con el resultado completo
   */
  automateGroupPhase(
    tournamentId: string,
    numberOfGroups: number,
    randomize: boolean = true,
    startDate?: string
  ): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}/${tournamentId}/groups/automate`,
      {
        numberOfGroups,
        randomize,
        startDate
      }
    ).pipe(catchError(this.handleError));
  }

  /**
   * Transforma la respuesta del backend al formato esperado
   * @param response Respuesta del backend
   */
  private transformGroupsResponse(response: any): TournamentGroupsData {
    // Si la respuesta ya está en el formato correcto, retornarla
    if (response.groups && Array.isArray(response.groups)) {
      return {
        groups: response.groups.map((g: any) => this.transformGroupWithStandings(g)),
        totalGroups: response.totalGroups || response.groups.length
      };
    }

    // Si la respuesta es un array directo de grupos
    if (Array.isArray(response)) {
      return {
        groups: response.map((g: any) => this.transformGroupWithStandings(g)),
        totalGroups: response.length
      };
    }

    // Formato vacío por defecto
    return {
      groups: [],
      totalGroups: 0
    };
  }

  /**
   * Transforma un grupo con sus standings
   */
  private transformGroupWithStandings(data: any): GroupWithStandings {
    return {
      group: {
        id: data.id || data.groupId,
        tournamentId: data.tournamentId,
        name: data.name || `Grupo ${data.groupNumber || ''}`,
        groupNumber: data.groupNumber || 0,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt
      },
      standings: Array.isArray(data.standings)
        ? data.standings.map((s: any) => this.transformStanding(s))
        : []
    };
  }

  /**
   * Transforma standings del backend
   */
  private transformStandingsResponse(response: any): GroupStandingWithDetails[] {
    if (Array.isArray(response)) {
      return response.map(s => this.transformStanding(s));
    }
    return [];
  }

  /**
   * Transforma un standing individual
   */
  private transformStanding(standing: any): GroupStandingWithDetails {
    return {
      id: standing.id,
      groupId: standing.groupId,
      teamId: standing.teamId,
      played: standing.played || 0,
      won: standing.won || 0,
      drawn: standing.drawn || 0,
      lost: standing.lost || 0,
      goalsFor: standing.goalsFor || 0,
      goalsAgainst: standing.goalsAgainst || 0,
      goalDifference: standing.goalDifference || 0,
      points: standing.points || 0,
      position: standing.position || 0,
      updatedAt: standing.updatedAt,
      team: standing.team ? {
        id: standing.team.id || standing.teamId,
        name: standing.team.name || standing.teamName || 'Equipo',
        logoUrl: standing.team.logoUrl || standing.teamLogoUrl
      } : undefined,
      group: standing.group ? {
        id: standing.group.id || standing.groupId,
        name: standing.group.name || `Grupo ${standing.groupNumber || ''}`,
        groupNumber: standing.group.groupNumber || 0
      } : undefined
    };
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

    console.error('Error en GroupService:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
