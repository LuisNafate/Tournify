import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { User, UserProfile, UpdateUserRequest } from '../models/user.model';

/**
 * Servicio de Usuarios
 * Maneja operaciones relacionadas con el perfil del usuario
 */
@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) {}

  /**
   * Obtiene el perfil del usuario autenticado
   * @returns Observable con el perfil del usuario
   */
  getProfile(): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${this.apiUrl}/me`)
      .pipe(catchError(this.handleError));
  }

  /**
   * Actualiza el perfil del usuario autenticado
   * @param userData Datos a actualizar
   * @returns Observable con el usuario actualizado
   */
  updateProfile(userData: UpdateUserRequest): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/me`, userData)
      .pipe(catchError(this.handleError));
  }

  /**
   * Sube un avatar para el usuario (placeholder para S3)
   * @param file Archivo de imagen
   * @returns Observable con la URL del avatar
   */
  uploadAvatar(file: File): Observable<{ avatarUrl: string }> {
    const formData = new FormData();
    formData.append('avatar', file);

    return this.http.post<{ avatarUrl: string }>(`${this.apiUrl}/me/avatar`, formData)
      .pipe(catchError(this.handleError));
  }

  /**
   * Maneja errores de HTTP
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Ocurrió un error desconocido';
    
    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Error del lado del servidor
      errorMessage = error.error?.message || `Error ${error.status}: ${error.statusText}`;
    }
    
    console.error('Error en UserService:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
