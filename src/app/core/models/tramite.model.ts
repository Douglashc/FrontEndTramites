export interface Tramite {
  id: number;
  nombreCiudadano: string;
  tipoTramite: number;
  tipoTramiteNombre: string;
  descripcion: string;
  fechaRegistro: string;
  estado: number;
  estadoNombre: string;
  prioridad: number;
  prioridadNombre: string;
  activo: boolean;
  fechaActualizacion: string | null;
  observaciones: string | null;
}

export interface CreateTramite {
  nombreCiudadano: string;
  tipoTramite: number;
  descripcion: string;
  prioridad: number;
}

export interface UpdateTramite {
  nombreCiudadano?: string;
  tipoTramite?: number;
  descripcion?: string;
  prioridad?: number;
  estado?: number;
  observaciones?: string;
}

export interface PaginatedResult<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasPrevious: boolean;
  hasNext: boolean;
}

export interface Dashboard {
  totalTramites: number;
  tramitesActivos: number;
  tramitesInactivos: number;
  porEstado: { [key: string]: number };
  porPrioridad: { [key: string]: number };
  porTipoTramite: { [key: string]: number };
}

export interface ServiceResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errors: string[];
}

export const TIPOS_TRAMITE: { value: number; label: string }[] = [
  { value: 1, label: 'Certificado de Residencia' },
  { value: 2, label: 'Permiso de Construcción' },
  { value: 3, label: 'Poda de Árboles' },
  { value: 4, label: 'Alumbrado' },
  { value: 5, label: 'Baches' },
  { value: 6, label: 'Limpieza' },
];

export const ESTADOS_TRAMITE: { value: number; label: string }[] = [
  { value: 1, label: 'Registrado' },
  { value: 2, label: 'En Revisión' },
  { value: 3, label: 'En Proceso' },
  { value: 4, label: 'Resuelto' },
  { value: 5, label: 'Rechazado' },
];

export const PRIORIDADES: { value: number; label: string }[] = [
  { value: 1, label: 'Baja' },
  { value: 2, label: 'Media' },
  { value: 3, label: 'Alta' },
];
