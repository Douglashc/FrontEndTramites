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
  template: `
    <div class="max-w-7xl mx-auto px-4 py-8">
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-3xl font-bold text-gray-800">Solicitudes Municipales</h1>
        <a routerLink="/tramites/crear"
           class="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors shadow-md">
          + Nueva Solicitud
        </a>
      </div>

      <div class="bg-white rounded-xl shadow-md p-6 mb-6">
        <h3 class="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">Filtros de Busqueda</h3>
        <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <label class="block text-xs text-gray-500 mb-1">Ciudadano</label>
            <input type="text" [(ngModel)]="filters.nombreCiudadano"
                   (ngModelChange)="onFilterChange()"
                   placeholder="Buscar por nombre..."
                   class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none" />
          </div>
          <div>
            <label class="block text-xs text-gray-500 mb-1">Tipo de Tramite</label>
            <select [(ngModel)]="filters.tipoTramite"
                    (ngModelChange)="onFilterChange()"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none">
              <option [ngValue]="null">Todos</option>
              @for (tipo of tiposTramite; track tipo.value) {
                <option [ngValue]="tipo.value">{{ tipo.label }}</option>
              }
            </select>
          </div>
          <div>
            <label class="block text-xs text-gray-500 mb-1">Estado</label>
            <select [(ngModel)]="filters.estado"
                    (ngModelChange)="onFilterChange()"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none">
              <option [ngValue]="null">Todos</option>
              @for (estado of estadosTramite; track estado.value) {
                <option [ngValue]="estado.value">{{ estado.label }}</option>
              }
            </select>
          </div>
          <div>
            <label class="block text-xs text-gray-500 mb-1">Prioridad</label>
            <select [(ngModel)]="filters.prioridad"
                    (ngModelChange)="onFilterChange()"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none">
              <option [ngValue]="null">Todas</option>
              @for (p of prioridades; track p.value) {
                <option [ngValue]="p.value">{{ p.label }}</option>
              }
            </select>
          </div>
          <div class="flex items-end">
            <button (click)="clearFilters()"
                    class="w-full px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm transition-colors">
              Limpiar Filtros
            </button>
          </div>
        </div>
      </div>

      @if (loading) {
        <div class="flex justify-center py-20">
          <div class="animate-spin rounded-full h-12 w-12 border-4 border-indigo-500 border-t-transparent"></div>
        </div>
      } @else if (error) {
        <div class="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">{{ error }}</div>
      } @else {
        <div class="bg-white rounded-xl shadow-md overflow-hidden">
          <table class="w-full">
            <thead class="bg-gray-50 border-b border-gray-200">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">ID</th>
                <th class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Ciudadano</th>
                <th class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Tipo</th>
                <th class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Estado</th>
                <th class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Prioridad</th>
                <th class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Fecha</th>
                <th class="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              @for (tramite of tramites; track tramite.id) {
                <tr class="hover:bg-gray-50 transition-colors">
                  <td class="px-6 py-4 text-sm text-gray-600 font-medium">{{ tramite.id }}</td>
                  <td class="px-6 py-4 text-sm text-gray-800">{{ tramite.nombreCiudadano }}</td>
                  <td class="px-6 py-4">
                    <span class="inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                      {{ tramite.tipoTramiteNombre }}
                    </span>
                  </td>
                  <td class="px-6 py-4">
                    <span class="inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium"
                          [ngClass]="getEstadoBadge(tramite.estado)">
                      {{ tramite.estadoNombre }}
                    </span>
                  </td>
                  <td class="px-6 py-4">
                    <span class="inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium"
                          [ngClass]="getPrioridadBadge(tramite.prioridad)">
                      {{ tramite.prioridadNombre }}
                    </span>
                  </td>
                  <td class="px-6 py-4 text-sm text-gray-600">
                    {{ tramite.fechaRegistro | date:'dd/MM/yyyy' }}
                  </td>
                  <td class="px-6 py-4 text-center">
                    <div class="flex items-center justify-center space-x-2">
                      <a [routerLink]="['/tramites', tramite.id]"
                         class="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" title="Ver detalle">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </a>
                      <a [routerLink]="['/tramites', tramite.id, 'editar']"
                         class="p-1.5 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors" title="Editar">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </a>
                      <button (click)="onDelete(tramite)"
                              class="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Eliminar">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              } @empty {
                <tr>
                  <td colspan="7" class="px-6 py-12 text-center text-gray-500">
                    No se encontraron solicitudes con los filtros aplicados.
                  </td>
                </tr>
              }
            </tbody>
          </table>

          @if (pagination) {
            <div class="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
              <p class="text-sm text-gray-500">
                Mostrando {{ (pagination.page - 1) * pagination.pageSize + 1 }}
                a {{ Math.min(pagination.page * pagination.pageSize, pagination.totalCount) }}
                de {{ pagination.totalCount }} resultados
              </p>
              <div class="flex items-center space-x-2">
                <button (click)="goToPage(pagination.page - 1)" [disabled]="!pagination.hasPrevious"
                        class="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                  Anterior
                </button>
                @for (p of getPageNumbers(); track p) {
                  <button (click)="goToPage(p)"
                          class="px-3 py-1.5 text-sm rounded-lg transition-colors"
                          [ngClass]="p === pagination.page ? 'bg-indigo-600 text-white' : 'border border-gray-300 hover:bg-gray-50'">
                    {{ p }}
                  </button>
                }
                <button (click)="goToPage(pagination.page + 1)" [disabled]="!pagination.hasNext"
                        class="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                  Siguiente
                </button>
              </div>
            </div>
          }
        </div>
      }
    </div>
  `,
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
