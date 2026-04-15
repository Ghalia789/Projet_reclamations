import { Component, OnInit } from '@angular/core';
import { DatePipe, NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { AgentService } from '../../../core/services/agent.service';
import { ClientService } from '../../../core/services/client.service';
import { ProduitService } from '../../../core/services/produit.service';
import {
  Reclamation,
  ReclamationService,
  ReclamationStatut,
  SuiviReclamation
} from '../../../core/services/reclamation.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-reclamation-detail',
  standalone: true,
  imports: [NgIf, NgFor, DatePipe, FormsModule, RouterLink],
  template: `
    <section class="grid gap-5">
      <header class="flex items-center justify-between">
        <div>
          <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Ticketing</p>
          <h2 class="mt-1 text-2xl font-bold text-slate-900">Détail réclamation</h2>
        </div>
        <a routerLink="/reclamations" class="rounded-xl border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50">Retour liste</a>
      </header>

      <p *ngIf="isLoading" class="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
        Chargement de la réclamation...
      </p>

      <p *ngIf="errorMessage" class="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
        {{ errorMessage }}
      </p>

      <article *ngIf="!isLoading && reclamation" class="grid gap-4 rounded-2xl border border-slate-200 bg-white p-4">
        <div class="grid gap-3 md:grid-cols-2">
          <p class="text-sm text-slate-600"><span class="font-semibold text-slate-800">ID:</span> {{ reclamation.id }}</p>
          <p class="text-sm text-slate-600"><span class="font-semibold text-slate-800">Date:</span> {{ reclamation.dateCreation | date:'short' }}</p>
          <p class="text-sm text-slate-600"><span class="font-semibold text-slate-800">Client:</span> {{ getClientName(reclamation.clientId) }}</p>
          <p class="text-sm text-slate-600"><span class="font-semibold text-slate-800">Produit:</span> {{ getProduitName(reclamation.produitId) }}</p>
          <p class="text-sm text-slate-600"><span class="font-semibold text-slate-800">Assignée à:</span> {{ getAgentName(reclamation.agentAssigneId) }}</p>
          <p class="text-sm text-slate-600"><span class="font-semibold text-slate-800">Statut:</span> {{ reclamation.statut }}</p>
          <p class="text-sm text-slate-600 md:col-span-2"><span class="font-semibold text-slate-800">Description:</span> {{ reclamation.description }}</p>
        </div>

        <div class="grid gap-4 border-t border-slate-100 pt-4 md:grid-cols-2">
          <section class="grid gap-2">
            <h3 class="text-sm font-semibold text-slate-800">Assigner un agent</h3>
            <div class="flex gap-2">
              <select [(ngModel)]="selectedAgentId" class="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand-600/50 focus:ring-2 focus:ring-brand-600/20">
                <option value="">Choisir un agent</option>
                <option *ngFor="let agent of agents" [value]="agent.id">{{ agent.nom }} - {{ agent.competence }}</option>
              </select>
              <button type="button" [disabled]="!selectedAgentId || isAssigning" (click)="assignAgent()" class="rounded-xl bg-brand-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-70">
                {{ isAssigning ? '...' : 'Assigner' }}
              </button>
            </div>
          </section>

          <section class="grid gap-2">
            <h3 class="text-sm font-semibold text-slate-800">Mettre à jour le statut</h3>
            <select [(ngModel)]="selectedStatut" class="rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand-600/50 focus:ring-2 focus:ring-brand-600/20">
              <option *ngFor="let statut of statusOptions" [value]="statut">{{ statut }}</option>
            </select>
            <input [(ngModel)]="statusMessage" type="text" placeholder="Message de suivi (optionnel)" class="rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand-600/50 focus:ring-2 focus:ring-brand-600/20">
            <button type="button" [disabled]="isUpdatingStatut" (click)="updateStatut()" class="w-fit rounded-xl bg-slate-800 px-3 py-2 text-sm font-semibold text-white transition hover:bg-slate-900 disabled:cursor-not-allowed disabled:opacity-70">
              {{ isUpdatingStatut ? '...' : 'Mettre à jour' }}
            </button>
          </section>
        </div>
      </article>

      <section *ngIf="!isLoading && reclamation" class="grid gap-3 rounded-2xl border border-slate-200 bg-white p-4">
        <h3 class="text-base font-semibold text-slate-900">Historique de suivi</h3>

        <div *ngIf="suivis.length === 0" class="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
          Aucun suivi disponible.
        </div>

        <ul *ngIf="suivis.length > 0" class="grid gap-2">
          <li *ngFor="let suivi of suivis" class="rounded-xl border border-slate-200 px-3 py-2">
            <p class="text-sm font-semibold text-slate-800">{{ suivi.action }} - {{ suivi.dateAction | date:'short' }}</p>
            <p class="text-sm text-slate-600">{{ suivi.message }}</p>
            <p class="text-xs text-slate-500">Auteur: {{ getAgentName(suivi.agentAuteurId) }}</p>
          </li>
        </ul>
      </section>
    </section>
  `
})
export class ReclamationDetailComponent implements OnInit {
  reclamation: Reclamation | null = null;
  suivis: SuiviReclamation[] = [];
  agents: { id: number; nom: string; competence: string }[] = [];

