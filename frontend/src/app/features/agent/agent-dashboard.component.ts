import { Component, OnInit } from '@angular/core';
import { DatePipe, NgClass, NgFor, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AgentMeService } from '../../core/services/agent-me.service';
import { Reclamation } from '../../core/services/reclamation.service';

@Component({
  selector: 'app-agent-dashboard',
  standalone: true,
  imports: [NgIf, NgFor, NgClass, DatePipe, RouterLink],
  template: `
    <section class="grid gap-6">
      <header class="rounded-3xl border border-slate-200 bg-white p-6">
        <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Espace agent</p>
        <h2 class="mt-2 text-2xl font-bold text-slate-900">Mon tableau de bord</h2>
        <p class="mt-1 text-sm text-slate-600">Suivi des réclamations qui vous sont assignées.</p>
      </header>

      <div *ngIf="isLoading" class="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
        Chargement de vos indicateurs...
      </div>

      <div *ngIf="errorMessage" class="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
        {{ errorMessage }}
      </div>

      <div *ngIf="!isLoading && !errorMessage" class="grid gap-4 md:grid-cols-3">
        <article class="rounded-2xl border border-slate-200 bg-white p-4">
          <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Assignées</p>
          <p class="mt-2 text-3xl font-bold text-slate-900">{{ kpi.total }}</p>
        </article>
        <article class="rounded-2xl border border-amber-200 bg-amber-50/70 p-4">
          <p class="text-xs font-semibold uppercase tracking-[0.18em] text-amber-700">Ouvertes</p>
          <p class="mt-2 text-3xl font-bold text-amber-900">{{ kpi.open }}</p>
        </article>
        <article class="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4">
          <p class="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">Résolues</p>
          <p class="mt-2 text-3xl font-bold text-emerald-900">{{ kpi.resolved }}</p>
        </article>
      </div>

      <article *ngIf="!isLoading && !errorMessage" class="rounded-2xl border border-slate-200 bg-white p-4">
        <div class="flex items-center justify-between">
          <h3 class="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Mes réclamations</h3>
          <a routerLink="/agent/reclamations" class="text-sm font-semibold text-brand-700 hover:underline">Voir tout</a>
        </div>
        <div class="mt-4 overflow-x-auto">
          <table class="w-full min-w-[520px] border-collapse text-left text-sm">
            <thead class="text-slate-500">
              <tr>
                <th class="border-b border-slate-100 px-3 py-2 font-semibold">Ticket</th>
                <th class="border-b border-slate-100 px-3 py-2 font-semibold">Statut</th>
                <th class="border-b border-slate-100 px-3 py-2 font-semibold">Priorité</th>
                <th class="border-b border-slate-100 px-3 py-2 font-semibold">Date</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let item of recent" class="border-b border-slate-50 last:border-b-0">
                <td class="px-3 py-2">
                  <a [routerLink]="['/agent/reclamations', item.id]" class="font-semibold text-brand-700 hover:underline">
                    {{ item.numeroTicket || ('#' + item.id) }}
                  </a>
                </td>
                <td class="px-3 py-2">
                  <span class="inline-flex rounded-full px-2.5 py-1 text-xs font-semibold" [ngClass]="getStatusClass(item.statut)">
                    {{ item.statut }}
                  </span>
                </td>
                <td class="px-3 py-2">
                  <span class="inline-flex rounded-full px-2.5 py-1 text-xs font-semibold" [ngClass]="getPriorityClass(item.priorite)">
                    {{ item.priorite }}
                  </span>
                </td>
                <td class="px-3 py-2 text-slate-600">{{ item.dateCreation | date:'short' }}</td>
              </tr>
              <tr *ngIf="recent.length === 0">
                <td colspan="4" class="px-3 py-4 text-center text-slate-500">Aucune réclamation assignée.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </article>
    </section>
  `
})
export class AgentDashboardComponent implements OnInit {
  isLoading = true;
  errorMessage = '';

  recent: Reclamation[] = [];
  kpi = { total: 0, open: 0, resolved: 0 };

  constructor(private readonly agentMeService: AgentMeService) {}

  ngOnInit(): void {
    this.agentMeService.getMyReclamations().subscribe({
      next: (reclamations) => {
        const open = reclamations.filter((item) => item.statut === 'OUVERTE' || item.statut === 'EN_COURS').length;
        const resolved = reclamations.filter((item) => item.statut === 'RESOLUE' || item.statut === 'FERMEE').length;

        this.kpi = {
          total: reclamations.length,
          open,
          resolved
        };

        this.recent = [...reclamations]
          .sort((a, b) => new Date(b.dateCreation).getTime() - new Date(a.dateCreation).getTime())
          .slice(0, 6);

        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Impossible de charger vos réclamations.';
        this.isLoading = false;
      }
    });
  }

  getStatusClass(statut: Reclamation['statut']): string {
    const classes: Record<Reclamation['statut'], string> = {
      OUVERTE: 'bg-amber-100 text-amber-800',
      EN_COURS: 'bg-sky-100 text-sky-800',
      RESOLUE: 'bg-emerald-100 text-emerald-800',
      FERMEE: 'bg-slate-200 text-slate-700'
    };

    return classes[statut];
  }

  getPriorityClass(priorite: Reclamation['priorite']): string {
    const classes: Record<Reclamation['priorite'], string> = {
      BASSE: 'bg-slate-100 text-slate-700',
      MOYENNE: 'bg-indigo-100 text-indigo-800',
      HAUTE: 'bg-orange-100 text-orange-800',
      CRITIQUE: 'bg-rose-100 text-rose-800'
    };

    return classes[priorite];
  }
}
