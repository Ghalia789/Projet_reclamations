import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { TokenService } from './token.service';

export interface AdminAccountResponse {
  id: number;
  email: string;
  role: 'ADMIN' | 'AGENT';
  enabled: boolean;
  agentId: number | null;
}

export interface AdminAccountCreatePayload {
  email: string;
  password: string;
  role?: 'ADMIN' | 'AGENT';
  agentId?: number | null;
  enabled?: boolean;
}

export interface AdminAccountUpdatePayload {
  email?: string;
  role?: 'ADMIN' | 'AGENT';
  enabled?: boolean;
  agentId?: number | null;
  unlinkAgent?: boolean;
}

export interface AdminPasswordResetPayload {
  newPassword: string;
}

@Injectable({ providedIn: 'root' })
export class AdminAccountService {
  private readonly baseUrl = `${environment.apiBaseUrl}/api/admin/agents/accounts`;

  constructor(
    private readonly http: HttpClient,
    private readonly tokenService: TokenService
  ) {}

  getAll(): Observable<AdminAccountResponse[]> {
    return this.http.get<AdminAccountResponse[]>(this.baseUrl, { headers: this.buildAuthHeaders() });
  }

  getById(id: number): Observable<AdminAccountResponse> {
    return this.http.get<AdminAccountResponse>(`${this.baseUrl}/${id}`, { headers: this.buildAuthHeaders() });
  }

  create(payload: AdminAccountCreatePayload): Observable<AdminAccountResponse> {
    return this.http.post<AdminAccountResponse>(this.baseUrl, payload, { headers: this.buildAuthHeaders() });
  }

  update(id: number, payload: AdminAccountUpdatePayload): Observable<AdminAccountResponse> {
    return this.http.put<AdminAccountResponse>(`${this.baseUrl}/${id}`, payload, { headers: this.buildAuthHeaders() });
  }

  resetPassword(id: number, payload: AdminPasswordResetPayload): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${id}/reset-password`, payload, { headers: this.buildAuthHeaders() });
  }

  private buildAuthHeaders(): HttpHeaders | undefined {
    const token = this.tokenService.get();
    if (!token) {
      return undefined;
    }

    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }
}
