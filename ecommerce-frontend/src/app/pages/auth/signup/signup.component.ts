import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './signup.component.html',
})
export class SignupComponent {
  name = '';
  email = '';
  password = '';
  error = '';

  constructor(private auth: AuthService, private router: Router) {}

  signup() {
    this.auth.signup({ name: this.name, email: this.email, password: this.password }).subscribe({
      next: (res) => {
        console.log('✅ Signup successful:', res);
        this.router.navigate(['/login']); // Redirect to login
      },
      error: (err) => {
        console.error('❌ Signup failed:', err);
        this.error = 'Signup failed. Try again.';
      }
    });
  }
}
