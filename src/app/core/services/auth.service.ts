import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { User } from '../models/user.model'; //

@Injectable({
  providedIn: 'root' 
})
export class AuthService {


  private usuarioActualSubject = new BehaviorSubject<User | null>(null);

  public usuarioActual$: Observable<User | null> = this.usuarioActualSubject.asObservable();
  constructor(private router: Router) {
  }
  public login(email: string, contrasena: string): Observable<User> {
    // --- SIMULACIÓN DE LOGIN ---
    
    if (email === 'test@tournify.com' && contrasena === 'password') {
      const fakeUser: User = {
        id: 'user-123',
        username: 'Luvia Magali Hidalgo',
        email: email,
        role: 'organizer'
      };
      this.usuarioActualSubject.next(fakeUser);
      return of(fakeUser);
    } else {
      return throwError(() => new Error('Credenciales incorrectas.'));
    }
  }

  // Simular un registro
  public register(username: string, email: string, contrasena: string, role: 'player' | 'organizer' | 'referee'): void {
    
    //  SIMULACIÓN 
    
    const fakeUser: User = {
      id: 'user-456',
      username: 'Luis Alberto Nafate',
      email: email,
      role: role
    };
     this.router.navigate(['/tournaments/list']);
    this.usuarioActualSubject.next(fakeUser);
}
// Cerrar la sesión del usuario
   
  public logout(): void {
    this.usuarioActualSubject.next(null);
    
    this.router.navigate(['/']);
  }

  public get usuarioActualValue(): User | null {
    return this.usuarioActualSubject.value;
  }
}
