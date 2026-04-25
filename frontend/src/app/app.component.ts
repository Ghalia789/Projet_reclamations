import { Component } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from './core/services/auth.service';
import { ToastContainerComponent } from './shared/ui/toast-container.component';
import {
  LucideAngularModule
} from 'lucide-angular';

interface NavItem {
  to: string;
  label: string;
  icon: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    NgFor,
    NgIf,
    ToastContainerComponent,
    LucideAngularModule
  ],
  template: `
    <app-toast-container></app-toast-container>
    <div class="min-h-screen p-4 md:p-6">
      <header class="mb-6 rounded-2xl border border-brand-600/15 bg-white/90 px-6 py-4 shadow-soft backdrop-blur">
        <div class="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p class="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Système de Gestion des Réclamations</p>
            <h1 class="mt-0.5 text-xl font-bold text-slate-900">Reclamations Admin</h1>
          </div>

          <nav class="flex w-full flex-wrap items-center gap-2 md:w-auto md:gap-1" aria-label="Main navigation">
            <a
              *ngFor="let item of navItems"
              [routerLink]="item.to"
              [class.active]="isNavItemActive(item.to)"
              class="nav-pill"
            >
              <lucide-icon [name]="item.icon" class="h-4 w-4" aria-hidden="true"></lucide-icon>
              <span>{{ item.label }}</span>
            </a>

            <a routerLink="/login" routerLinkActive="active" class="nav-pill" *ngIf="!authService.isAuthenticated()">
              <lucide-icon name="users" class="h-4 w-4" aria-hidden="true"></lucide-icon>
              <span>Login</span>
            </a>

            <button class="logout-pill" type="button" *ngIf="authService.isAuthenticated()" (click)="logout()">
              <lucide-icon name="log-out" class="h-4 w-4" aria-hidden="true"></lucide-icon>
              <span>Logout</span>
            </button>
          </nav>
        </div>
      </header>

      <main class="min-h-[70vh] rounded-2xl border border-slate-200 bg-white/80 p-6 shadow-soft md:p-8">
        <router-outlet></router-outlet>
      </main>
    </div>
  `
})
export class AppComponent {
  readonly navItems: NavItem[] = [
    { to: '/dashboard', label: 'Dashboard', icon: 'layout-dashboard' },
    { to: '/clients', label: 'Clients', icon: 'users' },
    { to: '/produits', label: 'Produits', icon: 'package' },
    { to: '/agents', label: 'Agents', icon: 'headphones' },
    { to: '/reclamations', label: 'Réclamations', icon: 'file-warning' },
    { to: '/reclamations/report', label: 'Rapports', icon: 'bar-chart-3' }
  ];

  constructor(public authService: AuthService, private readonly router: Router) {}

  isNavItemActive(path: string): boolean {
    const current = this.router.url;

    if (path === '/reclamations/report') {
      return current === '/reclamations/report';
    }

    if (path === '/reclamations') {
      if (current === '/reclamations/report') {
        return false;
      }

      return current === '/reclamations' || current.startsWith('/reclamations/');
    }

    return current === path || current.startsWith(`${path}/`);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
