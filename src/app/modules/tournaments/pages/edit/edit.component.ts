import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { TournamentService } from '../../services/tournament.service';
import { SportService } from '../../../../core/services/sport.service';
import { UpdateTournamentRequest, Tournament } from '../../../../core/models/tournament.model';
import { Sport } from '../../../../core/models/sport.model';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {
  tournamentId: string = '';
  tournament: any = {
    name: '',
    sport: '',
    sportSubType: '',
    tournamentType: '',
    category: '',
    eliminationMode: '',
    location: '',
    startDate: '',
    endDate: '',
    registrationDeadline: '',
    maxTeams: 16,
    description: '',
    rules: '',
    prizePool: 0
  };

  loading = false;
  error: string | null = null;
  sports: Sport[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private tournamentService: TournamentService,
    private sportService: SportService
  ) {}

  ngOnInit(): void {
    // Obtener el ID del torneo de la ruta
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.tournamentId = id;
      this.loadTournament(id);
      this.loadSports();
    } else {
      this.error = 'ID de torneo no proporcionado';
    }
  }

  loadTournament(id: string): void {
    this.loading = true;
    this.error = null;

    this.tournamentService.getTournamentById(id).subscribe({
      next: (tournament) => {
        // Verificar que el usuario actual sea el organizador
        const currentUser = this.authService.usuarioActualValue;
        if (tournament.organizerId !== currentUser?.id) {
          this.error = 'No tienes permisos para editar este torneo';
          this.loading = false;
          return;
        }

        // Cargar los datos del torneo, formateando las fechas para inputs datetime-local
        this.tournament = {
          ...tournament,
          startDate: tournament.startDate ? this.formatDateForInput(tournament.startDate) : '',
          endDate: tournament.endDate ? this.formatDateForInput(tournament.endDate) : '',
          registrationDeadline: tournament.registrationDeadline
            ? this.formatDateForInput(tournament.registrationDeadline)
            : ''
        };
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading tournament:', err);
        this.error = 'Error al cargar el torneo. Por favor, intenta de nuevo.';
        this.loading = false;
      }
    });
  }

  loadSports(): void {
    this.sportService.getAll().subscribe({
      next: (sports: Sport[]) => {
        this.sports = sports;
      },
      error: (err: any) => {
        console.error('Error loading sports:', err);
      }
    });
  }

  // Convierte una fecha ISO 8601 al formato 'YYYY-MM-DDTHH:mm' para inputs datetime-local
  formatDateForInput(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }

  onSubmit(): void {
    if (!this.validateForm()) {
      return;
    }

    this.loading = true;
    this.error = null;

    // Preparar el payload de actualización con todos los campos requeridos
    const payload: any = {
      name: this.tournament.name,
      sportId: this.tournament.sportId || this.tournament.sport,
      tournamentType: this.tournament.tournamentType || 'elimination',
      startDate: new Date(this.tournament.startDate).toISOString(),
      maxTeams: Number(this.tournament.maxTeams)
    };

    // Agregar campos opcionales
    if (this.tournament.description) {
      payload.description = this.tournament.description;
    }

    if (this.tournament.location) {
      payload.location = this.tournament.location;
    }

    if (this.tournament.endDate) {
      payload.endDate = new Date(this.tournament.endDate).toISOString();
    }

    if (this.tournament.registrationDeadline) {
      payload.registrationDeadline = new Date(this.tournament.registrationDeadline).toISOString();
    }

    if (this.tournament.eliminationMode) {
      payload.eliminationMode = this.tournament.eliminationMode;
    }

    if (this.tournament.rules) {
      payload.rulesText = this.tournament.rules; // El backend usa 'rulesText'
    }

    if (this.tournament.prizePool) {
      payload.prizePool = String(this.tournament.prizePool);
    }

    // sportSettings debe ser un String JSON, no un objeto
    if (this.tournament.sportSettings) {
      payload.sportSettings = typeof this.tournament.sportSettings === 'string'
        ? this.tournament.sportSettings
        : JSON.stringify(this.tournament.sportSettings);
    }

    // Agregar campos con valores por defecto si existen
    if (this.tournament.registrationFee !== undefined) {
      payload.registrationFee = Number(this.tournament.registrationFee);
    }

    if (this.tournament.isPrivate !== undefined) {
      payload.isPrivate = Boolean(this.tournament.isPrivate);
    }

    if (this.tournament.requiresApproval !== undefined) {
      payload.requiresApproval = Boolean(this.tournament.requiresApproval);
    }

    if (this.tournament.hasGroupStage !== undefined) {
      payload.hasGroupStage = Boolean(this.tournament.hasGroupStage);
    }

    if (this.tournament.allowTies !== undefined) {
      payload.allowTies = Boolean(this.tournament.allowTies);
    }

    console.log('Payload de actualización:', payload);
    console.log('Tournament ID:', this.tournamentId);

    this.tournamentService.updateTournament(this.tournamentId, payload).subscribe({
      next: (updatedTournament) => {
        console.log('Torneo actualizado exitosamente:', updatedTournament);
        this.loading = false;
        // Navegar de vuelta al detalle del torneo
        this.router.navigate(['/tournaments/detail', this.tournamentId]);
      },
      error: (err) => {
        console.error('Error completo:', err);
        console.error('Error response:', err.error);
        console.error('Error status:', err.status);
        this.error = err.error?.message || err.message || 'Error al actualizar el torneo. Por favor, intenta de nuevo.';
        this.loading = false;
      }
    });
  }

  validateForm(): boolean {
    if (!this.tournament.name || !this.tournament.sport || !this.tournament.location) {
      this.error = 'Por favor completa todos los campos obligatorios';
      return false;
    }

    if (!this.tournament.startDate || !this.tournament.endDate) {
      this.error = 'Por favor proporciona las fechas de inicio y fin';
      return false;
    }

    const startDate = new Date(this.tournament.startDate);
    const endDate = new Date(this.tournament.endDate);

    if (endDate <= startDate) {
      this.error = 'La fecha de fin debe ser posterior a la fecha de inicio';
      return false;
    }

    if (this.tournament.maxTeams < 2) {
      this.error = 'El número máximo de equipos debe ser al menos 2';
      return false;
    }

    return true;
  }

  onCancel(): void {
    // Volver al detalle del torneo sin guardar cambios
    this.router.navigate(['/tournaments/detail', this.tournamentId]);
  }
}