  isLoading = true;
  isAssigning = false;
  isUpdatingStatut = false;
  errorMessage = '';

  selectedAgentId = '';
  selectedStatut: ReclamationStatut = 'OUVERTE';
  statusMessage = '';

  readonly statusOptions: ReclamationStatut[] = ['OUVERTE', 'EN_COURS', 'RESOLUE', 'FERMEE'];
  private reclamationId: number | null = null;

  private readonly clientNameMap = new Map<number, string>();
  private readonly produitNameMap = new Map<number, string>();
  private readonly agentNameMap = new Map<number, string>();

  constructor(
    private readonly route: ActivatedRoute,
    private readonly reclamationService: ReclamationService,
    private readonly agentService: AgentService,
    private readonly clientService: ClientService,
    private readonly produitService: ProduitService,
    private readonly toastService: ToastService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!Number.isFinite(id)) {
      this.errorMessage = 'Identifiant de réclamation invalide.';
      this.isLoading = false;
      return;
    }

    this.reclamationId = id;
    this.loadDetail(id);
  }

  assignAgent(): void {
    if (!this.reclamationId || !this.selectedAgentId || this.isAssigning) {
      return;
    }

    this.isAssigning = true;
    const loadingToastId = this.toastService.loading('Traitement', 'Assignation en cours...');
    this.reclamationService.assignAgent(this.reclamationId, { agentId: Number(this.selectedAgentId) }).subscribe({
      next: () => {
        this.toastService.dismiss(loadingToastId);
        this.isAssigning = false;
        this.toastService.updated('Assignation');
        this.loadDetail(this.reclamationId as number);
      },
      error: () => {
        this.toastService.dismiss(loadingToastId);
        this.isAssigning = false;
        this.errorMessage = 'Impossible d\'assigner l\'agent pour le moment.';
        this.toastService.actionError('assigner l\'agent');
      }
    });
  }

  updateStatut(): void {
    if (!this.reclamationId || this.isUpdatingStatut) {
      return;
    }

    this.isUpdatingStatut = true;
    const loadingToastId = this.toastService.loading('Traitement', 'Mise a jour du statut en cours...');
    this.reclamationService.updateStatut(this.reclamationId, {
      statut: this.selectedStatut,
      ...(this.statusMessage.trim() ? { message: this.statusMessage.trim() } : {})
    }).subscribe({
      next: () => {
        this.toastService.dismiss(loadingToastId);
        this.isUpdatingStatut = false;
        this.statusMessage = '';
        this.toastService.updated('Statut');
        this.loadDetail(this.reclamationId as number);
      },
      error: () => {
        this.toastService.dismiss(loadingToastId);
        this.isUpdatingStatut = false;
        this.errorMessage = 'Impossible de mettre à jour le statut pour le moment.';
        this.toastService.actionError('mettre a jour le statut');
      }
    });
  }

  getClientName(clientId: number): string {
    return this.clientNameMap.get(clientId) ?? `Client #${clientId}`;
  }

  getProduitName(produitId: number): string {
    return this.produitNameMap.get(produitId) ?? `Produit #${produitId}`;
  }

  getAgentName(agentId: number | null): string {
    if (agentId == null) {
      return 'Non assigné';
    }

    return this.agentNameMap.get(agentId) ?? `Agent #${agentId}`;
  }

  private loadDetail(id: number): void {
    this.isLoading = true;
    this.errorMessage = '';

    forkJoin({
      reclamation: this.reclamationService.getById(id),
      suivis: this.reclamationService.getSuiviByReclamation(id),
      agents: this.agentService.getAll(),
      clients: this.clientService.getAll(),
      produits: this.produitService.getAll()
    }).subscribe({
      next: ({ reclamation, suivis, agents, clients, produits }) => {
        this.reclamation = reclamation;
        this.agents = agents;
        this.suivis = suivis.sort((a, b) => new Date(b.dateAction).getTime() - new Date(a.dateAction).getTime());
        this.selectedStatut = reclamation.statut;
        this.selectedAgentId = reclamation.agentAssigneId != null ? String(reclamation.agentAssigneId) : '';

        this.clientNameMap.clear();
        this.produitNameMap.clear();
        this.agentNameMap.clear();

        clients.forEach((client) => this.clientNameMap.set(client.id, client.nom));
        produits.forEach((produit) => this.produitNameMap.set(produit.id, produit.nom));
        agents.forEach((agent) => this.agentNameMap.set(agent.id, agent.nom));

        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Impossible de charger le détail de la réclamation.';
        this.isLoading = false;
      }
    });
  }
}
