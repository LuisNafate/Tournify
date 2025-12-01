import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TournamentService } from '../../services/tournament.service';
import { TeamService } from '../../services/team.service';
import { AuthService } from '../../../../core/services/auth.service';
import { Team } from '../../../../core/models/team.model';

@Component({
  selector: 'app-join',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './join.component.html',
  styleUrl: './join.component.css'
})
export class JoinComponent implements OnInit {
  joinForm!: FormGroup;
  tournament: any;
  tournamentId!: string;
  isAuthenticated: boolean = false;
  loading = false;
  loadingTeams = false;
  error: string | null = null;
  myTeams: Team[] = [];
  submitting = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private tournamentService: TournamentService,
    private teamService: TeamService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Obtener el ID del torneo desde la URL
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.tournamentId = id;
      this.loadTournament(id);
    }

    // Verificar si el usuario está autenticado
    this.isAuthenticated = !!this.authService.usuarioActualValue;

    // Inicializar el formulario
    this.joinForm = this.fb.group({
      teamId: ['', Validators.required]
    });

    // Si está autenticado, cargar sus equipos
    if (this.isAuthenticated) {
      this.loadMyTeams();
    }
  }

  loadTournament(id: string): void {
    this.loading = true;
    this.error = null;

    this.tournamentService.getTournamentById(id).subscribe({
      next: (tournament) => {
        this.tournament = tournament;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading tournament:', err);
        this.error = 'Error al cargar el torneo.';
        this.loading = false;
      }
    });
  }

  loadMyTeams(): void {
    this.loadingTeams = true;

    this.teamService.getMyTeams().subscribe({
      next: (teams) => {
        this.myTeams = teams;
        this.loadingTeams = false;
      },
      error: (err) => {
        console.error('Error loading teams:', err);
        this.loadingTeams = false;
        // No mostrar error, simplemente no habrá equipos disponibles
      }
    });
  }

  onSubmit(): void {
    if (!this.isAuthenticated) {
      alert('Debes iniciar sesión para unirte a un torneo');
      sessionStorage.setItem('returnUrl', `/tournaments/join/${this.tournamentId}`);
      this.router.navigate(['/auth/login']);
      return;
    }

    if (this.joinForm.invalid) {
      this.joinForm.markAllAsTouched();
      alert('Por favor, selecciona un equipo');
      return;
    }

    this.submitting = true;
    const teamId = this.joinForm.value.teamId;

    this.tournamentService.joinTournament(this.tournamentId, teamId).subscribe({
      next: (response) => {
        this.submitting = false;

        // Determinar si la inscripción requiere aprobación o se aprobó inmediatamente.
        // Priorizar información del propio torneo si el backend no devuelve detalles.
        const respBody = response && response.body ? response.body : null;

        const backendIndicatesPending = respBody && (
          respBody.status === 'pending' || respBody.registrationStatus === 'pending' || respBody.message === 'pending'
        );

        const httpStatusIndicatesPending = response.status === 202; // Accepted

        const tournamentRequiresApproval = !!(this.tournament && (this.tournament as any).requiresApproval);

        if (backendIndicatesPending || httpStatusIndicatesPending || tournamentRequiresApproval) {
          alert('Solicitud enviada al organizador.');
        } else {
          alert('¡Te has unido al torneo exitosamente!');
        }

        this.router.navigate(['/tournaments/detail', this.tournamentId]);
      },
      error: (err) => {
        console.error('Error joining tournament:', err);
        this.submitting = false;
        // Si el backend devuelve 409 o mensaje indicando pending, manejarlo
        if (err && err.status === 409 && err.error && err.error.message) {
          alert(err.error.message);
        } else if (err && err.status === 202) {
          alert('Solicitud enviada al organizador.');
          this.router.navigate(['/tournaments/detail', this.tournamentId]);
        } else {
          alert('Error al unirte al torneo: ' + (err.error?.message || err.message || 'Error desconocido'));
        }
      }
    });
  }

  createNewTeam(): void {
    // Guardar la URL actual para volver después de crear el equipo
    const returnUrl = `/tournaments/join/${this.tournamentId}`;
    this.router.navigate(['/teams/create'], {
      queryParams: { returnUrl }
    });
  }

  cancel(): void {
    this.router.navigate(['/tournaments/detail', this.tournamentId]);
  }
}
