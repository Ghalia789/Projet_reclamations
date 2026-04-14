import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { TokenService } from './token.service';

export interface Client {
  id: number;
  nom: string;
  email: string;
  telephone: string;
}

export interface ClientCreatePayload {
  nom: string;
  email: string;
  telephone: string;
}

@Injectable({ providedIn: 'root' })
export class ClientService {
  private readonly baseUrl = `${environment.apiBaseUrl}/api/clients`;

  constructor(
    private readonly http: HttpClient,
    private readonly tokenService: TokenService
  ) {}

  getAll(): Observable<Client[]> {
    return this.http.get<Client[]>(this.baseUrl, { headers: this.buildAuthHeaders() });
  }

  getById(id: number): Observable<Client> {
    return this.http.get<Client>(`${this.baseUrl}/${id}`, { headers: this.buildAuthHeaders() });
  }

  create(payload: ClientCreatePayload): Observable<Client> {
    return this.http.post<Client>(this.baseUrl, payload, { headers: this.buildAuthHeaders() });
  }

  private buildAuthHeaders(): HttpHeaders | undefined {
    const token = this.tokenService.get();
    if (!token) {
      return undefined;
    }

    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }
}