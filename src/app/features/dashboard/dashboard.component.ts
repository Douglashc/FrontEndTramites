import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TramiteService } from '../../core/services/tramite.service';
import { Dashboard } from '../../core/models/tramite.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="max-w-7xl mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold text-gray-800 mb-8">Dashboard</h1>

      @if (loading) {
        <div class="flex justify-center py-20">
          <div class="animate-spin rounded-full h-12 w-12 border-4 border-indigo-500 border-t-transparent"></div>
        </div>
      } @else if (dashboard) {
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div class="bg-white rounded-xl shadow-md p-6 border-l-4 border-indigo-500">
            <p class="text-sm text-gray-500 uppercase tracking-wide">Total Solicitudes</p>
            <p class="text-3xl font-bold text-gray-800 mt-1">{{ dashboard.totalTramites }}</p>
          </div>
          <div class="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
            <p class="text-sm text-gray-500 uppercase tracking-wide">Activos</p>
            <p class="text-3xl font-bold text-green-600 mt-1">{{ dashboard.tramitesActivos }}</p>
          </div>
          <div class="bg-white rounded-xl shadow-md p-6 border-l-4 border-red-400">
            <p class="text-sm text-gray-500 uppercase tracking-wide">Inactivos (Eliminados)</p>
            <p class="text-3xl font-bold text-red-500 mt-1">{{ dashboard.tramitesInactivos }}</p>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="bg-white rounded-xl shadow-md p-6">
            <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <span class="w-3 h-3 bg-indigo-500 rounded-full mr-2"></span>
              Por Estado
            </h3>
            <div class="space-y-3">
              @for (entry of porEstadoEntries; track entry[0]) {
                <div>
                  <div class="flex justify-between text-sm mb-1">
                    <span class="text-gray-600">{{ entry[0] }}</span>
                    <span class="font-medium text-gray-800">{{ entry[1] }}</span>
                  </div>
                  <div class="w-full bg-gray-200 rounded-full h-2">
                    <div class="h-2 rounded-full"
                         [style.width.%]="getPercentage(entry[1], dashboard.tramitesActivos)"
                         [ngClass]="getEstadoColor(entry[0])"></div>
                  </div>
                </div>
              }
            </div>
          </div>

          <div class="bg-white rounded-xl shadow-md p-6">
            <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <span class="w-3 h-3 bg-orange-500 rounded-full mr-2"></span>
              Por Prioridad
            </h3>
            <div class="space-y-3">
              @for (entry of porPrioridadEntries; track entry[0]) {
                <div>
                  <div class="flex justify-between text-sm mb-1">
                    <span class="text-gray-600">{{ entry[0] }}</span>
                    <span class="font-medium text-gray-800">{{ entry[1] }}</span>
                  </div>
                  <div class="w-full bg-gray-200 rounded-full h-2">
                    <div class="h-2 rounded-full"
                         [style.width.%]="getPercentage(entry[1], dashboard.tramitesActivos)"
                         [ngClass]="getPrioridadColor(entry[0])"></div>
                  </div>
                </div>
              }
            </div>
          </div>

          <div class="bg-white rounded-xl shadow-md p-6">
            <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <span class="w-3 h-3 bg-purple-500 rounded-full mr-2"></span>
              Por Tipo de Tramite
            </h3>
            <div class="space-y-3">
              @for (entry of porTipoEntries; track entry[0]) {
                <div>
                  <div class="flex justify-between text-sm mb-1">
                    <span class="text-gray-600">{{ entry[0] }}</span>
                    <span class="font-medium text-gray-800">{{ entry[1] }}</span>
                  </div>
                  <div class="w-full bg-gray-200 rounded-full h-2">
                    <div class="h-2 rounded-full bg-purple-500"
                         [style.width.%]="getPercentage(entry[1], dashboard.tramitesActivos)"></div>
                  </div>
                </div>
              }
            </div>
          </div>
        </div>
      } @else if (error) {
        <div class="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
          {{ error }}
        </div>
      }
    </div>
  `,
})
export class DashboardComponent implements OnInit {
  dashboard: Dashboard | null = null;
  loading = true;
  error = '';

  porEstadoEntries: [string, number][] = [];
  porPrioridadEntries: [string, number][] = [];
  porTipoEntries: [string, number][] = [];

  constructor(private tramiteService: TramiteService) {}

  ngOnInit(): void {
    this.loadDashboard();
  }

  loadDashboard(): void {
    this.tramiteService.getDashboard().subscribe({
      next: (res) => {
        this.loading = false;
        if (res.success) {
          this.dashboard = res.data;
          this.porEstadoEntries = Object.entries(res.data.porEstado);
          this.porPrioridadEntries = Object.entries(res.data.porPrioridad);
          this.porTipoEntries = Object.entries(res.data.porTipoTramite);
        } else {
          this.error = res.message;
        }
      },
      error: () => {
        this.loading = false;
        this.error = 'Error al cargar el dashboard';
      },
    });
  }

  getPercentage(value: number, total: number): number {
    if (total === 0) return 0;
    return Math.round((value / total) * 100);
  }

  getEstadoColor(estado: string): string {
    switch (estado) {
      case 'Registrado': return 'bg-blue-500';
      case 'En Revisión': return 'bg-yellow-500';
      case 'En Proceso': return 'bg-indigo-500';
      case 'Resuelto': return 'bg-green-500';
      case 'Rechazado': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  }

  getPrioridadColor(prioridad: string): string {
    switch (prioridad) {
      case 'Alta': return 'bg-red-500';
      case 'Media': return 'bg-orange-500';
      case 'Baja': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  }
}
