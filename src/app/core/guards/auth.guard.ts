import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

// Guard para proteger rutas (sin lógica)
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  
  constructor(private router: Router) {}

  canActivate(): boolean {
    // Lógica de autenticación pendiente
    return true;
  }
}
