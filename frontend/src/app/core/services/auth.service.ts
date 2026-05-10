import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { TokenService } from './token.service';
import { environment } from '../../../environments/environment';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  tokenType: string;
  username: string;
  role?: string;
  agentId?: number | null;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(
    private readonly http: HttpClient,
    private readonly tokenService: TokenService
  ) {}

  login(payload: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${environment.apiBaseUrl}/api/auth/login`, payload).pipe(
      tap((response) => this.tokenService.setAuth(response.token, response.role, response.agentId, response.username))
    );
  }

  logout(): void {
    this.tokenService.clear();
  }

  isAuthenticated(): boolean {
    return Boolean(this.tokenService.get());
  }

  getToken(): string | null {
    return this.tokenService.get();
  }

  getRole(): string | null {
    return this.tokenService.getRole();
  }

  getAgentId(): number | null {
    return this.tokenService.getAgentId();
  }

  isAdmin(): boolean {
    return this.getRole() === 'ADMIN';
  }

  isAgent(): boolean {
    return this.getRole() === 'AGENT';
  }
}
