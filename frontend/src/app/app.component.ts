import { Component } from '@angular/core';
import { NgIf } from '@angular/common';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, NgIf],
  template: `
    <div class="shell">
      <header class="topbar">
        <div>
          <p class="eyebrow">Système de Gestion des Réclamations</p>
          <h1>Reclamations Admin</h1>
        </div>
        <nav class="nav" aria-label="Main navigation">
          <a routerLink="/dashboard" routerLinkActive="active">Dashboard</a>
          <a routerLink="/clients" routerLinkActive="active">Clients</a>
          <a routerLink="/produits" routerLinkActive="active">Produits</a>
          <a routerLink="/agents" routerLinkActive="active">Agents</a>
          <a routerLink="/reclamations" routerLinkActive="active">Réclamations</a>
          <a routerLink="/login" routerLinkActive="active" *ngIf="!authService.isAuthenticated()">Login</a>
          <button class="logout" type="button" *ngIf="authService.isAuthenticated()" (click)="logout()">Logout</button>
        </nav>
      </header>

      <main class="content">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    .shell {
      min-height: 100vh;
      padding: 24px;
    }

    .topbar {
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
      gap: 24px;
      padding: 24px;
      background: rgba(255, 255, 255, 0.75);
      backdrop-filter: blur(20px);
      border: 1px solid var(--border);
      border-radius: 24px;
      box-shadow: var(--shadow);
      margin-bottom: 24px;
    }

    .eyebrow {
      margin: 0 0 8px;
      text-transform: uppercase;
      letter-spacing: 0.18em;
      color: var(--muted);
      font-size: 0.75rem;
    }

    h1 {
      margin: 0;
      font-size: 1.7rem;
    }

    .nav {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
    }

    .nav a {
      padding: 10px 14px;
      border-radius: 999px;
      color: var(--muted);
      background: var(--surface);
      border: 1px solid transparent;
      transition: all 0.2s ease;
    }

    .nav a.active,
    .nav a:hover {
      color: var(--primary-strong);
      border-color: rgba(15, 118, 110, 0.20);
      background: var(--surface-alt);
    }

    .logout {
      padding: 10px 14px;
      border-radius: 999px;
      color: #fff;
      background: var(--primary);
      border: 1px solid transparent;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .logout:hover {
      background: var(--primary-strong);
    }

    .content {
      padding: 24px;
      background: rgba(255, 255, 255, 0.72);
      border-radius: 24px;
      border: 1px solid var(--border);
      box-shadow: var(--shadow);
      min-height: calc(100vh - 160px);
    }

    @media (max-width: 900px) {
      .topbar {
        flex-direction: column;
        align-items: flex-start;
      }
    }
  `]
})
export class AppComponent {
  constructor(public authService: AuthService, private readonly router: Router) {}

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
