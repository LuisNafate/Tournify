import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface AdminStats {
  totalUsers: number;
  totalTournaments: number;
  totalTeams: number;
  totalMatches: number;
  activeTournaments: number;
  pendingRegistrations: number;
}

export interface UserListItem {
  id: string;
  username: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: string;
}

export interface TournamentListItem {
  id: string;
  name: string;
  organizerName: string;
  status: string;
  currentTeams: number;
  maxTeams: number;
  createdAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = `${environment.apiUrl}/admin`;

  constructor(private http: HttpClient) {}

  /**
   * Obtener estadísticas globales
   * GET /admin/stats
   */
  getStats(): Observable<AdminStats> {
    return this.http.get<AdminStats>(`${this.apiUrl}/stats`);
  }

  /**
   * Obtener lista de usuarios
   * GET /admin/users
   */
  getUsers(page: number = 0, size: number = 20, search?: string): Observable<any> {
    let params = new HttpParams()
      .set('page', (page + 1).toString())
      .set('size', size.toString());

    if (search) {
      params = params.set('search', search);
    }

    return this.http.get<any>(`${this.apiUrl}/users`, { params });
  }

  /**
   * Actualizar rol de usuario
   * PUT /admin/users/{userId}/role
   */
  updateUserRole(userId: string, role: string): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/users/${userId}/role`, { role });
  }

  /**
   * Activar/desactivar usuario
   * PUT /admin/users/{userId}/status
   */
  updateUserStatus(userId: string, isActive: boolean): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/users/${userId}/status`, { isActive });
  }

  /**
   * Obtener lista de torneos (admin)
   * GET /admin/tournaments
   */
  getTournaments(page: number = 0, size: number = 20, status?: string): Observable<any> {
    let params = new HttpParams()
      .set('page', (page + 1).toString())
      .set('size', size.toString());

    if (status) {
      params = params.set('status', status);
    }

    return this.http.get<any>(`${this.apiUrl}/tournaments`, { params });
  }

  /**
   * Eliminar torneo (admin)
   * DELETE /admin/tournaments/{tournamentId}
   */
  deleteTournament(tournamentId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/tournaments/${tournamentId}`);
  }

  /**
   * Suspender torneo
   * PUT /admin/tournaments/{tournamentId}/suspend
   */
  suspendTournament(tournamentId: string, reason: string): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/tournaments/${tournamentId}/suspend`, { reason });
  }
}
