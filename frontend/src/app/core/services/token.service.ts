import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class TokenService {
  private readonly tokenKey = 'reclamations_token';
  private readonly roleKey = 'reclamations_role';
  private readonly agentIdKey = 'reclamations_agent_id';
  private readonly emailKey = 'reclamations_email';

  set(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  setAuth(token: string, role?: string, agentId?: number | null, email?: string): void {
    this.set(token);
    if (role) {
      localStorage.setItem(this.roleKey, role);
    }
    if (email) {
      localStorage.setItem(this.emailKey, email);
    }
    if (agentId != null) {
      localStorage.setItem(this.agentIdKey, String(agentId));
    }
  }

  get(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getRole(): string | null {
    return localStorage.getItem(this.roleKey);
  }

  getAgentId(): number | null {
    const value = localStorage.getItem(this.agentIdKey);
    if (!value) {
      return null;
    }
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }

  getEmail(): string | null {
    return localStorage.getItem(this.emailKey);
  }

  clear(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.roleKey);
    localStorage.removeItem(this.agentIdKey);
    localStorage.removeItem(this.emailKey);
  }
}
