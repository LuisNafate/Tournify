import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TournamentService } from '../../services/tournament.service';
import { AuthService } from '../../../../core/services/auth.service';

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
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private tournamentService: TournamentService,
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
      teamName: ['', [Validators.required, Validators.minLength(3)]],
      teamMembers: ['', [Validators.required, Validators.min(1)]],
      captainName: ['', Validators.required],
      captainEmail: ['', [Validators.required, Validators.email]],
      captainPhone: ['', Validators.required],
      additionalInfo: ['']
    });

    // Si el usuario está autenticado, prellenar algunos campos
    if (this.isAuthenticated) {
      const user = this.authService.usuarioActualValue;
      this.joinForm.patchValue({
        captainName: user?.username || '',
        captainEmail: user?.email || ''
      });
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

  onSubmit(): void {
    if (!this.isAuthenticated) {
      alert('Debes iniciar sesión para unirte a un torneo');
      sessionStorage.setItem('returnUrl', `/tournaments/join/${this.tournamentId}`);
      this.router.navigate(['/auth/login']);
      return;
    }

    if (this.joinForm.invalid) {
      this.joinForm.markAllAsTouched();
      return;
    }

    console.log('Solicitud de registro:', {
      tournamentId: this.tournamentId,
      ...this.joinForm.value
    });

    alert('¡Solicitud enviada exitosamente! El organizador revisará tu petición.');
    this.router.navigate(['/tournaments/detail', this.tournamentId]);
  }

  cancel(): void {
    this.router.navigate(['/tournaments/detail', this.tournamentId]);
  }
}
