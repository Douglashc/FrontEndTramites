import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TramiteService } from '../../core/services/tramite.service';
import { Dashboard } from '../../core/models/tramite.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
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
