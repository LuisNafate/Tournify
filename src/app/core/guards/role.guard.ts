import { Injectable } from '@angular/core';
import { 
  CanActivate, 
  Router, 
  ActivatedRouteSnapshot, 
  RouterStateSnapshot,
  UrlTree 
} from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { UserRole } from '../models/auth.models';

/**
 * Guard de Roles
 * Protege rutas basándose en roles de usuario
 */
@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot, 
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | boolean | UrlTree {
    const expectedRoles = route.data['roles'] as UserRole[];
    
    if (!expectedRoles || expectedRoles.length === 0) {
      // Si no se especifican roles, solo verificar autenticación
      return true;
    }

    return this.authService.user$.pipe(
      take(1),
      map(user => {
        if (!user) {
          // Usuario no autenticado
          sessionStorage.setItem('returnUrl', state.url);
          return this.router.createUrlTree(['/login']);
        }

        // Verificar si el usuario tiene alguno de los roles requeridos
        if (expectedRoles.includes(user.role)) {
          return true;
        }

        // Usuario autenticado pero sin permisos
        console.warn(`Acceso denegado. Se requiere rol: ${expectedRoles.join(', ')}`);
        return this.router.createUrlTree(['/unauthorized']);
      })
    );
  }
}
