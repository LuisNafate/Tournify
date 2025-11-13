import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

/**
 * Interceptor JWT
 * Intercepta todas las peticiones HTTP y adjunta el token JWT en el header Authorization
 */
@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  constructor(private router: Router) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Obtener token del localStorage
    const token = this.getToken();

    // Si existe token, clonar la petición y agregar el header Authorization
    if (token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    // Continuar con la petición y manejar errores
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        // Si el error es 401 (Unauthorized), redirigir al login
        // PERO solo si NO es una petición de login o register
        if (error.status === 401 && !this.isAuthEndpoint(request.url)) {
          this.handleUnauthorized();
        }
        return throwError(() => error);
      })
    );
  }

  /**
   * Verifica si la URL es un endpoint de autenticación
   */
  private isAuthEndpoint(url: string): boolean {
    return url.includes('/auth/login') || url.includes('/auth/register');
  }

  /**
   * Obtiene el token del localStorage
   */
  private getToken(): string | null {
    return localStorage.getItem(environment.tokenKey);
  }

  /**
   * Maneja respuestas no autorizadas
   */
  private handleUnauthorized(): void {
    // Limpiar token y redirigir al login
    localStorage.removeItem(environment.tokenKey);
    localStorage.removeItem(environment.userKey);
    this.router.navigate(['/login']);
  }
}
