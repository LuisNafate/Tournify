import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { TournamentService } from '../../services/tournament.service';
import { TeamRegistration } from '../../../../core/models/tournament.model';

@Component({
  selector: 'app-registrations',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './registrations.component.html',
  styleUrl: './registrations.component.css'
})
export class RegistrationsComponent implements OnInit {
  tournamentId!: string;
  registrations: any[] = [];
  loading = false;
  error: string | null = null;
  processingIds: Set<string> = new Set();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private tournamentService: TournamentService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.tournamentId = id;
      this.loadRegistrations();
    }
  }

  loadRegistrations(): void {
    this.loading = true;
    this.error = null;

    this.tournamentService.getRegistrations(this.tournamentId, 'pending').subscribe({
      next: (registrations) => {
        this.registrations = registrations;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading registrations:', err);
        this.error = 'Error al cargar las inscripciones pendientes.';
        this.loading = false;
      }
    });
  }

  approveRegistration(registrationId: string): void {
    if (this.processingIds.has(registrationId)) return;

    const confirmed = confirm('¿Estás seguro de que deseas aprobar esta inscripción?');
    if (!confirmed) return;

    this.processingIds.add(registrationId);

    this.tournamentService.approveRegistration(this.tournamentId, registrationId).subscribe({
      next: () => {
        this.processingIds.delete(registrationId);
        // Remover de la lista
        this.registrations = this.registrations.filter(r => r.id !== registrationId);
        alert('Inscripción aprobada exitosamente');
      },
      error: (err) => {
        console.error('Error approving registration:', err);
        this.processingIds.delete(registrationId);
        alert('Error al aprobar la inscripción: ' + (err.message || 'Error desconocido'));
      }
    });
  }

  rejectRegistration(registrationId: string): void {
    if (this.processingIds.has(registrationId)) return;

    const reason = prompt('¿Por qué rechazas esta inscripción? (opcional)');
    if (reason === null) return; // User cancelled

    this.processingIds.add(registrationId);

    this.tournamentService.rejectRegistration(this.tournamentId, registrationId, reason || undefined).subscribe({
      next: () => {
        this.processingIds.delete(registrationId);
        // Remover de la lista
        this.registrations = this.registrations.filter(r => r.id !== registrationId);
        alert('Inscripción rechazada');
      },
      error: (err) => {
        console.error('Error rejecting registration:', err);
        this.processingIds.delete(registrationId);
        alert('Error al rechazar la inscripción: ' + (err.message || 'Error desconocido'));
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/tournaments/detail', this.tournamentId]);
  }

  isProcessing(registrationId: string): boolean {
    return this.processingIds.has(registrationId);
  }
}
