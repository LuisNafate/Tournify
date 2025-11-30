import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TeamService } from '../../services/team.service';
import { AuthService } from '../../../../core/services/auth.service';
import { CreateTeamRequest } from '../../../../core/models/team.model';

@Component({
  selector: 'app-create-team',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-team.component.html',
  styleUrls: ['./create-team.component.css']
})
export class CreateTeamComponent implements OnInit {
  teamForm!: FormGroup;
  isSubmitting = false;
  returnUrl: string | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private teamService: TeamService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Obtener URL de retorno si existe (para redirigir después de crear)
    this.returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');

    this.teamForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      shortName: ['', [Validators.maxLength(10)]],
      description: ['', [Validators.maxLength(200)]],
      contactEmail: ['', [Validators.email]],
      contactPhone: ['']
    });

    // Si hay usuario autenticado, prellenar email de contacto
    const user = this.authService.usuarioActualValue;
    if (user && user.email) {
      this.teamForm.patchValue({
        contactEmail: user.email
      });
    }
  }

  onSubmit(): void {
    if (!this.authService.usuarioActualValue) {
      alert('Debes iniciar sesión para crear un equipo');
      this.router.navigate(['/auth/login']);
      return;
    }

    if (this.teamForm.invalid) {
      this.teamForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;

    // Crear el payload según el modelo del backend
    const payload: CreateTeamRequest = {
      name: this.teamForm.value.name,
      shortName: this.teamForm.value.shortName || undefined,
      description: this.teamForm.value.description || undefined,
      contactEmail: this.teamForm.value.contactEmail || undefined,
      contactPhone: this.teamForm.value.contactPhone || undefined
    };

    this.teamService.createTeam(payload).subscribe({
      next: (team) => {
        this.isSubmitting = false;
        alert('¡Equipo creado exitosamente!');

        // Redirigir según returnUrl o a mis equipos
        if (this.returnUrl) {
          this.router.navigateByUrl(this.returnUrl);
        } else {
          this.router.navigate(['/teams/my-teams']);
        }
      },
      error: (err) => {
        console.error('Error creando equipo', err);
        this.isSubmitting = false;
        alert('No se pudo crear el equipo: ' + (err?.message || err));
      }
    });
  }

  cancel(): void {
    if (this.returnUrl) {
      this.router.navigateByUrl(this.returnUrl);
    } else {
      this.router.navigate(['/teams/my-teams']);
    }
  }
}
