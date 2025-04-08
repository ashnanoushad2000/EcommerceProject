import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,  
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email = '';
  password = '';
  error = '';

  constructor(private auth: AuthService, private router: Router) {
    console.log("✅ Fresh LoginComponent Loaded!");
  }

  login() {
    console.log("🔄 Logging in:", { email: this.email });

    this.auth.login({ email: this.email, password: this.password }).subscribe({
      next: (res) => {
        console.log("✅ Logged in successfully:", res);
        this.auth.saveToken(res.access_token);

        if (res.role === 'admin') {   // ✅ Corrected: "res.role" instead of "res.user.role"
          this.router.navigate(['/admin/dashboard']);
        } else {
          this.router.navigate(['/products']);
        }
      },
      error: (err) => {
        console.error("❌ Login failed:", err);
        this.error = 'Invalid email or password.';
      }
    });
  }
}
