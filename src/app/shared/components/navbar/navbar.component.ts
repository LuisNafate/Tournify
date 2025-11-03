import { Component } from '@angular/core';
import { Observable } from 'rxjs'; 
import { AuthService } from '../../../core/services/auth.service'; 
import { User } from '../../../core/models/user.model'; 

// Componente de navegación
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {

  public usuarioActual$: Observable<User | null>;

  constructor(private authService: AuthService) {

    this.usuarioActual$ = this.authService.usuarioActual$;
  }

  logout(): void {
    this.authService.logout();
  }
}