import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login/login.component').then(
        (m) => m.LoginComponent
      ),
  },
  {
    path: '',
    canActivate: [authGuard],
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/dashboard/dashboard.component').then(
            (m) => m.DashboardComponent
          ),
      },
      {
        path: 'tramites',
        loadComponent: () =>
          import('./features/tramites/tramite-list/tramite-list.component').then(
            (m) => m.TramiteListComponent
          ),
      },
      {
        path: 'tramites/crear',
        loadComponent: () =>
          import('./features/tramites/tramite-form/tramite-form.component').then(
            (m) => m.TramiteFormComponent
          ),
      },
      {
        path: 'tramites/:id/editar',
        loadComponent: () =>
          import('./features/tramites/tramite-form/tramite-form.component').then(
            (m) => m.TramiteFormComponent
          ),
      },
      {
        path: 'tramites/:id',
        loadComponent: () =>
          import(
            './features/tramites/tramite-detail/tramite-detail.component'
          ).then((m) => m.TramiteDetailComponent),
      },
    ],
  },
  { path: '**', redirectTo: '' },
];
