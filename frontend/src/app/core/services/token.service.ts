import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class TokenService {
  private readonly tokenKey = 'reclamations_token';

  set(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  get(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  clear(): void {
    localStorage.removeItem(this.tokenKey);
  }
}
