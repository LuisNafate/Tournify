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
  public login(email: string, contrasena: string): void {
    
    // SIMULACIÓN 

    console.log('Simulando inicio de sesión para:', email);
    
    // Creamos un usuario falso 
    const fakeUser: User = {
      id: 'user-123',
      username: 'Luvia Magali Hidalgo', 
      email: email,
      role: 'organizer' // Le damos rol de organizador para probar
    };
 


    this.usuarioActualSubject.next(fakeUser);
  

  }
}
