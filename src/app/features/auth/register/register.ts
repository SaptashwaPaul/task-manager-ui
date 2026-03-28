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

  register() {
    this.authService.register({
      name: this.name,
      email: this.email,
      password: this.password,
      roleId: 2 // normal user
    }).subscribe({
      next: () => {
        alert('Registered successfully!');
        this.router.navigate(['/login']);
      },
      error: () => alert('Registration failed')
    });
  }
}
