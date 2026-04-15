import { Component, OnInit } from '@angular/core';
import { DatePipe, DecimalPipe, NgClass, NgFor, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { ClientService } from '../../core/services/client.service';
import { ProduitService } from '../../core/services/produit.service';
import { AgentService } from '../../core/services/agent.service';
import { Reclamation, ReclamationPriorite, ReclamationService, ReclamationStatut } from '../../core/services/reclamation.service';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [NgIf, NgFor, NgClass, DatePipe, DecimalPipe, RouterLink],
  template: `
    <section class="grid gap-6">
      <header class="rounded-3xl border border-slate-200 bg-gradient-to-r from-teal-50 via-white to-orange-50 p-6">
        <p class="text-xs font-semibold uppercase tracking-[0.2em] text-teal-700">Pilotage SAV</p>
        <div class="mt-2 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 class="text-3xl font-bold text-slate-900">Dashboard opérationnel</h2>
            <p class="mt-2 max-w-2xl text-sm text-slate-600">
              Vue globale des volumes, de la charge équipe et de la qualité de résolution.
            </p>
          </div>
          <div class="flex flex-wrap gap-2">
            <a routerLink="/reclamations/new" class="rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-700">Nouvelle réclamation</a>
            <a routerLink="/reclamations" class="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">Voir le backlog</a>
          </div>
        </div>
      </header>

      <p *ngIf="isLoading" class="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
        Chargement des indicateurs...
      </p>

      <p *ngIf="errorMessage" class="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
        {{ errorMessage }}
      </p>

      <div *ngIf="!isLoading && !errorMessage" class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <article class="rounded-2xl border border-slate-200 bg-white p-4">
          <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Réclamations</p>
          <p class="mt-2 text-3xl font-bold text-slate-900">{{ kpi.totalReclamations }}</p>
          <p class="mt-1 text-sm text-slate-500">Total tickets enregistrés</p>
        </article>

        <article class="rounded-2xl border border-amber-200 bg-amber-50/70 p-4">
          <p class="text-xs font-semibold uppercase tracking-[0.18em] text-amber-700">Tickets ouverts</p>
          <p class="mt-2 text-3xl font-bold text-amber-900">{{ kpi.openReclamations }}</p>
          <p class="mt-1 text-sm text-amber-700">OUVERTE + EN_COURS</p>
        </article>

        <article class="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4">
          <p class="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">Taux de résolution</p>
          <p class="mt-2 text-3xl font-bold text-emerald-900">{{ kpi.resolutionRate | number:'1.0-0' }}%</p>
          <p class="mt-1 text-sm text-emerald-700">Tickets RESOLUE ou FERMEE</p>
        </article>

        <article class="rounded-2xl border border-sky-200 bg-sky-50/70 p-4">
          <p class="text-xs font-semibold uppercase tracking-[0.18em] text-sky-700">Base métier</p>
          <p class="mt-2 text-3xl font-bold text-sky-900">{{ kpi.clients }} / {{ kpi.produits }} / {{ kpi.agentsActifs }}</p>
          <p class="mt-1 text-sm text-sky-700">Clients / Produits / Agents actifs</p>
        </article>
      </div>

      <div *ngIf="!isLoading && !errorMessage" class="grid gap-4 xl:grid-cols-3">
        <article class="rounded-2xl border border-slate-200 bg-white p-4 xl:col-span-1">
          <h3 class="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Par statut</h3>
          <ul class="mt-4 grid gap-2">
            <li *ngFor="let item of byStatus" class="flex items-center justify-between rounded-xl border border-slate-100 px-3 py-2">
              <span class="inline-flex rounded-full px-2.5 py-1 text-xs font-semibold" [ngClass]="getStatusClass(item.key)">{{ item.key }}</span>
              <span class="text-sm font-semibold text-slate-800">{{ item.count }}</span>
            </li>
          </ul>
        </article>

        <article class="rounded-2xl border border-slate-200 bg-white p-4 xl:col-span-1">
          <h3 class="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Par priorité</h3>
          <ul class="mt-4 grid gap-2">
            <li *ngFor="let item of byPriority" class="flex items-center justify-between rounded-xl border border-slate-100 px-3 py-2">
              <span class="inline-flex rounded-full px-2.5 py-1 text-xs font-semibold" [ngClass]="getPriorityClass(item.key)">{{ item.key }}</span>
              <span class="text-sm font-semibold text-slate-800">{{ item.count }}</span>
            </li>
          </ul>
        </article>

        <article class="rounded-2xl border border-slate-200 bg-white p-4 xl:col-span-1">
          <h3 class="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Performance équipe</h3>
          <dl class="mt-4 grid gap-2 text-sm">
            <div class="flex items-center justify-between rounded-xl border border-slate-100 px-3 py-2">
              <dt class="text-slate-600">Tickets par agent actif</dt>
              <dd class="font-semibold text-slate-900">{{ kpi.ticketsPerAgent | number:'1.1-1' }}</dd>
            </div>
            <div class="flex items-center justify-between rounded-xl border border-slate-100 px-3 py-2">
              <dt class="text-slate-600">Critiques ouvertes</dt>
              <dd class="font-semibold text-rose-700">{{ kpi.criticalOpen }}</dd>
            </div>
            <div class="flex items-center justify-between rounded-xl border border-slate-100 px-3 py-2">
              <dt class="text-slate-600">Nouveaux 7 derniers jours</dt>
              <dd class="font-semibold text-slate-900">{{ kpi.last7Days }}</dd>
            </div>
          </dl>
        </article>
      </div>

      <article *ngIf="!isLoading && !errorMessage" class="rounded-2xl border border-slate-200 bg-white p-4">
        <div class="flex items-center justify-between gap-3">
          <h3 class="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Dernières réclamations</h3>
          <a routerLink="/reclamations" class="text-sm font-semibold text-brand-700 hover:underline">Voir tout</a>
        </div>

        <div class="mt-4 overflow-x-auto">
          <table class="w-full min-w-[640px] border-collapse text-left text-sm">
            <thead class="text-slate-500">
              <tr>
                <th class="border-b border-slate-100 px-3 py-2 font-semibold">Ticket</th>
                <th class="border-b border-slate-100 px-3 py-2 font-semibold">Description</th>
                <th class="border-b border-slate-100 px-3 py-2 font-semibold">Statut</th>
                <th class="border-b border-slate-100 px-3 py-2 font-semibold">Priorité</th>
                <th class="border-b border-slate-100 px-3 py-2 font-semibold">Date</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let item of recentReclamations" class="border-b border-slate-50 last:border-b-0">
                <td class="px-3 py-2 font-semibold text-brand-700">{{ item.numeroTicket || ('#' + item.id) }}</td>
                <td class="px-3 py-2 text-slate-700">{{ item.description }}</td>
                <td class="px-3 py-2">
                  <span class="inline-flex rounded-full px-2.5 py-1 text-xs font-semibold" [ngClass]="getStatusClass(item.statut)">{{ item.statut }}</span>
                </td>
                <td class="px-3 py-2">
                  <span class="inline-flex rounded-full px-2.5 py-1 text-xs font-semibold" [ngClass]="getPriorityClass(item.priorite)">{{ item.priorite }}</span>
                </td>
                <td class="px-3 py-2 text-slate-600">{{ item.dateCreation | date:'short' }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </article>
    </section>
  `
})
export class DashboardComponent implements OnInit {
  isLoading = true;
  errorMessage = '';

