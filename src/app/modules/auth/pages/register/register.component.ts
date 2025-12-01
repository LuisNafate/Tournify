import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import { UserService } from 'src/app/core/services/user.service';
import { UserRole } from 'src/app/core/models/auth.models';
import { of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  registerError: string | null = null;
  isLoading = false;
  showPassword = false;
  photoPreview: string | ArrayBuffer | null = null;
  photoFile: File | null = null;

  // Opciones de rol
  roles: { value: UserRole; label:string }[] = [
    { value: 'player', label: 'Jugador' },
    { value: 'organizer', label: 'Organizador' },
    { value: 'referee', label: 'Árbitro' }
  ];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
      role: ['player', [Validators.required]],
      photo: [null]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  /**
   * Maneja la selección de un archivo de imagen
   */
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      if (file.type.startsWith('image/')) {
        this.photoFile = file;
        
        const reader = new FileReader();
        reader.onload = () => {
          this.photoPreview = reader.result;
        };
        reader.readAsDataURL(file);

        this.registerForm.patchValue({ photo: file });
      } else {
        console.warn('El archivo seleccionado no es una imagen.');
      }
    }
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
    const { username, email, password, firstName, lastName, role } = this.registerForm.value;

    // Subir la foto primero si existe
    const uploadAndRegister$ = this.photoFile
      ? this.userService.uploadAvatar(this.photoFile).pipe(
          switchMap(response => {
            const userData = { username, email, password, firstName, lastName, role, photoUrl: response.avatarUrl };
            return this.authService.register(userData);
          })
        )
      : this.authService.register({ username, email, password, firstName, lastName, role });

    uploadAndRegister$.subscribe({
      next: () => {
        console.log('[REGISTER] Registro exitoso, iniciando sesión automática...');
        this.authService.login(email, password).subscribe({
          next: () => {
            console.log('[REGISTER] Login automático exitoso');
            this.isLoading = false;
            this.router.navigate(['/dashboard']);
          },
          error: (loginErr) => {
            this.isLoading = false;
            console.error('Error en login automático:', loginErr);
            this.router.navigate(['/login'], { 
              queryParams: { message: 'Registro exitoso. Por favor inicia sesión.' } 
            });
          }
        });
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Error en registro:', err);
        if (err.status === 409) {
          this.registerError = 'El correo o nombre de usuario ya están en uso.';
        } else if (err.status === 0) {
          this.registerError = 'No se pudo conectar con el servidor. Verifica tu conexión.';
        } else {
          this.registerError = err.message || 'Error al registrar. Inténtalo de nuevo.';
        }
      }
    });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
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
