import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent],
  template: `
    @if (auth.isLoggedIn()) {
      <app-navbar />
    }
    <main [class]="auth.isLoggedIn() ? 'pt-16' : ''">
      <router-outlet />
    </main>
  `,
})
export class AppComponent {
  constructor(public auth: AuthService) {}
}
