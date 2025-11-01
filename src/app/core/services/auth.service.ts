import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../models/user.model'; //

@Injectable({
  providedIn: 'root' 
})
export class AuthService {


  private usuarioActualSubject = new BehaviorSubject<User | null>(null);

  public usuarioActual$: Observable<User | null> = this.usuarioActualSubject.asObservable();
  constructor(private router: Router) {
  }
  public login(email: string, contrasena: string): void {
    
    // SIMULACIÓN 
    
    // Creamos un usuario falso 
    const fakeUser: User = {
      id: 'user-123',
      username: 'Luvia Magali Hidalgo', 
      email: email,
      role: 'organizer' // Le damos rol de organizador para probar
    };
 

    this.router.navigate(['/tournaments/list']);
    this.usuarioActualSubject.next(fakeUser);
  

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
