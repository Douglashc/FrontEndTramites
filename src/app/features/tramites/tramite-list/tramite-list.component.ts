import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { TramiteService } from '../../../core/services/tramite.service';
import {
  Tramite,
  PaginatedResult,
  TIPOS_TRAMITE,
  ESTADOS_TRAMITE,
  PRIORIDADES,
} from '../../../core/models/tramite.model';

@Component({
  selector: 'app-tramite-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './tramite-list.component.html',
})
export class TramiteListComponent implements OnInit {
  Math = Math;
  tramites: Tramite[] = [];
  pagination: PaginatedResult<Tramite> | null = null;
  loading = true;
  error = '';

  tiposTramite = TIPOS_TRAMITE;
  estadosTramite = ESTADOS_TRAMITE;
  prioridades = PRIORIDADES;

  filters: {
    nombreCiudadano: string;
    tipoTramite: number | null;
    estado: number | null;
    prioridad: number | null;
  } = {
    nombreCiudadano: '',
    tipoTramite: null,
    estado: null,
    prioridad: null,
  };

  private debounceTimer: any;

  constructor(private tramiteService: TramiteService, private router: Router) {}

  ngOnInit(): void {
    this.loadTramites();
  }

  loadTramites(page: number = 1): void {
    this.loading = true;
    this.tramiteService.getAll(page, 10, this.filters).subscribe({
      next: (res) => {
        this.loading = false;
        if (res.success) {
          this.tramites = res.data.items;
          this.pagination = res.data;
        } else {
          this.error = res.message;
        }
      },
      error: () => {
        this.loading = false;
        this.error = 'Error al cargar las solicitudes';
      },
    });
  }

  onFilterChange(): void {
    clearTimeout(this.debounceTimer);
    this.debounceTimer = setTimeout(() => this.loadTramites(), 400);
  }

  clearFilters(): void {
    this.filters = {
      nombreCiudadano: '',
      tipoTramite: null,
      estado: null,
      prioridad: null,
    };
    this.loadTramites();
  }

  goToPage(page: number): void {
    if (page >= 1 && this.pagination && page <= this.pagination.totalPages) {
      this.loadTramites(page);
    }
  }

  getPageNumbers(): number[] {
    if (!this.pagination) return [];
    const pages: number[] = [];
    const total = this.pagination.totalPages;
    const current = this.pagination.page;
    const start = Math.max(1, current - 2);
    const end = Math.min(total, current + 2);
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  }

  onDelete(tramite: Tramite): void {
    if (confirm(`Desea eliminar la solicitud #${tramite.id} de ${tramite.nombreCiudadano}?`)) {
      this.tramiteService.delete(tramite.id).subscribe({
        next: (res) => {
          if (res.success) this.loadTramites(this.pagination?.page || 1);
          else alert(res.message);
        },
        error: () => alert('Error al eliminar la solicitud'),
      });
    }
  }

  getEstadoBadge(estado: number): string {
    switch (estado) {
      case 1: return 'bg-blue-100 text-blue-800';
      case 2: return 'bg-yellow-100 text-yellow-800';
      case 3: return 'bg-indigo-100 text-indigo-800';
      case 4: return 'bg-green-100 text-green-800';
      case 5: return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  getPrioridadBadge(prioridad: number): string {
    switch (prioridad) {
      case 3: return 'bg-red-100 text-red-800';
      case 2: return 'bg-orange-100 text-orange-800';
      case 1: return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }
}
