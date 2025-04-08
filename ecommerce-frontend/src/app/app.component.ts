import { Component } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterModule,
    RouterOutlet,
    NavbarComponent,
    FooterComponent
  ],
  template: `
    <div class="app-wrapper">
      <app-navbar></app-navbar>

      <main class="main-content">
        <router-outlet></router-outlet>
      </main>

      <app-footer></app-footer>
    </div>
  `,
})
export class AppComponent {}
