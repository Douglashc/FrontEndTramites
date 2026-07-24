import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <nav class="fixed top-0 left-0 right-0 z-50 bg-indigo-700 text-white shadow-lg">
      <div class="max-w-7xl mx-auto px-4">
        <div class="flex items-center justify-between h-16">
          <div class="flex items-center space-x-1">
            <a routerLink="/dashboard"
               class="px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-600 transition-colors"
               routerLinkActive="bg-indigo-800">
              Dashboard
            </a>
            <a routerLink="/tramites"
               class="px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-600 transition-colors"
               routerLinkActive="bg-indigo-800">
              Tramites
            </a>
          </div>
          <div class="flex items-center space-x-4">
            <span class="text-sm text-indigo-200">
              {{ auth.currentUser?.name }} {{ auth.currentUser?.lastName }}
            </span>
            <button (click)="logout()"
                    class="px-3 py-1.5 bg-indigo-500 hover:bg-indigo-400 rounded text-sm transition-colors">
              Cerrar Sesion
            </button>
          </div>
        </div>
      </div>
    </nav>
  `,
})
export class NavbarComponent {
  constructor(public auth: AuthService) {}

  logout(): void {
    this.auth.logout();
    window.location.href = '/login';
  }
}
