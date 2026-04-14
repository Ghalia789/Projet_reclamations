import { Component, OnInit } from '@angular/core';
import { DatePipe, NgClass, NgFor, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Reclamation, ReclamationService } from '../../../core/services/reclamation.service';
import { ClientService } from '../../../core/services/client.service';
import { ProduitService } from '../../../core/services/produit.service';
import { AgentService } from '../../../core/services/agent.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-reclamation-list',
  standalone: true,
  imports: [NgIf, NgFor, NgClass, DatePipe, RouterLink, FormsModule],
  template: `
    <section class="grid gap-5">
      <header class="flex items-center justify-between gap-3">
        <div>
          <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Ticketing</p>
          <h2 class="mt-1 text-2xl font-bold text-slate-900">Réclamations</h2>
        </div>
        <div class="flex flex-wrap items-center justify-end gap-2">
          <input
            type="text"
            [(ngModel)]="searchTerm"
            placeholder="Rechercher dans la description"
            class="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-brand-600/50 focus:ring-2 focus:ring-brand-600/20"
          >

          <label class="text-sm font-medium text-slate-600" for="statut-filter">Statut</label>
          <select
            id="statut-filter"
            [(ngModel)]="selectedStatut"
            class="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-brand-600/50 focus:ring-2 focus:ring-brand-600/20"
          >
            <option value="TOUS">Tous</option>
            <option *ngFor="let statut of statusOptions" [value]="statut">{{ statut }}</option>
          </select>

          <label class="text-sm font-medium text-slate-600" for="sort-filter">Trier</label>
          <select
            id="sort-filter"
            [(ngModel)]="sortBy"
            class="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-brand-600/50 focus:ring-2 focus:ring-brand-600/20"
          >
            <option value="dateDesc">Date (récentes d'abord)</option>
            <option value="dateAsc">Date (anciennes d'abord)</option>
            <option value="statut">Statut</option>
          </select>

          <a routerLink="/reclamations/new" class="rounded-xl bg-brand-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-brand-700">Nouvelle réclamation</a>
        </div>
      </header>

      <p *ngIf="isLoading" class="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
        Chargement des réclamations...
      </p>

      <p *ngIf="errorMessage" class="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
        {{ errorMessage }}
      </p>

      <div *ngIf="!isLoading && !errorMessage" class="overflow-hidden rounded-2xl border border-slate-200">
        <table class="w-full border-collapse bg-white text-left text-sm">
          <thead class="bg-slate-50 text-slate-600">
            <tr>
              <th class="px-4 py-3 font-semibold">ID</th>
              <th class="px-4 py-3 font-semibold">Description</th>
              <th class="px-4 py-3 font-semibold">Statut</th>
              <th class="px-4 py-3 font-semibold">Client</th>
              <th class="px-4 py-3 font-semibold">Produit</th>
              <th class="px-4 py-3 font-semibold">Assignée à</th>
              <th class="px-4 py-3 font-semibold">Date</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let reclamation of filteredReclamations" class="border-t border-slate-100">
              <td class="px-4 py-3 text-slate-500">
                <a [routerLink]="['/reclamations', reclamation.id]" class="font-semibold text-brand-700 hover:underline">#{{ reclamation.id }}</a>
              </td>
              <td class="px-4 py-3 text-slate-800">
                <a [routerLink]="['/reclamations', reclamation.id]" class="hover:underline">{{ reclamation.description }}</a>
              </td>
              <td class="px-4 py-3 text-slate-700">
                <span class="inline-flex rounded-full px-2.5 py-1 text-xs font-semibold" [ngClass]="getStatutBadgeClass(reclamation.statut)">
                  {{ reclamation.statut }}
                </span>
              </td>
              <td class="px-4 py-3 text-slate-600">{{ getClientName(reclamation.clientId) }}</td>
              <td class="px-4 py-3 text-slate-600">{{ getProduitName(reclamation.produitId) }}</td>
              <td class="px-4 py-3 text-slate-600">{{ getAgentName(reclamation.agentAssigneId) }}</td>
              <td class="px-4 py-3 text-slate-600">{{ reclamation.dateCreation | date:'short' }}</td>
            </tr>
            <tr *ngIf="filteredReclamations.length === 0">
              <td colspan="7" class="px-4 py-5 text-center text-slate-500">Aucune réclamation disponible.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  `
})
export class ReclamationListComponent implements OnInit {
  reclamations: Reclamation[] = [];
  selectedStatut: 'TOUS' | 'OUVERTE' | 'EN_COURS' | 'RESOLUE' | 'FERMEE' = 'TOUS';
  sortBy: 'dateDesc' | 'dateAsc' | 'statut' = 'dateDesc';
  searchTerm = '';
  readonly statusOptions: Array<'OUVERTE' | 'EN_COURS' | 'RESOLUE' | 'FERMEE'> = [
    'OUVERTE',
    'EN_COURS',
    'RESOLUE',
    'FERMEE'
  ];

