import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {
  email = '';
  password = '';

  constructor(
  private authService: AuthService,
  private router: Router
) {}

  login() {
  this.authService.login({
    email: this.email,
    password: this.password
  }).subscribe({
    next: (res: any) => {
      console.log('Login success', res);

      const token = res.token; // ✅ FIXED

      this.authService.saveToken(token);

      alert('Login successful!');

      this.router.navigate(['/tasks'])
    },
    error: (err: any) => {
      console.error(err);
      alert('Login failed');
    }
  });
}

  goToRegister() {
    this.router.navigate(['/register']);
  }
}