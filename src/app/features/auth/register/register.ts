import { Component } from '@angular/core';
import {  Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  imports: [FormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {

  constructor(private authService: AuthService,private router: Router) {}

  email = '';
  password = '';
  name = '';

  isSubmitting = false;


    register() {
      if (this.isSubmitting) return;

      this.isSubmitting = true;

      this.authService.register({
        name: this.name,
        email: this.email,
        password: this.password,
        roleId: 2
      }).subscribe({
        next: (res) => {
          console.log("SUCCESS", res);

          this.isSubmitting = false; // 🔥 FIX

          alert('Registered successfully!');
          this.router.navigate(['/login']); // 🔥 redirect
        },
        error: (err) => {
          console.error(err);

          this.isSubmitting = false; // 🔥 FIX

          alert('Registration failed');
        }
      });
    }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}
