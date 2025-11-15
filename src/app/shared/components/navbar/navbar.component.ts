import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { Observable, Subscription } from 'rxjs'; 
import { AuthService } from '../../../core/services/auth.service'; 
import { User } from '../../../core/models/user.model'; 

// Componente de navegación
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, OnDestroy {

  public usuarioActual$: Observable<User | null>;
  public isDropdownOpen = false;
  private clickListener?: () => void;

  constructor(private authService: AuthService) {
    this.usuarioActual$ = this.authService.usuarioActual$;
  }

  ngOnInit(): void {
    // Listener para cerrar dropdown al hacer click fuera
    this.clickListener = () => {
      if (this.isDropdownOpen) {
        this.isDropdownOpen = false;
      }
    };
  }

  ngOnDestroy(): void {
    if (this.clickListener) {
      document.removeEventListener('click', this.clickListener);
    }
  }

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  closeDropdown(): void {
    this.isDropdownOpen = false;
  }

  logout(): void {
    this.closeDropdown();
    this.authService.logout();
  }

  getRoleLabel(role: string): string {
    const roleLabels: { [key: string]: string } = {
      'player': 'Jugador',
      'organizer': 'Organizador',
      'referee': 'Árbitro'
    };
    return roleLabels[role] || role;
  }
}