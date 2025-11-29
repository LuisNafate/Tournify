import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { 
  Sport, 
  CreateSportRequest, 
  UpdateSportRequest 
} from '../models/sport.model';

/**
 * Servicio de Deportes
 * Maneja el catálogo de deportes disponibles en la plataforma
 */
@Injectable({
  providedIn: 'root'
})
export class SportService {
  private apiUrl = `${environment.apiUrl}/sports`;

  constructor(private http: HttpClient) {}

  /**
   * Obtiene todos los deportes
   * @returns Observable con array de deportes
   */
  getAll(): Observable<Sport[]> {
    return this.http.get<Sport[]>(this.apiUrl)
      .pipe(catchError(this.handleError));
  }

  /**
   * Obtiene un deporte por su ID
   * @param id ID del deporte
   * @returns Observable con el deporte
   */
  getById(id: string): Observable<Sport> {
    return this.http.get<Sport>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  /**
   * Obtiene deportes por categoría
   * @param category Categoría del deporte ('sport' | 'esport')
   * @returns Observable con array de deportes
   */
  getByCategory(category: 'sport' | 'esport'): Observable<Sport[]> {
    return this.http.get<Sport[]>(`${this.apiUrl}?category=${category}`)
      .pipe(catchError(this.handleError));
  }

  /**
   * Crea un nuevo deporte (solo administradores)
   * @param sport Datos del deporte a crear
   * @returns Observable con el deporte creado
   */
  create(sport: CreateSportRequest): Observable<Sport> {
    return this.http.post<Sport>(this.apiUrl, sport)
      .pipe(catchError(this.handleError));
  }

  /**
   * Actualiza un deporte existente (solo administradores)
   * @param id ID del deporte
   * @param sport Datos a actualizar
   * @returns Observable con el deporte actualizado
   */
  update(id: string, sport: UpdateSportRequest): Observable<Sport> {
    return this.http.put<Sport>(`${this.apiUrl}/${id}`, sport)
      .pipe(catchError(this.handleError));
  }

  /**
   * Elimina un deporte (solo administradores)
   * @param id ID del deporte
   * @returns Observable vacío
   */
  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`)
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
    
    console.error('Error en SportService:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
