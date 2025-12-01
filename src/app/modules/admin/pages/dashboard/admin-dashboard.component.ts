import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AdminService, AdminStats } from '../../services/admin.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent implements OnInit {
  stats: AdminStats | null = null;
  loading = false;
  error: string | null = null;
  recentTournaments: any[] = [];

  constructor(
    private adminService: AdminService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats(): void {
    this.loading = true;
    this.error = null;

    this.adminService.getStats().subscribe({
      next: (stats) => {
        this.stats = stats;
        this.loading = false;
        // Cargar torneos recientes para mostrar en el dashboard
        this.loadRecentTournaments();
      },
      error: (err) => {
        console.error('Error loading stats:', err);
        this.error = 'Error al cargar las estadísticas';
        this.loading = false;
      }
    });
  }

  loadRecentTournaments(): void {
    // intentamos obtener algunos torneos recientes (primeros 6)
    this.adminService.getTournaments(0, 6).subscribe({
      next: (res) => {
        // El backend puede devolver distintas formas; intentamos normalizar
        let items: any[] = [];
        if (res?.content && Array.isArray(res.content)) items = res.content;
        else if (res?.tournaments && Array.isArray(res.tournaments)) items = res.tournaments;
        else if (Array.isArray(res)) items = res;
        else if (res?.items && Array.isArray(res.items)) items = res.items;

        // Guardar solo lo necesario
        this.recentTournaments = items.map(i => ({
          id: i.id,
          name: i.name,
          organizerName: i.organizerName || i.organizer?.username || i.organizerName,
          status: i.status,
          imageUrl: i.imageUrl || i.bannerUrl || i.banner || null
        }));
      },
      error: (err) => {
        console.warn('No se pudieron cargar torneos recientes:', err);
      }
    });
  }

  navigateToUsers(): void {
    this.router.navigate(['/admin/users']);
  }

  navigateToTournaments(): void {
    this.router.navigate(['/admin/tournaments']);
  }
}
