import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { TokenService } from './token.service';

export interface Agent {
  id: number;
  nom: string;
  competence: string;
  niveau: 'L1' | 'L2' | 'EXPERT';
  equipe: string | null;
  actif: boolean;
}

export interface AgentCreatePayload {
  nom: string;
  competence: string;
  niveau?: 'L1' | 'L2' | 'EXPERT';
  equipe?: string;
  actif?: boolean;
}

@Injectable({ providedIn: 'root' })
export class AgentService {
  private readonly baseUrl = `${environment.apiBaseUrl}/api/agents`;

  constructor(
    private readonly http: HttpClient,
    private readonly tokenService: TokenService
  ) {}

  getAll(): Observable<Agent[]> {
    return this.http.get<Agent[]>(this.baseUrl, { headers: this.buildAuthHeaders() });
  }

  getById(id: number): Observable<Agent> {
    return this.http.get<Agent>(`${this.baseUrl}/${id}`, { headers: this.buildAuthHeaders() });
  }

  create(payload: AgentCreatePayload): Observable<Agent> {
    return this.http.post<Agent>(this.baseUrl, payload, { headers: this.buildAuthHeaders() });
  }

  private buildAuthHeaders(): HttpHeaders | undefined {
    const token = this.tokenService.get();
    if (!token) {
      return undefined;
    }

    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }
}