  private readonly clientNameMap = new Map<number, string>();
  private readonly produitNameMap = new Map<number, string>();
  private readonly agentNameMap = new Map<number, string>();

  isLoading = true;
  errorMessage = '';

  constructor(
    private readonly reclamationService: ReclamationService,
    private readonly clientService: ClientService,
    private readonly produitService: ProduitService,
    private readonly agentService: AgentService
  ) {}

  ngOnInit(): void {
    forkJoin({
      reclamations: this.reclamationService.getAll(),
      clients: this.clientService.getAll(),
      produits: this.produitService.getAll(),
      agents: this.agentService.getAll()
    }).subscribe({
      next: ({ reclamations, clients, produits, agents }) => {
        this.reclamations = reclamations;
        this.clientNameMap.clear();
        this.produitNameMap.clear();
        this.agentNameMap.clear();

        clients.forEach((client) => {
          this.clientNameMap.set(client.id, client.nom);
        });
        produits.forEach((produit) => {
          this.produitNameMap.set(produit.id, produit.nom);
        });
        agents.forEach((agent) => {
          this.agentNameMap.set(agent.id, agent.nom);
        });

        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Impossible de charger les réclamations pour le moment.';
        this.isLoading = false;
      }
    });
  }

  get filteredReclamations(): Reclamation[] {
    let list = this.reclamations;

    if (this.selectedStatut !== 'TOUS') {
      list = list.filter((reclamation) => reclamation.statut === this.selectedStatut);
    }

    const normalizedSearchTerm = this.searchTerm.trim().toLowerCase();
    if (normalizedSearchTerm) {
      list = list.filter((reclamation) => reclamation.description.toLowerCase().includes(normalizedSearchTerm));
    }

    const sorted = [...list];
    if (this.sortBy === 'dateAsc') {
      sorted.sort((a, b) => new Date(a.dateCreation).getTime() - new Date(b.dateCreation).getTime());
      return sorted;
    }

    if (this.sortBy === 'statut') {
      const statusOrder = {
        OUVERTE: 0,
        EN_COURS: 1,
        RESOLUE: 2,
        FERMEE: 3
      } as const;

      sorted.sort((a, b) => {
        const statusDelta = statusOrder[a.statut] - statusOrder[b.statut];
        if (statusDelta !== 0) {
          return statusDelta;
        }

        return new Date(b.dateCreation).getTime() - new Date(a.dateCreation).getTime();
      });
      return sorted;
    }

    sorted.sort((a, b) => new Date(b.dateCreation).getTime() - new Date(a.dateCreation).getTime());
    return sorted;
  }

  getClientName(clientId: number): string {
    return this.clientNameMap.get(clientId) ?? `Client #${clientId}`;
  }

  getProduitName(produitId: number): string {
    return this.produitNameMap.get(produitId) ?? `Produit #${produitId}`;
  }

  getAgentName(agentAssigneId: number | null): string {
    if (agentAssigneId == null) {
      return 'Non assignée';
    }

    return this.agentNameMap.get(agentAssigneId) ?? `Agent #${agentAssigneId}`;
  }

  getStatutBadgeClass(statut: Reclamation['statut']): string {
    const classesByStatus: Record<Reclamation['statut'], string> = {
      OUVERTE: 'bg-amber-100 text-amber-800',
      EN_COURS: 'bg-sky-100 text-sky-800',
      RESOLUE: 'bg-emerald-100 text-emerald-800',
      FERMEE: 'bg-slate-200 text-slate-700'
    };

    return classesByStatus[statut];
  }
}
