import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TramiteService } from '../../../core/services/tramite.service';
import { Tramite } from '../../../core/models/tramite.model';

@Component({
  selector: 'app-tramite-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="max-w-3xl mx-auto px-4 py-8">
      <div class="mb-6">
        <a routerLink="/tramites" class="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
          &larr; Volver a solicitudes
        </a>
      </div>

      @if (loading) {
        <div class="flex justify-center py-20">
          <div class="animate-spin rounded-full h-12 w-12 border-4 border-indigo-500 border-t-transparent"></div>
        </div>
      } @else if (tramite) {
        <div class="bg-white rounded-xl shadow-md overflow-hidden">
          <div class="px-8 py-6 border-b border-gray-200 flex items-center justify-between">
            <div>
              <h1 class="text-2xl font-bold text-gray-800">Solicitud #{{ tramite.id }}</h1>
              <p class="text-sm text-gray-500 mt-1">
                Registrada el {{ tramite.fechaRegistro | date:'dd/MM/yyyy HH:mm' }}
              </p>
            </div>
            <a [routerLink]="['/tramites', tramite.id, 'editar']"
               class="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-sm font-medium transition-colors">
              Editar
            </a>
          </div>

          <div class="p-8 space-y-6">
            <div class="grid grid-cols-2 gap-6">
              <div>
                <p class="text-xs text-gray-500 uppercase tracking-wide mb-1">Ciudadano</p>
                <p class="text-lg font-medium text-gray-800">{{ tramite.nombreCiudadano }}</p>
              </div>
              <div>
                <p class="text-xs text-gray-500 uppercase tracking-wide mb-1">Tipo de Tramite</p>
                <span class="inline-flex px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                  {{ tramite.tipoTramiteNombre }}
                </span>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-6">
              <div>
                <p class="text-xs text-gray-500 uppercase tracking-wide mb-1">Estado</p>
                <span class="inline-flex px-3 py-1 rounded-full text-sm font-medium"
                      [ngClass]="getEstadoBadge(tramite.estado)">
                  {{ tramite.estadoNombre }}
                </span>
              </div>
              <div>
                <p class="text-xs text-gray-500 uppercase tracking-wide mb-1">Prioridad</p>
                <span class="inline-flex px-3 py-1 rounded-full text-sm font-medium"
                      [ngClass]="getPrioridadBadge(tramite.prioridad)">
                  {{ tramite.prioridadNombre }}
                </span>
              </div>
            </div>

            <div>
              <p class="text-xs text-gray-500 uppercase tracking-wide mb-1">Descripcion</p>
              <p class="text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-lg">
                {{ tramite.descripcion }}
              </p>
            </div>

            @if (tramite.observaciones) {
              <div>
                <p class="text-xs text-gray-500 uppercase tracking-wide mb-1">Observaciones</p>
                <p class="text-gray-700 bg-amber-50 p-4 rounded-lg border border-amber-200">
                  {{ tramite.observaciones }}
                </p>
              </div>
            }

            @if (tramite.fechaActualizacion) {
              <div>
                <p class="text-xs text-gray-500 uppercase tracking-wide mb-1">Ultima Actualizacion</p>
                <p class="text-gray-600">{{ tramite.fechaActualizacion | date:'dd/MM/yyyy HH:mm' }}</p>
              </div>
            }
          </div>

          <div class="px-8 py-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
            <a routerLink="/tramites"
               class="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-100 rounded-lg text-sm transition-colors">
              Volver a la lista
            </a>
            <a [routerLink]="['/tramites', tramite.id, 'editar']"
               class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm transition-colors">
              Editar Solicitud
            </a>
          </div>
        </div>
      } @else if (error) {
        <div class="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">{{ error }}</div>
      }
    </div>
  `,
})
export class TramiteDetailComponent implements OnInit {
  tramite: Tramite | null = null;
  loading = true;
  error = '';

  constructor(
    private tramiteService: TramiteService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadTramite(+id);
    }
  }

  loadTramite(id: number): void {
    this.tramiteService.getById(id).subscribe({
      next: (res) => {
        this.loading = false;
        if (res.success) {
          this.tramite = res.data;
        } else {
          this.error = res.message;
        }
      },
      error: () => {
        this.loading = false;
        this.error = 'Error al cargar la solicitud';
      },
    });
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
