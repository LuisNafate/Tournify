import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import { UserService } from 'src/app/core/services/user.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-role-switcher',
  templateUrl: './role-switcher.component.html',
  styleUrls: ['./role-switcher.component.css']
})
export class RoleSwitcherComponent implements OnInit, OnDestroy {
  currentRole: string = 'player';
  isChanging: boolean = false;
  showDropdown: boolean = false;

  roles: Array<{ value: 'player' | 'organizer' | 'referee'; label: string; icon: string }> = [
    { value: 'player', label: 'Jugador', icon: '⚽' },
    { value: 'organizer', label: 'Organizador', icon: '📋' },
    { value: 'referee', label: 'Árbitro', icon: '🔔' }
  ];

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Obtener el rol actual del usuario
    const user = this.authService.usuarioActualValue;
    if (user) {
      this.currentRole = user.role;
    }

    // Suscribirse a cambios de usuario
    this.authService.usuarioActual$.subscribe(updatedUser => {
      if (updatedUser) {
        this.currentRole = updatedUser.role;
      }
    });

    // Cerrar dropdown al hacer clic fuera
    document.addEventListener('click', this.onDocumentClick.bind(this));
  }

  ngOnDestroy(): void {
    document.removeEventListener('click', this.onDocumentClick.bind(this));
  }

  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    const dropdown = document.querySelector('.role-switcher');
    
    if (dropdown && !dropdown.contains(target)) {
      this.showDropdown = false;
    }
  }

  getCurrentRoleLabel(): string {
    const role = this.roles.find(r => r.value === this.currentRole);
    return role ? role.label : 'Usuario';
  }

  getCurrentRoleIcon(): string {
    const role = this.roles.find(r => r.value === this.currentRole);
    return role ? role.icon : '👤';
  }

  toggleDropdown(): void {
    this.showDropdown = !this.showDropdown;
  }

  onRoleClick(role: string): void {
    this.switchRole(role as 'player' | 'organizer' | 'referee');
  }

  switchRole(newRole: 'player' | 'organizer' | 'referee'): void {
    if (newRole === this.currentRole || this.isChanging) {
      this.showDropdown = false;
      return;
    }

    this.isChanging = true;
    
    this.userService.switchRole(newRole).subscribe({
      next: (response) => {
        // Actualizar el token en localStorage
        localStorage.setItem(environment.tokenKey, response.token);
        
        // Actualizar el usuario en localStorage
        localStorage.setItem(environment.userKey, JSON.stringify(response.user));
        
        // Actualizar el rol actual
        this.currentRole = response.user.role;
        
        // Notificar al AuthService
        this.authService['usuarioActualSubject'].next(response.user);
        
        this.isChanging = false;
        this.showDropdown = false;
        
        // Redirigir al dashboard para refrescar la vista
        this.router.navigate(['/dashboard']).then(() => {
          window.location.reload();
        });
      },
      error: (err) => {
        console.error('Error al cambiar de rol:', err);
        this.isChanging = false;
        this.showDropdown = false;
        alert('Error al cambiar de rol. Inténtalo de nuevo.');
      }
    });
  }

  closeDropdown(): void {
    this.showDropdown = false;
  }
}
