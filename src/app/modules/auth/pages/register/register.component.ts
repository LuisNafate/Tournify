import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import { UserRole } from 'src/app/core/models/auth.models';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  registerError: string | null = null;
  isLoading = false;

  // Opciones de rol
  roles: { value: UserRole; label: string }[] = [
    { value: 'player', label: 'Jugador' },
    { value: 'organizer', label: 'Organizador' },
    { value: 'referee', label: 'Árbitro' }
  ];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
      role: ['player', [Validators.required]]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  /**
   * Validador personalizado para verificar que las contraseñas coincidan
   */
  passwordMatchValidator(form: FormGroup): { [key: string]: boolean } | null {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');

    if (!password || !confirmPassword) {
      return null;
    }

    return password.value === confirmPassword.value ? null : { passwordMismatch: true };
  }

  /**
   * Maneja el envío del formulario
   */
  onSubmit(): void {
    this.registerError = null;

    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    const { username, email, password, role } = this.registerForm.value;

    this.authService.register(username, email, password, role).subscribe({
      next: () => {
        // Redirigir al dashboard después del registro exitoso
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.isLoading = false;
        this.registerError = err.message || 'Error al registrar usuario. Inténtalo de nuevo.';
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  /**
   * Verifica si un campo tiene error
   */
  hasError(field: string, error: string): boolean {
    const control = this.registerForm.get(field);
    return !!(control && control.hasError(error) && (control.dirty || control.touched));
  }

  /**
   * Verifica si las contraseñas no coinciden
   */
  get passwordMismatch(): boolean {
    return !!(this.registerForm.hasError('passwordMismatch') && 
             this.registerForm.get('confirmPassword')?.touched);
  }
}
