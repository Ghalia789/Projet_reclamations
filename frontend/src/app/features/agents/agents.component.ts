import { Component, OnInit } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Agent, AgentService } from '../../core/services/agent.service';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-agents',
  standalone: true,
  imports: [NgIf, NgFor, ReactiveFormsModule],
  template: `
    <section class="grid gap-5">
      <header>
        <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Support</p>
        <h2 class="mt-1 text-2xl font-bold text-slate-900">Agents SAV</h2>
      </header>

      <form [formGroup]="form" (ngSubmit)="submit()" class="grid gap-4 rounded-2xl border border-slate-200 bg-white p-4 md:grid-cols-5">
        <label class="grid gap-1 text-sm font-medium text-slate-700">
          Nom
          <input type="text" formControlName="nom" placeholder="Ex: Sara Benali" class="rounded-xl border border-slate-300 px-3 py-2 outline-none focus:border-brand-600/50 focus:ring-2 focus:ring-brand-600/20">
        </label>

        <label class="grid gap-1 text-sm font-medium text-slate-700">
          Compétence
          <input type="text" formControlName="competence" placeholder="Ex: Facturation" class="rounded-xl border border-slate-300 px-3 py-2 outline-none focus:border-brand-600/50 focus:ring-2 focus:ring-brand-600/20">
        </label>

        <label class="grid gap-1 text-sm font-medium text-slate-700">
          Niveau
          <select formControlName="niveau" class="rounded-xl border border-slate-300 px-3 py-2 outline-none focus:border-brand-600/50 focus:ring-2 focus:ring-brand-600/20">
            <option value="L1">L1</option>
            <option value="L2">L2</option>
            <option value="EXPERT">EXPERT</option>
          </select>
        </label>

        <label class="grid gap-1 text-sm font-medium text-slate-700">
          Équipe
          <input type="text" formControlName="equipe" placeholder="Ex: Team A" class="rounded-xl border border-slate-300 px-3 py-2 outline-none focus:border-brand-600/50 focus:ring-2 focus:ring-brand-600/20">
        </label>

        <label class="grid gap-1 text-sm font-medium text-slate-700">
          Actif
          <select formControlName="actif" class="rounded-xl border border-slate-300 px-3 py-2 outline-none focus:border-brand-600/50 focus:ring-2 focus:ring-brand-600/20">
            <option value="true">Oui</option>
            <option value="false">Non</option>
          </select>
        </label>

        <div class="flex items-end">
          <button type="submit" [disabled]="form.invalid || isSubmitting" class="w-full rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-70">
            {{ isSubmitting ? 'Ajout...' : 'Ajouter agent' }}
          </button>
        </div>
      </form>

      <p *ngIf="isLoading" class="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
        Chargement des agents...
      </p>

      <p *ngIf="errorMessage" class="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
        {{ errorMessage }}
      </p>

      <div *ngIf="!isLoading && !errorMessage" class="overflow-hidden rounded-2xl border border-slate-200">
        <table class="w-full border-collapse bg-white text-left text-sm">
          <thead class="bg-slate-50 text-slate-600">
            <tr>
              <th class="px-4 py-3 font-semibold">ID</th>
              <th class="px-4 py-3 font-semibold">Nom</th>
              <th class="px-4 py-3 font-semibold">Compétence</th>
              <th class="px-4 py-3 font-semibold">Niveau</th>
              <th class="px-4 py-3 font-semibold">Équipe</th>
              <th class="px-4 py-3 font-semibold">Actif</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let agent of agents" class="border-t border-slate-100">
              <td class="px-4 py-3 text-slate-500">{{ agent.id }}</td>
              <td class="px-4 py-3 font-medium text-slate-800">{{ agent.nom }}</td>
              <td class="px-4 py-3 text-slate-600">{{ agent.competence }}</td>
              <td class="px-4 py-3 text-slate-600">{{ agent.niveau }}</td>
              <td class="px-4 py-3 text-slate-600">{{ agent.equipe || '—' }}</td>
              <td class="px-4 py-3 text-slate-600">{{ agent.actif ? 'Oui' : 'Non' }}</td>
            </tr>
            <tr *ngIf="agents.length === 0">
              <td colspan="6" class="px-4 py-5 text-center text-slate-500">Aucun agent disponible.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  `
})
export class AgentsComponent implements OnInit {
  agents: Agent[] = [];
  isLoading = true;
  errorMessage = '';
  isSubmitting = false;

  form = this.formBuilder.nonNullable.group({
    nom: ['', [Validators.required]],
    competence: ['', [Validators.required]],
    niveau: ['L1' as 'L1' | 'L2' | 'EXPERT', [Validators.required]],
    equipe: [''],
    actif: ['true']
  });

  constructor(
    private readonly agentService: AgentService,
    private readonly formBuilder: FormBuilder,
    private readonly toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.loadAgents();
  }

  submit(): void {
    if (this.form.invalid || this.isSubmitting) {
      return;
    }

    const raw = this.form.getRawValue();

    this.isSubmitting = true;
    this.errorMessage = '';
    const loadingToastId = this.toastService.loading('Traitement', 'Ajout de l\'agent en cours...');

    this.agentService.create({
      nom: raw.nom,
      competence: raw.competence,
      niveau: raw.niveau,
      ...(raw.equipe ? { equipe: raw.equipe } : {}),
      actif: raw.actif === 'true'
    }).subscribe({
      next: () => {
        this.toastService.dismiss(loadingToastId);
        this.form.reset({ nom: '', competence: '', niveau: 'L1', equipe: '', actif: 'true' });
        this.isSubmitting = false;
        this.toastService.created('Agent');
        this.loadAgents();
      },
      error: () => {
        this.toastService.dismiss(loadingToastId);
        this.isSubmitting = false;
        this.errorMessage = 'Impossible d\'ajouter l\'agent pour le moment.';
        this.toastService.actionError('ajouter l\'agent');
      }
    });
  }

  private loadAgents(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.agentService.getAll().subscribe({
      next: (agents) => {
        this.agents = agents;
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Impossible de charger les agents pour le moment.';
        this.toastService.loadError('les agents');
        this.isLoading = false;
      }
    });
  }
}
