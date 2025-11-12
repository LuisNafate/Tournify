import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TeamService } from '../../services/team.service';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-create-team',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-team.component.html',
  styleUrls: ['./create-team.component.css']
})
export class CreateTeamComponent implements OnInit {
  teamForm!: FormGroup;
  tournamentId!: number;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private teamService: TeamService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.tournamentId = Number(this.route.snapshot.paramMap.get('tournamentId')) || 0;

    this.teamForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      membersCount: [1, [Validators.required, Validators.min(1)]],
      captainName: [''],
      captainEmail: ['', Validators.email],
      captainPhone: [''],
      additionalInfo: ['']
    });

    // si hay usuario autenticado, prellenar captain
    const user = this.authService.usuarioActualValue;
    if (user) {
      this.teamForm.patchValue({ captainName: user.username, captainEmail: user.email });
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
    const payload = this.teamForm.value;

    // Llamada al servicio
    this.teamService.createTeam(this.tournamentId, payload).subscribe({
      next: res => {
        this.isSubmitting = false;
        // redirigir a la vista del torneo si existe id
        if (this.tournamentId) {
          this.router.navigate(['/tournaments/detail', this.tournamentId]);
        } else {
          this.router.navigate(['/tournaments/list']);
        }
      },
      error: err => {
        console.error('Error creando equipo', err);
        this.isSubmitting = false;
        alert('No se pudo crear el equipo: ' + (err?.message || err));
      }
    });
  }
}
