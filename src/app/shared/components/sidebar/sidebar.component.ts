import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from 'src/app/core/services/auth.service';
import { User } from 'src/app/core/models/user.model';

@Component({
  selector: 'app-sidebar',
  standalone: true, 
  imports: [
    RouterModule,
    CommonModule
  ],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  currentUser: User | null = null;

  constructor(
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.usuarioActualValue;
    
    // Suscribirse a cambios en el usuario (incluye cambios de rol)
    this.authService.usuarioActual$.subscribe(user => {
      this.currentUser = user;
      // Forzar detección de cambios cuando cambie el usuario/rol
      if (user) {
        console.log('Sidebar actualizado - Rol actual:', user.role);
        this.cdr.detectChanges();
      }
    });
  }

  isPlayer(): boolean {
    return this.currentUser?.role === 'player';
  }

  isOrganizer(): boolean {
    return this.currentUser?.role === 'organizer';
  }

  isReferee(): boolean {
    return this.currentUser?.role === 'referee';
  }
}