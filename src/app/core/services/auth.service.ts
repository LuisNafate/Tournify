import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { User } from '../models/user.model';
import { 
  AuthResponse, 
  LoginRequest, 
  RegisterRequest,
  AuthUser 
} from '../models/auth.models';

@Injectable({
  providedIn: 'root' 
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;
  private usuarioActualSubject = new BehaviorSubject<User | null>(this.getUserFromStorage());
  public usuarioActual$: Observable<User | null> = this.usuarioActualSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  /**
   * Inicia sesión con email y contraseña
   * @param email Email del usuario
   * @param password Contraseña
   * @returns Observable con el usuario autenticado
   */
  public login(email: string, password: string): Observable<User> {
    const loginRequest: LoginRequest = { email, password };
    
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, loginRequest)
      .pipe(
        tap(response => {
          console.log('[LOGIN] Respuesta del backend:', response);
          this.handleAuthResponse(response);
        }),
        map(response => this.authUserToUser(response.user)),
        catchError(this.handleError)
      );
  }

  /**
   * Registra un nuevo usuario
   * @param username Nombre de usuario
   * @param email Email
   * @param password Contraseña
   * @param firstName Nombre
   * @param lastName Apellido
   * @param role Rol del usuario
   * @returns Observable con el usuario registrado
   */
  public register(registerRequest: RegisterRequest): Observable<User> {
    return this.http.post<AuthUser>(`${this.apiUrl}/register`, registerRequest)
      .pipe(
        tap(response => {
          console.log('[REGISTER] Respuesta del backend:', response);
        }),
        map(response => this.authUserToUser(response)),
        catchError(this.handleError)
      );
  }

  /**
   * Cierra la sesión del usuario
   */
  public logout(): void {
    // Limpiar localStorage
    localStorage.removeItem(environment.tokenKey);
    localStorage.removeItem(environment.userKey);
    
    // Limpiar subject
    this.usuarioActualSubject.next(null);
    
    // Redirigir al home
    this.router.navigate(['/']);
  }

  /**
   * Verifica si el usuario está autenticado
   */
  public isAuthenticated(): boolean {
    return !!this.getToken();
  }

  /**
   * Obtiene el token del localStorage
   */
  public getToken(): string | null {
    return localStorage.getItem(environment.tokenKey);
  }

  /**
   * Obtiene el usuario actual
   */
  public get usuarioActualValue(): User | null {
    return this.usuarioActualSubject.value;
  }

  /**
   * Obtiene información del perfil del usuario autenticado
   */
  public getProfile(): Observable<User> {
    return this.http.get<AuthUser>(`${environment.apiUrl}/users/me`)
      .pipe(
        map(authUser => this.authUserToUser(authUser)),
        tap(user => {
          this.usuarioActualSubject.next(user);
          this.saveUserToStorage(user);
        }),
        catchError(this.handleError)
      );
  }

  /**
   * Maneja la respuesta de autenticación
   */
  private handleAuthResponse(response: AuthResponse): void {
    // Validar que la respuesta tenga los datos necesarios
    if (!response || !response.token || !response.user) {
      console.error('[AUTH] Respuesta inválida del backend:', response);
      throw new Error('La respuesta del servidor no contiene los datos de autenticación necesarios');
    }

    // Guardar token
    localStorage.setItem(environment.tokenKey, response.token);
    
    // Convertir y guardar usuario
    const user = this.authUserToUser(response.user);
    this.saveUserToStorage(user);
    this.usuarioActualSubject.next(user);
  }

  /**
   * Convierte AuthUser a User
   */
  private authUserToUser(authUser: AuthUser): User {
    return {
      id: authUser.id,
      username: authUser.username,
      email: authUser.email,
      firstName: authUser.firstName,
      lastName: authUser.lastName,
      role: authUser.role,
      avatarUrl: authUser.avatarUrl
    };
  }

  /**
   * Guarda el usuario en localStorage
   */
  private saveUserToStorage(user: User): void {
    localStorage.setItem(environment.userKey, JSON.stringify(user));
  }

  /**
   * Obtiene el usuario del localStorage
   */
  private getUserFromStorage(): User | null {
    const userJson = localStorage.getItem(environment.userKey);
    return userJson ? JSON.parse(userJson) : null;
  }

  /**
   * Maneja errores de HTTP
   */
  private handleError(error: HttpErrorResponse | Error): Observable<never> {
    let errorMessage = 'Ocurrió un error desconocido';
    
    // Si es un error de JavaScript (no HTTP)
    if (error instanceof Error && !(error instanceof HttpErrorResponse)) {
      errorMessage = error.message;
      console.error('Error en AuthService:', errorMessage, error);
      return throwError(() => error);
    }
    
    const httpError = error as HttpErrorResponse;
    
    if (httpError.error instanceof ErrorEvent) {
      // Error del lado del cliente
      errorMessage = `Error: ${httpError.error.message}`;
    } else {
      // Error del lado del servidor
      if (httpError.status === 401) {
        errorMessage = 'Credenciales incorrectas';
      } else if (httpError.status === 400) {
        errorMessage = httpError.error?.message || 'Datos inválidos';
      } else if (httpError.status === 409) {
        errorMessage = 'El email ya está registrado';
      } else {
        errorMessage = httpError.error?.message || `Error ${httpError.status}: ${httpError.statusText}`;
      }
    }
    
    console.error('Error en AuthService:', errorMessage, httpError);
    return throwError(() => Object.assign(new Error(errorMessage), { status: httpError.status }));
  }
}
