import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const currentUser = this.authService.usuarioActualValue;

    if (currentUser && currentUser.role === 'admin') {
      return true;
    }

    // Si no es admin, redirigir al home
    alert('No tienes permisos de administrador para acceder a esta página');
    this.router.navigate(['/home']);
    return false;
  }
}
