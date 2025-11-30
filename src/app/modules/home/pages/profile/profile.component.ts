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

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.profileForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required]
    });

    this.loadProfile();
  }

  loadProfile(): void {
    this.isLoading = true;
    this.userService.getProfile().subscribe({
      next: profile => {
        this.profileForm.patchValue({
          username: profile.username,
          email: profile.email,
          firstName: profile.firstName,
          lastName: profile.lastName
        });
        this.avatarPreview = (profile as any).avatarUrl || null;
        this.isLoading = false;
      },
      error: err => {
        console.error('Error cargando perfil', err);
        this.isLoading = false;
      }
    });
  }

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];
    this.userService.uploadAvatar(file).subscribe({
      next: res => {
        this.avatarPreview = res.avatarUrl;
      },
      error: err => console.error('Error subiendo avatar', err)
    });
  }

  onSubmit(): void {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }

    const payload = this.profileForm.value;
    this.isLoading = true;
    this.userService.updateProfile(payload).subscribe({
      next: () => {
        this.isLoading = false;
        // recargar datos actuales de sesión
        this.authService.getProfile().subscribe({ next: () => {}, error: () => {} });
        this.router.navigate(['/dashboard']);
      },
      error: err => {
        console.error('Error actualizando perfil', err);
        this.isLoading = false;
      }
    });
  }
}
