import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TramiteService } from '../../../core/services/tramite.service';
import { Tramite } from '../../../core/models/tramite.model';

@Component({
  selector: 'app-tramite-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './tramite-detail.component.html',
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
