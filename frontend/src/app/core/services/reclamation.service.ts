import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { TokenService } from './token.service';

export type ReclamationStatut = 'OUVERTE' | 'EN_COURS' | 'RESOLUE' | 'FERMEE';
export type ReclamationAction = 'CREATED' | 'ASSIGNED' | 'UPDATED' | 'RESOLVED' | 'CLOSED';

export interface Reclamation {
  id: number;
  description: string;
  dateCreation: string;
  statut: ReclamationStatut;
  note: number | null;
  clientId: number;
  produitId: number;
  agentAssigneId: number | null;
}

export interface ReclamationCreatePayload {
  description: string;
  note?: number;
  clientId: number;
  produitId: number;
  agentAssigneId?: number;
}

export interface ReclamationAssignPayload {
  agentId: number;
}

export interface ReclamationUpdateStatutPayload {
  statut: ReclamationStatut;
  message?: string;
}

export interface SuiviReclamation {
  id: number;
  message: string;
  action: ReclamationAction;
  dateAction: string;
  reclamationId: number;
  agentAuteurId: number | null;
}

@Injectable({ providedIn: 'root' })
export class ReclamationService {
  private readonly baseUrl = `${environment.apiBaseUrl}/api/reclamations`;

  constructor(
    private readonly http: HttpClient,
    private readonly tokenService: TokenService
  ) {}

  getAll(): Observable<Reclamation[]> {
    return this.http.get<Reclamation[]>(this.baseUrl, { headers: this.buildAuthHeaders() });
  }

  getById(id: number): Observable<Reclamation> {
    return this.http.get<Reclamation>(`${this.baseUrl}/${id}`, { headers: this.buildAuthHeaders() });
  }

  create(payload: ReclamationCreatePayload): Observable<Reclamation> {
    return this.http.post<Reclamation>(this.baseUrl, payload, { headers: this.buildAuthHeaders() });
  }

  assignAgent(id: number, payload: ReclamationAssignPayload): Observable<Reclamation> {
    return this.http.put<Reclamation>(`${this.baseUrl}/${id}/assign`, payload, { headers: this.buildAuthHeaders() });
  }

  updateStatut(id: number, payload: ReclamationUpdateStatutPayload): Observable<Reclamation> {
    return this.http.put<Reclamation>(`${this.baseUrl}/${id}/statut`, payload, { headers: this.buildAuthHeaders() });
  }

  getSuiviByReclamation(id: number): Observable<SuiviReclamation[]> {
    return this.http.get<SuiviReclamation[]>(`${this.baseUrl}/${id}/suivi`, { headers: this.buildAuthHeaders() });
  }

  private buildAuthHeaders(): HttpHeaders | undefined {
    const token = this.tokenService.get();
    if (!token) {
      return undefined;
    }

    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }
}
