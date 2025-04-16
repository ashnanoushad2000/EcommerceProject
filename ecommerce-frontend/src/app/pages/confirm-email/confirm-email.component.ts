import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import confetti from 'canvas-confetti';

@Component({
  standalone: true,
  selector: 'app-confirm-email',
  imports: [CommonModule, HttpClientModule],
  templateUrl: './confirm-email.component.html',
  styleUrls: ['./confirm-email.component.css'] // Make sure this matches your file name
})
export class ConfirmEmailComponent {
  success = false;
  error = false;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) {
    const token = this.route.snapshot.queryParamMap.get('token');
    if (token) {
      this.http.get(`http://localhost:3000/auth/confirm?token=${token}`, { responseType: 'text' })
        .subscribe({
          next: () => {
            this.success = true;
            // 🎊 Show confetti
            confetti({
              particleCount: 100,
              spread: 70,
              origin: { y: 0.6 }
            });

            // ⏳ Auto-redirect to login after 3 seconds
            setTimeout(() => this.router.navigate(['/login']), 3000);
          },
          error: () => {
            this.error = true;
          }
        });
    }
  }
}
