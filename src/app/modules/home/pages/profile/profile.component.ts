import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../../../core/services/user.service';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  profileForm!: FormGroup;
  isLoading = false;
  avatarPreview: string | null = null;
  currentUser: any = null;
  successMessage: string | null = null;
  errorMessage: string | null = null;
  isUploadingAvatar = false;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private authService: AuthService,
    public router: Router
  ) {}

  ngOnInit(): void {
    this.profileForm = this.fb.group({
      username: [{ value: '', disabled: true }], // Username no editable
      email: [{ value: '', disabled: true }], // Email no editable
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      phone: ['', [Validators.pattern(/^[0-9]{10}$/)]]
    });

    this.loadProfile();
  }

  loadProfile(): void {
    this.isLoading = true;
    this.clearMessages();
    
    this.userService.getProfile().subscribe({
      next: profile => {
        this.currentUser = profile;
        this.profileForm.patchValue({
          username: profile.username,
          email: profile.email,
          firstName: profile.firstName || '',
          lastName: profile.lastName || '',
          phone: (profile as any).phone || ''
        });
        this.avatarPreview = (profile as any).avatarUrl || null;
        this.isLoading = false;
      },
      error: err => {
        console.error('Error cargando perfil', err);
        this.errorMessage = 'Error al cargar el perfil';
        this.isLoading = false;
      }
    });
  }

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];
    
    // Validar tamaño (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      this.errorMessage = 'La imagen no puede superar los 5MB';
      return;
    }

    // Validar tipo
    if (!file.type.startsWith('image/')) {
      this.errorMessage = 'Solo se permiten archivos de imagen';
      return;
    }

    this.isUploadingAvatar = true;
    this.clearMessages();
    
    // Preview local mientras se sube
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.avatarPreview = e.target.result;
    };
    reader.readAsDataURL(file);

    this.userService.uploadAvatar(file).subscribe({
      next: res => {
        this.avatarPreview = res.avatarUrl;
        this.successMessage = 'Avatar actualizado correctamente';
        this.isUploadingAvatar = false;
      },
      error: err => {
        console.error('Error subiendo avatar', err);
        this.errorMessage = 'Error al subir el avatar';
        this.isUploadingAvatar = false;
        this.loadProfile(); // Recargar para restaurar el avatar anterior
      }
    });
  }

  onSubmit(): void {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      this.errorMessage = 'Por favor, completa todos los campos correctamente';
      return;
    }

    // Solo enviar campos editables
    const payload = {
      firstName: this.profileForm.get('firstName')?.value,
      lastName: this.profileForm.get('lastName')?.value,
      phone: this.profileForm.get('phone')?.value || null
    };
    
    this.isLoading = true;
    this.clearMessages();
    
    this.userService.updateProfile(payload).subscribe({
      next: (updatedUser) => {
        this.isLoading = false;
        this.successMessage = '¡Perfil actualizado correctamente!';
        
        // Actualizar datos en AuthService
        this.authService.getProfile().subscribe();
        
        // Redirigir después de 2 segundos
        setTimeout(() => {
          this.router.navigate(['/dashboard']);
        }, 2000);
      },
      error: err => {
        console.error('Error actualizando perfil', err);
        this.errorMessage = err.message || 'Error al actualizar el perfil';
        this.isLoading = false;
      }
    });
  }

  clearMessages(): void {
    this.successMessage = null;
    this.errorMessage = null;
  }

  getRoleLabel(role: string): string {
    const roles: { [key: string]: string } = {
      'player': 'Jugador',
      'organizer': 'Organizador',
      'referee': 'Árbitro'
    };
    return roles[role] || role;
  }

  /**
   * Navega de regreso al dashboard
   */
  goBack(): void {
    this.router.navigate(['/dashboard']);
  }

  getInitials(): string {
    if (!this.currentUser) return 'U';
    const first = this.currentUser.firstName?.[0] || '';
    const last = this.currentUser.lastName?.[0] || '';
    return (first + last).toUpperCase() || this.currentUser.username?.[0]?.toUpperCase() || 'U';
  }
}
