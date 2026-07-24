import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  username = '';
  password = '';
  loading = false;
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  onLogin(): void {
    this.loading = true;
    this.errorMessage = '';

    this.authService
      .login({ UserName: this.username, Password: this.password })
      .subscribe({
        next: (res) => {
          this.loading = false;
          if (res.success) {
            this.router.navigate(['/dashboard']);
          } else {
            this.errorMessage = res.message || 'Credenciales incorrectas';
          }
        },
        error: (err) => {
          this.loading = false;
          if (err.status === 401) {
            this.errorMessage = 'Usuario o contrasena incorrectos';
          } else {
            this.errorMessage = 'Error de conexion con el servidor';
          }
        },
      });
  }
}
