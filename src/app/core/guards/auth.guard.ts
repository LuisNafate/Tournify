import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Guard para proteger rutas que requieren autenticación
 * Verifica si el usuario tiene un token válido antes de acceder a rutas protegidas
 */
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    // Verificar si el usuario está autenticado
    const isAuthenticated = this.authService.isAuthenticated();

    if (isAuthenticated) {
      // Usuario autenticado, permite el acceso
      return true;
    }

    // Usuario no autenticado, guarda la URL y redirige al login
    console.log('Usuario no autenticado. Redirigiendo a login...');

    // Guardar la URL a la que se quiere acceder
    sessionStorage.setItem('returnUrl', state.url);

    // Redirigir al login
    this.router.navigate(['/auth/login'], {
      queryParams: { returnUrl: state.url }
    });
    
    return false;
  }
}
