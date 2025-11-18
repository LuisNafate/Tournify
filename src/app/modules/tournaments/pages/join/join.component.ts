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
  tournamentId!: number;
  isAuthenticated: boolean = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private tournamentService: TournamentService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Obtener el ID del torneo desde la URL
    this.tournamentId = Number(this.route.snapshot.paramMap.get('id'));
    this.tournament = this.tournamentService.getTournamentById(this.tournamentId);

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

  onSubmit(): void {
    if (!this.isAuthenticated) {
      alert('Debes iniciar sesión para unirte a un torneo');
      // Guardar la URL actual para volver después del login
      sessionStorage.setItem('returnUrl', `/tournaments/join/${this.tournamentId}`);
      this.router.navigate(['/auth/login']);
      return;
    }

    if (this.joinForm.invalid) {
      this.joinForm.markAllAsTouched();
      return;
    }

    // Aquí iría la lógica para enviar la solicitud al backend
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
