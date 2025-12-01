import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService, UserListItem } from '../../services/admin.service';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-users.component.html',
  styleUrl: './admin-users.component.css'
})
export class AdminUsersComponent implements OnInit {
  users: any[] = [];
  loading = false;
  error: string | null = null;
  searchTerm = '';
  currentPage = 0;
  pageSize = 20;
  totalPages = 1;

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading = true;
    this.error = null;

    this.adminService.getUsers(this.currentPage, this.pageSize, this.searchTerm).subscribe({
      next: (response) => {
        this.users = Array.isArray(response) ? response : response.content || [];
        this.totalPages = response.totalPages || 1;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading users:', err);
        this.error = 'Error al cargar los usuarios';
        this.loading = false;
      }
    });
  }

  onSearch(): void {
    this.currentPage = 0;
    this.loadUsers();
  }

  changeUserRole(userId: string, currentRole: string): void {
    const roles = ['player', 'organizer', 'referee', 'admin'];
    const currentIndex = roles.indexOf(currentRole);
    const newRole = roles[(currentIndex + 1) % roles.length];

    const confirmed = confirm(`¿Cambiar rol de ${currentRole} a ${newRole}?`);
    if (!confirmed) return;

    this.adminService.updateUserRole(userId, newRole).subscribe({
      next: () => {
        alert('Rol actualizado exitosamente');
        this.loadUsers();
      },
      error: (err) => {
        console.error('Error updating role:', err);
        alert('Error al actualizar el rol');
      }
    });
  }

  toggleUserStatus(userId: string, currentStatus: boolean): void {
    const action = currentStatus ? 'desactivar' : 'activar';
    const confirmed = confirm(`¿Estás seguro de que deseas ${action} este usuario?`);
    if (!confirmed) return;

    this.adminService.updateUserStatus(userId, !currentStatus).subscribe({
      next: () => {
        alert(`Usuario ${action}do exitosamente`);
        this.loadUsers();
      },
      error: (err) => {
        console.error('Error updating status:', err);
        alert('Error al actualizar el estado del usuario');
      }
    });
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
      this.loadUsers();
    }
  }

  previousPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.loadUsers();
    }
  }

  getRoleBadgeClass(role: string): string {
    const classes: { [key: string]: string } = {
      'admin': 'role-admin',
      'organizer': 'role-organizer',
      'referee': 'role-referee',
      'player': 'role-player'
    };
    return classes[role] || 'role-player';
  }
}
