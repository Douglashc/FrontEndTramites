import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TramiteService } from '../../../core/services/tramite.service';
import {
  TIPOS_TRAMITE,
  PRIORIDADES,
  ESTADOS_TRAMITE,
} from '../../../core/models/tramite.model';

@Component({
  selector: 'app-tramite-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './tramite-form.component.html',
})
export class TramiteFormComponent implements OnInit {
  isEditing = false;
  tramiteId: number = 0;
  loading = false;
  successMessage = '';
  errorMessage = '';
  validationErrors: string[] = [];

  tiposTramite = TIPOS_TRAMITE;
  prioridades = PRIORIDADES;
  estadosTramite = ESTADOS_TRAMITE;

  form = {
    nombreCiudadano: '',
    tipoTramite: null as number | null,
    descripcion: '',
    prioridad: null as number | null,
    estado: null as number | null,
    observaciones: '',
  };

  constructor(
    private tramiteService: TramiteService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditing = true;
      this.tramiteId = +id;
      this.loadTramite();
    }
  }

  loadTramite(): void {
    this.tramiteService.getById(this.tramiteId).subscribe({
      next: (res) => {
        if (res.success) {
          const t = res.data;
          this.form = {
            nombreCiudadano: t.nombreCiudadano,
            tipoTramite: t.tipoTramite,
            descripcion: t.descripcion,
            prioridad: t.prioridad,
            estado: t.estado,
            observaciones: t.observaciones || '',
          };
        }
      },
    });
  }

  onSubmit(): void {
    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';
    this.validationErrors = [];

    if (this.isEditing) {
      const updatePayload = {
        nombreCiudadano: this.form.nombreCiudadano || undefined,
        tipoTramite: this.form.tipoTramite ?? undefined,
        descripcion: this.form.descripcion || undefined,
        prioridad: this.form.prioridad ?? undefined,
        estado: this.form.estado ?? undefined,
        observaciones: this.form.observaciones || undefined,
      };
      this.tramiteService.update(this.tramiteId, updatePayload).subscribe({
        next: (res) => {
          this.loading = false;
          if (res.success) {
            this.successMessage = 'Solicitud actualizada exitosamente';
          } else {
            this.errorMessage = res.message;
            if (res.errors?.length) this.validationErrors = res.errors;
          }
        },
        error: () => {
          this.loading = false;
          this.errorMessage = 'Error al actualizar la solicitud';
        },
      });
    } else {
      this.tramiteService.create(this.form as any).subscribe({
        next: (res) => {
          this.loading = false;
          if (res.success) {
            this.router.navigate(['/tramites']);
          } else {
            this.errorMessage = res.message;
            if (res.errors?.length) this.validationErrors = res.errors;
          }
        },
        error: () => {
          this.loading = false;
          this.errorMessage = 'Error al crear la solicitud';
        },
      });
    }
  }
}
