import { Component, OnInit } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { Client, ClientService } from '../../../core/services/client.service';
import { Produit, ProduitService } from '../../../core/services/produit.service';
import { Agent, AgentService } from '../../../core/services/agent.service';
import { ReclamationService } from '../../../core/services/reclamation.service';

@Component({
  selector: 'app-reclamation-create',
  standalone: true,
  imports: [NgIf, NgFor, ReactiveFormsModule, RouterLink],
  template: `
    <section class="grid gap-5">
      <header class="flex items-center justify-between gap-3">
        <div>
          <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Ticketing</p>
          <h2 class="mt-1 text-2xl font-bold text-slate-900">Créer une réclamation</h2>
        </div>
        <a routerLink="/reclamations" class="rounded-xl border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50">Retour liste</a>
      </header>

      <p *ngIf="isReferenceLoading" class="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
        Chargement des données de référence...
      </p>

      <p *ngIf="errorMessage" class="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
        {{ errorMessage }}
      </p>

      <form *ngIf="!isReferenceLoading" [formGroup]="form" (ngSubmit)="submit()" class="grid gap-4 rounded-2xl border border-slate-200 bg-white p-4 md:grid-cols-2">
        <label class="grid gap-1 text-sm font-medium text-slate-700 md:col-span-2">
          Description
          <textarea formControlName="description" rows="4" placeholder="Décrivez le problème rencontré..." class="rounded-xl border border-slate-300 px-3 py-2 outline-none focus:border-brand-600/50 focus:ring-2 focus:ring-brand-600/20"></textarea>
        </label>

        <label class="grid gap-1 text-sm font-medium text-slate-700">
          Client
          <select formControlName="clientId" class="rounded-xl border border-slate-300 px-3 py-2 outline-none focus:border-brand-600/50 focus:ring-2 focus:ring-brand-600/20">
            <option value="">Choisir un client</option>
            <option *ngFor="let client of clients" [value]="client.id">{{ client.nom }} ({{ client.email }})</option>
          </select>
        </label>

        <label class="grid gap-1 text-sm font-medium text-slate-700">
          Produit
          <select formControlName="produitId" class="rounded-xl border border-slate-300 px-3 py-2 outline-none focus:border-brand-600/50 focus:ring-2 focus:ring-brand-600/20">
            <option value="">Choisir un produit</option>
            <option *ngFor="let produit of produits" [value]="produit.id">{{ produit.nom }}</option>
          </select>
        </label>

        <label class="grid gap-1 text-sm font-medium text-slate-700">
          Agent assigné (optionnel)
          <select formControlName="agentAssigneId" class="rounded-xl border border-slate-300 px-3 py-2 outline-none focus:border-brand-600/50 focus:ring-2 focus:ring-brand-600/20">
            <option value="">Aucun agent</option>
            <option *ngFor="let agent of agents" [value]="agent.id">{{ agent.nom }} - {{ agent.competence }}</option>
          </select>
        </label>

        <label class="grid gap-1 text-sm font-medium text-slate-700">
          Note (optionnelle)
          <select formControlName="note" class="rounded-xl border border-slate-300 px-3 py-2 outline-none focus:border-brand-600/50 focus:ring-2 focus:ring-brand-600/20">
            <option value="">Pas de note</option>
            <option *ngFor="let n of notes" [value]="n">{{ n }}/5</option>
          </select>
        </label>

        <div class="md:col-span-2">
          <button type="submit" [disabled]="form.invalid || isSubmitting" class="rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-70">
            {{ isSubmitting ? 'Création...' : 'Créer réclamation' }}
          </button>
        </div>
      </form>
    </section>
  `
})
export class ReclamationCreateComponent implements OnInit {
  clients: Client[] = [];
  produits: Produit[] = [];
  agents: Agent[] = [];
  readonly notes = [1, 2, 3, 4, 5];

  isReferenceLoading = true;
  isSubmitting = false;
  errorMessage = '';

  form = this.formBuilder.nonNullable.group({
    description: ['', [Validators.required]],
    clientId: ['', [Validators.required]],
    produitId: ['', [Validators.required]],
    agentAssigneId: [''],
    note: ['']
  });

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly clientService: ClientService,
    private readonly produitService: ProduitService,
    private readonly agentService: AgentService,
    private readonly reclamationService: ReclamationService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    forkJoin({
      clients: this.clientService.getAll(),
      produits: this.produitService.getAll(),
      agents: this.agentService.getAll()
    }).subscribe({
      next: ({ clients, produits, agents }) => {
        this.clients = clients;
        this.produits = produits;
        this.agents = agents;
        this.isReferenceLoading = false;
      },
      error: () => {
        this.errorMessage = 'Impossible de charger les données nécessaires à la création.';
        this.isReferenceLoading = false;
      }
    });
  }

  submit(): void {
    if (this.form.invalid || this.isSubmitting) {
      return;
    }

    const raw = this.form.getRawValue();
    this.isSubmitting = true;
    this.errorMessage = '';

    this.reclamationService.create({
      description: raw.description,
      clientId: Number(raw.clientId),
      produitId: Number(raw.produitId),
      ...(raw.agentAssigneId ? { agentAssigneId: Number(raw.agentAssigneId) } : {}),
      ...(raw.note ? { note: Number(raw.note) } : {})
    }).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.router.navigate(['/reclamations']);
      },
      error: () => {
        this.isSubmitting = false;
        this.errorMessage = 'Impossible de créer la réclamation pour le moment.';
      }
    });
  }
}
