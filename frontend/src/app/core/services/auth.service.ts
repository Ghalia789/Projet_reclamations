import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { TokenService } from './token.service';
import { environment } from '../../../environments/environment';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  tokenType: string;
  username: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(
    private readonly http: HttpClient,
    private readonly tokenService: TokenService
  ) {}

  login(payload: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${environment.apiBaseUrl}/api/auth/login`, payload).pipe(
      tap((response) => this.tokenService.set(response.token))
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
}
