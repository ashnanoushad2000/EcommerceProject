import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Router } from '@angular/router'; 
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email = '';
  password = '';
  error = '';
  rememberMe = false;
  showPassword = false;

  constructor(private auth: AuthService, private router: Router) {
    console.log("✅ Fresh LoginComponent Loaded!");

    const savedEmail = localStorage.getItem('rememberedEmail');
    if (savedEmail) {
      this.email = savedEmail;
      this.rememberMe = true;
    }
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  login() {
    console.log("🔄 Logging in:", { email: this.email, remember: this.rememberMe });

    if (this.rememberMe) {
      localStorage.setItem('rememberedEmail', this.email);
    } else {
      localStorage.removeItem('rememberedEmail');
    }

    this.auth.login({ email: this.email, password: this.password }).subscribe({
      next: (res) => {
        console.log("✅ Logged in successfully:", res);

        // Save token and new user gift info
        this.auth.saveToken(res.access_token);
        localStorage.setItem('isNewUser', res.isNewUser);
        localStorage.setItem('gift', res.gift || '');

        if (res.role === 'admin') {
          this.router.navigate(['/admin/dashboard']);
        } else {
          this.router.navigate(['/home']);
        }
      },
      error: (err) => {
        console.error("❌ Login failed:", err);
        this.error = 'Invalid email or password.';
      }
    });
  }
}