  recentReclamations: Reclamation[] = [];

  kpi = {
    totalReclamations: 0,
    openReclamations: 0,
    resolutionRate: 0,
    clients: 0,
    produits: 0,
    agentsActifs: 0,
    ticketsPerAgent: 0,
    criticalOpen: 0,
    last7Days: 0
  };

  byStatus: Array<{ key: ReclamationStatut; count: number }> = [];
  byPriority: Array<{ key: ReclamationPriorite; count: number }> = [];

  constructor(
    private readonly reclamationService: ReclamationService,
    private readonly clientService: ClientService,
    private readonly produitService: ProduitService,
    private readonly agentService: AgentService,
    private readonly toastService: ToastService
  ) {}

  ngOnInit(): void {
    forkJoin({
      reclamations: this.reclamationService.getAll(),
      clients: this.clientService.getAll(),
      produits: this.produitService.getAll(),
      agents: this.agentService.getAll()
    }).subscribe({
      next: ({ reclamations, clients, produits, agents }) => {
        const activeAgents = agents.filter((agent) => agent.actif).length;
        const resolvedCount = reclamations.filter((item) => item.statut === 'RESOLUE' || item.statut === 'FERMEE').length;
        const openCount = reclamations.filter((item) => item.statut === 'OUVERTE' || item.statut === 'EN_COURS').length;
        const criticalOpen = reclamations.filter((item) => item.priorite === 'CRITIQUE' && (item.statut === 'OUVERTE' || item.statut === 'EN_COURS')).length;

        const now = Date.now();
        const sevenDaysAgo = now - (7 * 24 * 60 * 60 * 1000);
        const last7Days = reclamations.filter((item) => new Date(item.dateCreation).getTime() >= sevenDaysAgo).length;

        this.kpi = {
          totalReclamations: reclamations.length,
          openReclamations: openCount,
          resolutionRate: reclamations.length > 0 ? (resolvedCount / reclamations.length) * 100 : 0,
          clients: clients.length,
          produits: produits.length,
          agentsActifs: activeAgents,
          ticketsPerAgent: activeAgents > 0 ? reclamations.length / activeAgents : 0,
          criticalOpen,
          last7Days
        };

        this.byStatus = this.groupByStatus(reclamations);
        this.byPriority = this.groupByPriority(reclamations);
        this.recentReclamations = [...reclamations]
          .sort((a, b) => new Date(b.dateCreation).getTime() - new Date(a.dateCreation).getTime())
          .slice(0, 8);

        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Impossible de charger le dashboard pour le moment.';
        this.toastService.loadError('le dashboard');
        this.isLoading = false;
      }
    });
  }

