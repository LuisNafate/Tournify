import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

// Guard para proteger rutas que requieren autenticación
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const usuario = this.authService.usuarioActualValue;

    if (usuario) {
      // Usuario autenticado, permite el acceso
      return true;
    }

    // Usuario no autenticado, guarda la URL y redirige al login
    alert('Debes iniciar sesión o registrarte para crear un torneo');

    // Guardar la URL a la que se quiere acceder
    sessionStorage.setItem('returnUrl', state.url);

    this.router.navigate(['/auth/login']);
    return false;
  }
}
