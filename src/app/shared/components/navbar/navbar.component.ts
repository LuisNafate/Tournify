import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';
import { User } from '../../../core/models/user.model';
import { filter } from 'rxjs/operators'; 

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

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    this.usuarioActual$ = this.authService.usuarioActual$;
  }

  ngOnInit(): void {
    // Refrescar perfil del usuario para obtener avatar actualizado
    if (this.authService.isAuthenticated()) {
      this.authService.getProfile().subscribe({
        next: () => console.log('Perfil actualizado'),
        error: (err) => console.error('Error al actualizar perfil:', err)
      });
    }

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

  scrollToNews(event: Event): void {
    event.preventDefault();

    // Si ya estamos en la página principal
    if (this.router.url === '/' || this.router.url === '') {
      this.scrollToElement('noticias');
    } else {
      // Si estamos en otra página, navegar primero y luego hacer scroll
      this.router.navigate(['/']).then(() => {
        setTimeout(() => {
          this.scrollToElement('noticias');
        }, 100);
      });
    }
  }

  private scrollToElement(elementId: string): void {
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  }
}