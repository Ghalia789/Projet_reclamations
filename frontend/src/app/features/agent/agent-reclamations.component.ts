import { Component, OnInit } from '@angular/core';
import { DatePipe, NgClass, NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AgentMeService } from '../../core/services/agent-me.service';
import { Reclamation } from '../../core/services/reclamation.service';

@Component({
  selector: 'app-agent-reclamations',
  standalone: true,
  imports: [NgIf, NgFor, NgClass, DatePipe, RouterLink, FormsModule],
  template: `
    <section class="grid gap-5">
      <header class="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Espace agent</p>
          <h2 class="mt-1 text-2xl font-bold text-slate-900">Mes réclamations</h2>
        </div>
        <div class="flex items-center gap-2">
          <label class="text-sm font-medium text-slate-600">Statut</label>
          <select [(ngModel)]="statusFilter" class="rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand-600/50 focus:ring-2 focus:ring-brand-600/20">
            <option value="open">Non résolues</option>
            <option value="all">Toutes</option>
            <option value="resolved">Résolues</option>
          </select>
          <label class="text-sm font-medium text-slate-600">Priorité</label>
          <select [(ngModel)]="priorityFilter" class="rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand-600/50 focus:ring-2 focus:ring-brand-600/20">
            <option value="all">Toutes</option>
            <option value="CRITIQUE">Critique</option>
            <option value="HAUTE">Haute</option>
            <option value="MOYENNE">Moyenne</option>
            <option value="BASSE">Basse</option>
          </select>
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
              <th class="px-4 py-3 font-semibold">Ticket</th>
              <th class="px-4 py-3 font-semibold">Statut</th>
              <th class="px-4 py-3 font-semibold">Priorité</th>
              <th class="px-4 py-3 font-semibold">Date</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let item of filteredReclamations" class="border-t border-slate-100">
              <td class="px-4 py-3 font-semibold text-brand-700">
                <a [routerLink]="['/agent/reclamations', item.id]" class="hover:underline">{{ item.numeroTicket || ('#' + item.id) }}</a>
              </td>
              <td class="px-4 py-3">
                <span class="inline-flex rounded-full px-2.5 py-1 text-xs font-semibold" [ngClass]="getStatusClass(item.statut)">
                  {{ item.statut }}
                </span>
              </td>
              <td class="px-4 py-3">
                <span class="inline-flex rounded-full px-2.5 py-1 text-xs font-semibold" [ngClass]="getPriorityClass(item.priorite)">
                  {{ item.priorite }}
                </span>
              </td>
              <td class="px-4 py-3 text-slate-600">{{ item.dateCreation | date:'short' }}</td>
            </tr>
            <tr *ngIf="filteredReclamations.length === 0">
              <td colspan="4" class="px-4 py-5 text-center text-slate-500">Aucune réclamation assignée.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  `
})
export class AgentReclamationsComponent implements OnInit {
  reclamations: Reclamation[] = [];
  isLoading = true;
  errorMessage = '';
  statusFilter: 'open' | 'resolved' | 'all' = 'open';
  priorityFilter: 'all' | 'CRITIQUE' | 'HAUTE' | 'MOYENNE' | 'BASSE' = 'all';

  constructor(private readonly agentMeService: AgentMeService) {}

  ngOnInit(): void {
    this.agentMeService.getMyReclamations().subscribe({
      next: (reclamations) => {
        this.reclamations = reclamations;
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Impossible de charger vos réclamations.';
        this.isLoading = false;
      }
    });
  }

  get filteredReclamations(): Reclamation[] {
    let filtered = this.reclamations;
    if (this.statusFilter === 'resolved') {
      filtered = filtered.filter((item) => item.statut === 'RESOLUE' || item.statut === 'FERMEE');
    } else if (this.statusFilter === 'open') {
      filtered = filtered.filter((item) => item.statut === 'OUVERTE' || item.statut === 'EN_COURS');
    }

    if (this.priorityFilter !== 'all') {
      filtered = filtered.filter((item) => item.priorite === this.priorityFilter);
    }

    return filtered;
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