  getStatusClass(statut: ReclamationStatut): string {
    const classes: Record<ReclamationStatut, string> = {
      OUVERTE: 'bg-amber-100 text-amber-800',
      EN_COURS: 'bg-sky-100 text-sky-800',
      RESOLUE: 'bg-emerald-100 text-emerald-800',
      FERMEE: 'bg-slate-200 text-slate-700'
    };

    return classes[statut];
  }

  getPriorityClass(priorite: ReclamationPriorite): string {
    const classes: Record<ReclamationPriorite, string> = {
      BASSE: 'bg-slate-100 text-slate-700',
      MOYENNE: 'bg-indigo-100 text-indigo-800',
      HAUTE: 'bg-orange-100 text-orange-800',
      CRITIQUE: 'bg-rose-100 text-rose-800'
    };

    return classes[priorite];
  }

  private groupByStatus(reclamations: Reclamation[]): Array<{ key: ReclamationStatut; count: number }> {
    const keys: ReclamationStatut[] = ['OUVERTE', 'EN_COURS', 'RESOLUE', 'FERMEE'];
    return keys.map((key) => ({
      key,
      count: reclamations.filter((item) => item.statut === key).length
    }));
  }

  private groupByPriority(reclamations: Reclamation[]): Array<{ key: ReclamationPriorite; count: number }> {
    const keys: ReclamationPriorite[] = ['CRITIQUE', 'HAUTE', 'MOYENNE', 'BASSE'];
    return keys.map((key) => ({
      key,
      count: reclamations.filter((item) => item.priorite === key).length
    }));
  }
}
