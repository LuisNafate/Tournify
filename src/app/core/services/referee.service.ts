import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { MatchWithDetails } from '../models/match.model';

/**
 * Servicio de Árbitros
 * Maneja las operaciones específicas para usuarios con rol de árbitro
 */
@Injectable({
  providedIn: 'root'
})
export class RefereeService {
  private apiUrl = `${environment.apiUrl}/referees`;

  constructor(private http: HttpClient) {}

  /**
   * Obtiene los partidos asignados al árbitro autenticado
   * Solo incluye partidos donde el árbitro está asignado directamente (campo refereeId)
   */
  getMyMatches(): Observable<MatchWithDetails[]> {
    return this.http.get<MatchWithDetails[]>(`${this.apiUrl}/my-matches`);
  }
}
