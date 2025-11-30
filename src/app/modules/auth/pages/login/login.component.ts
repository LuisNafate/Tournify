import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm!: FormGroup;
  loginError: string | null = null;
  isLoading: boolean = false;
  showPassword: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  onSubmit(): void {
    this.loginError = null;
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    const { email, password } = this.loginForm.value;
    
    this.authService.login(email, password).subscribe({
      next: () => {
        this.isLoading = false;
        // Verificar si hay una URL de retorno guardada
        const returnUrl = sessionStorage.getItem('returnUrl');

        if (returnUrl) {
          // Limpiar la URL de retorno
          sessionStorage.removeItem('returnUrl');
          // Redirigir a la URL guardada
          this.router.navigateByUrl(returnUrl);
        } else {
          // Si no hay URL de retorno, ir al dashboard por defecto
          this.router.navigate(['/dashboard']);
        }
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Error en login:', err);
        if (err.status === 401) {
          this.loginError = 'Correo o contraseña incorrectos.';
        } else if (err.status === 0) {
          this.loginError = 'No se pudo conectar con el servidor. Verifica tu conexión.';
        } else {
          this.loginError = err.error?.message || 'Error al iniciar sesión. Inténtalo de nuevo.';
        }
      }
    });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  hasError(field: string, error: string): boolean {
    const control = this.loginForm.get(field);
    return !!(control && control.hasError(error) && control.touched);
  }
}