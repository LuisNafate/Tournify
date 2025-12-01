import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { TeamWithMembers, TeamMember, AddMemberRequest, MemberRole } from '../../../../core/models/team.model';
import { TeamService } from '../../../tournaments/services/team.service';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-team-detail',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './team-detail.component.html',
  styleUrls: ['./team-detail.component.css']
})
export class TeamDetailComponent implements OnInit {
  team: TeamWithMembers | null = null;
  loading = false;
  error: string | null = null;

  // Add member form
  showAddMemberForm = false;
  addMemberForm!: FormGroup;
  isSubmitting = false;

  // Roles disponibles
  availableRoles: MemberRole[] = ['player', 'substitute', 'coach'];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private teamService: TeamService,
    private authService: AuthService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    const teamId = this.route.snapshot.paramMap.get('id');

    if (teamId) {
      this.loadTeam(teamId);
    }

    // Inicializar formulario para agregar miembros
    this.addMemberForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      name: [''],
      role: ['player', Validators.required],
      jerseyNumber: ['', [Validators.min(1), Validators.max(99)]],
      position: ['']
    });
  }

  loadTeam(id: string): void {
    this.loading = true;
    this.error = null;

    this.teamService.getTeamById(id).subscribe({
      next: (team) => {
        this.team = team;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading team:', err);

        // Manejar diferentes tipos de error
        if (err?.status === 403) {
          this.error = 'No tienes permiso para ver este equipo. Solo los miembros del equipo pueden ver sus detalles.';
        } else if (err?.status === 404) {
          this.error = 'El equipo no existe o fue eliminado.';
        } else if (err?.status === 401) {
          this.error = 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.';
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 2000);
        } else {
          this.error = err?.message || 'Error al cargar el equipo. Por favor, intenta de nuevo.';
        }

        this.loading = false;
      }
    });
  }

  isCaptain(): boolean {
    const currentUser = this.authService.usuarioActualValue;
    return this.team?.captainId === currentUser?.id;
  }

  toggleAddMemberForm(): void {
    this.showAddMemberForm = !this.showAddMemberForm;
    if (!this.showAddMemberForm) {
      this.addMemberForm.reset({ role: 'player' });
    }
  }

  onSubmitAddMember(): void {
    if (this.addMemberForm.invalid || !this.team) {
      this.addMemberForm.markAllAsTouched();
      return;
    }

    if (!this.isCaptain()) {
      alert('Solo el capitán puede agregar miembros al equipo');
      return;
    }

    this.isSubmitting = true;

    const payload: AddMemberRequest = {
      email: this.addMemberForm.value.email,
      name: this.addMemberForm.value.name || undefined,
      role: this.addMemberForm.value.role,
      jerseyNumber: this.addMemberForm.value.jerseyNumber ? parseInt(this.addMemberForm.value.jerseyNumber) : undefined,
      position: this.addMemberForm.value.position || undefined
    };

    this.teamService.addMember(this.team.id, payload).subscribe({
      next: () => {
        this.isSubmitting = false;
        alert('Miembro agregado exitosamente');
        this.addMemberForm.reset({ role: 'player' });
        this.showAddMemberForm = false;
        // Recargar el equipo para ver el nuevo miembro
        this.loadTeam(this.team!.id);
      },
      error: (err) => {
        console.error('Error adding member:', err);
        this.isSubmitting = false;
        alert('Error al agregar miembro: ' + err.message);
      }
    });
  }

  removeMember(member: TeamMember, event: Event): void {
    event.stopPropagation();

    if (!this.team) return;

    if (!this.isCaptain()) {
      alert('Solo el capitán puede eliminar miembros del equipo');
      return;
    }

    // No permitir eliminar al capitán
    if (member.userId === this.team.captainId) {
      alert('No puedes eliminar al capitán del equipo');
      return;
    }

    if (!confirm(`¿Estás seguro de que deseas eliminar a ${member.name || member.email} del equipo?`)) {
      return;
    }

    this.teamService.removeMember(this.team.id, member.id).subscribe({
      next: () => {
        alert('Miembro eliminado exitosamente');
        // Recargar el equipo
        this.loadTeam(this.team!.id);
      },
      error: (err) => {
        console.error('Error removing member:', err);
        alert('Error al eliminar miembro: ' + err.message);
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/teams/my-teams']);
  }

  getRoleName(role: MemberRole): string {
    const roleNames: Record<MemberRole, string> = {
      captain: 'Capitán',
      player: 'Jugador',
      substitute: 'Suplente',
      coach: 'Entrenador'
    };
    return roleNames[role] || role;
  }
}
