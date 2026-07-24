import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  Tramite,
  CreateTramite,
  UpdateTramite,
  PaginatedResult,
  Dashboard,
  ServiceResponse,
} from '../models/tramite.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class TramiteService {
  private readonly API_URL = `${environment.apiUrl}/Tramite`;

  constructor(private http: HttpClient) {}

  getAll(
    page: number = 1,
    pageSize: number = 10,
    filters: {
      nombreCiudadano?: string;
      tipoTramite?: number | null;
      estado?: number | null;
      prioridad?: number | null;
    } = {}
  ): Observable<ServiceResponse<PaginatedResult<Tramite>>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());

    if (filters.nombreCiudadano)
      params = params.set('nombreCiudadano', filters.nombreCiudadano);
    if (filters.tipoTramite !== undefined && filters.tipoTramite !== null)
      params = params.set('tipoTramite', filters.tipoTramite.toString());
    if (filters.estado !== undefined && filters.estado !== null)
      params = params.set('estado', filters.estado.toString());
    if (filters.prioridad !== undefined && filters.prioridad !== null)
      params = params.set('prioridad', filters.prioridad.toString());

    return this.http.get<ServiceResponse<PaginatedResult<Tramite>>>(
      this.API_URL,
      { params }
    );
  }

  getById(id: number): Observable<ServiceResponse<Tramite>> {
    return this.http.get<ServiceResponse<Tramite>>(`${this.API_URL}/${id}`);
  }

  create(tramite: CreateTramite): Observable<ServiceResponse<Tramite>> {
    return this.http.post<ServiceResponse<Tramite>>(this.API_URL, tramite);
  }

  update(
    id: number,
    tramite: UpdateTramite
  ): Observable<ServiceResponse<Tramite>> {
    return this.http.put<ServiceResponse<Tramite>>(
      `${this.API_URL}/${id}`,
      tramite
    );
  }

  delete(id: number): Observable<ServiceResponse<boolean>> {
    return this.http.delete<ServiceResponse<boolean>>(`${this.API_URL}/${id}`);
  }

  getDashboard(): Observable<ServiceResponse<Dashboard>> {
    return this.http.get<ServiceResponse<Dashboard>>(`${this.API_URL}/dashboard`);
  }
}
