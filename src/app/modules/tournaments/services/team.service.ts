import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';

export interface CreateTeamRequest {
  name: string;
  membersCount: number;
  captainName?: string;
  captainEmail?: string;
  captainPhone?: string;
  additionalInfo?: string;
}

@Injectable({ providedIn: 'root' })
export class TeamService {
  private apiBase = `${environment.apiUrl}`;
  constructor(private http: HttpClient) {}

  // Crea un equipo vinculado a un torneo
  createTeam(tournamentId: number, payload: CreateTeamRequest): Observable<any> {
    // se asume endpoint POST /tournaments/:id/teams
    return this.http.post<any>(`${this.apiBase}/tournaments/${tournamentId}/teams`, payload)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    const msg = error.error?.message || `Error ${error.status}: ${error.statusText}`;
    console.error('TeamService error', msg);
    return throwError(() => new Error(msg));
  }
}
