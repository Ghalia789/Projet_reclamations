import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { TokenService } from './token.service';
import { Agent } from './agent.service';
import {
  Reclamation,
  ReclamationUpdateStatutPayload,
  SuiviReclamation
} from './reclamation.service';

export interface AgentSuiviCreatePayload {
  message: string;
  action: 'CREATED' | 'ASSIGNED' | 'UPDATED' | 'RESOLVED' | 'CLOSED';
  timeSpentMinutes?: number;
}

@Injectable({ providedIn: 'root' })
export class AgentMeService {
  private readonly baseUrl = `${environment.apiBaseUrl}/api/agents/me`;

  constructor(
    private readonly http: HttpClient,
    private readonly tokenService: TokenService
  ) {}

  getProfile(): Observable<Agent> {
    return this.http.get<Agent>(this.baseUrl, { headers: this.buildAuthHeaders() });
  }

  getMyReclamations(): Observable<Reclamation[]> {
    return this.http.get<Reclamation[]>(`${this.baseUrl}/reclamations`, { headers: this.buildAuthHeaders() });
  }

  getMyReclamationById(id: number): Observable<Reclamation> {
    return this.http.get<Reclamation>(`${this.baseUrl}/reclamations/${id}`, { headers: this.buildAuthHeaders() });
  }

  getMySuivis(id: number): Observable<SuiviReclamation[]> {
    return this.http.get<SuiviReclamation[]>(`${this.baseUrl}/reclamations/${id}/suivi`, { headers: this.buildAuthHeaders() });
  }

  addSuivi(id: number, payload: AgentSuiviCreatePayload): Observable<SuiviReclamation> {
    return this.http.post<SuiviReclamation>(`${this.baseUrl}/reclamations/${id}/suivi`, payload, { headers: this.buildAuthHeaders() });
  }

  updateStatut(id: number, payload: ReclamationUpdateStatutPayload): Observable<Reclamation> {
    return this.http.put<Reclamation>(`${this.baseUrl}/reclamations/${id}/statut`, payload, { headers: this.buildAuthHeaders() });
  }

  private buildAuthHeaders(): HttpHeaders | undefined {
    const token = this.tokenService.get();
    if (!token) {
      return undefined;
    }

    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }
}
