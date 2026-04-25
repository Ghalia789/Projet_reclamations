import { DecimalPipe, NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { RapportSatisfaction, ReclamationPriorite, ReclamationService, ReclamationStatut } from '../../../core/services/reclamation.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-reclamation-report',
  standalone: true,
  imports: [NgIf, NgFor, DecimalPipe, FormsModule],
  template: `
    <section class="grid gap-5">
      <header class="rounded-3xl border border-slate-200 bg-gradient-to-r from-cyan-50 via-white to-lime-50 p-6">
        <p class="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-700">Reporting</p>
        <h2 class="mt-2 text-3xl font-bold text-slate-900">Rapport de satisfaction</h2>
        <p class="mt-2 max-w-2xl text-sm text-slate-600">
          Consultez les indicateurs de qualite et telechargez les rapports exploitables en CSV, JSON ou PDF.
        </p>
        <p class="mt-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Periode active: {{ periodLabel }}</p>
      </header>

      <article class="rounded-2xl border border-slate-200 bg-white p-4">
        <h3 class="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Filtres de periode</h3>
        <div class="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <label class="grid gap-1 text-sm text-slate-700">
            Date debut
            <input
              type="date"
              [(ngModel)]="fromDate"
              class="rounded-xl border border-slate-300 px-3 py-2 outline-none focus:border-cyan-600/50 focus:ring-2 focus:ring-cyan-600/20"
            >
          </label>

          <label class="grid gap-1 text-sm text-slate-700">
            Date fin
            <input
              type="date"
              [(ngModel)]="toDate"
              class="rounded-xl border border-slate-300 px-3 py-2 outline-none focus:border-cyan-600/50 focus:ring-2 focus:ring-cyan-600/20"
            >
          </label>

          <button
            type="button"
            (click)="applyFilters()"
            [disabled]="isLoading"
            class="self-end rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Appliquer
          </button>

          <button
            type="button"
            (click)="resetFilters()"
            [disabled]="isLoading"
            class="self-end rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Reinitialiser
          </button>
        </div>

        <div class="mt-4 flex flex-wrap gap-2">
          <button type="button" (click)="applyPreset('today')" class="rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1.5 text-xs font-semibold text-cyan-800 transition hover:bg-cyan-100">Aujourd'hui</button>
          <button type="button" (click)="applyPreset('7d')" class="rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1.5 text-xs font-semibold text-cyan-800 transition hover:bg-cyan-100">7 jours</button>
          <button type="button" (click)="applyPreset('30d')" class="rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1.5 text-xs font-semibold text-cyan-800 transition hover:bg-cyan-100">30 jours</button>
          <button type="button" (click)="applyPreset('month')" class="rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1.5 text-xs font-semibold text-cyan-800 transition hover:bg-cyan-100">Ce mois-ci</button>
        </div>
      </article>

      <div class="flex flex-wrap gap-3">
        <button
          type="button"
          (click)="download('csv')"
          [disabled]="isDownloading"
          class="rounded-xl bg-cyan-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-cyan-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {{ isDownloading ? 'Generation...' : 'Telecharger CSV' }}
        </button>

        <button
          type="button"
          (click)="download('json')"
          [disabled]="isDownloading"
          class="rounded-xl border border-cyan-700 bg-white px-4 py-2 text-sm font-semibold text-cyan-700 transition hover:bg-cyan-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Telecharger JSON
        </button>

        <button
          type="button"
          (click)="download('pdf')"
          [disabled]="isDownloading"
          class="rounded-xl border border-emerald-700 bg-emerald-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Telecharger PDF
        </button>
      </div>

      <p *ngIf="isLoading" class="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
        Chargement du rapport...
      </p>

      <p *ngIf="errorMessage" class="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
        {{ errorMessage }}
      </p>

      <div *ngIf="rapport && !isLoading && !errorMessage" class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <article class="rounded-2xl border border-slate-200 bg-white p-4">
          <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Total reclamations</p>
          <p class="mt-2 text-3xl font-bold text-slate-900">{{ rapport.totalReclamations }}</p>
        </article>

        <article class="rounded-2xl border border-indigo-200 bg-indigo-50/70 p-4">
          <p class="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-700">Reclamations notees</p>
          <p class="mt-2 text-3xl font-bold text-indigo-900">{{ rapport.reclamationsNotees }}</p>
        </article>

        <article class="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4">
          <p class="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">Note moyenne</p>
          <p class="mt-2 text-3xl font-bold text-emerald-900">{{ rapport.noteMoyenne | number:'1.1-2' }}</p>
        </article>

        <article class="rounded-2xl border border-amber-200 bg-amber-50/70 p-4">
          <p class="text-xs font-semibold uppercase tracking-[0.18em] text-amber-700">Ouvertes</p>
          <p class="mt-2 text-3xl font-bold text-amber-900">{{ rapport.openReclamations }}</p>
        </article>

        <article class="rounded-2xl border border-emerald-200 bg-white p-4">
          <p class="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">Résolues</p>
          <p class="mt-2 text-3xl font-bold text-emerald-900">{{ rapport.resolvedReclamations }}</p>
        </article>

        <article class="rounded-2xl border border-slate-200 bg-white p-4">
          <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Fermées</p>
          <p class="mt-2 text-3xl font-bold text-slate-900">{{ rapport.closedReclamations }}</p>
        </article>

        <article class="rounded-2xl border border-rose-200 bg-rose-50/70 p-4">
          <p class="text-xs font-semibold uppercase tracking-[0.18em] text-rose-700">Critiques ouvertes</p>
          <p class="mt-2 text-3xl font-bold text-rose-900">{{ rapport.criticalOpen }}</p>
        </article>

        <article class="rounded-2xl border border-red-200 bg-red-50/70 p-4">
          <p class="text-xs font-semibold uppercase tracking-[0.18em] text-red-700">Ouvertes hors SLA</p>
          <p class="mt-2 text-3xl font-bold text-red-900">{{ rapport.overdueOpen }}</p>
        </article>

        <article class="rounded-2xl border border-cyan-200 bg-cyan-50/70 p-4">
          <p class="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-700">Conformité SLA</p>
          <p class="mt-2 text-3xl font-bold text-cyan-900">{{ rapport.slaComplianceRate | number:'1.0-1' }}%</p>
        </article>

        <article class="rounded-2xl border border-violet-200 bg-violet-50/70 p-4">
          <p class="text-xs font-semibold uppercase tracking-[0.18em] text-violet-700">Tickets réouverts</p>
          <p class="mt-2 text-3xl font-bold text-violet-900">{{ rapport.reopenedTickets }}</p>
          <p class="mt-1 text-xs text-violet-800">Total réouvertures: {{ rapport.totalReopenCount }}</p>
        </article>

        <article class="rounded-2xl border border-sky-200 bg-sky-50/70 p-4">
          <p class="text-xs font-semibold uppercase tracking-[0.18em] text-sky-700">Effort total</p>
          <p class="mt-2 text-3xl font-bold text-sky-900">{{ rapport.totalTimeSpentMinutes }}</p>
          <p class="mt-1 text-xs text-sky-800">Moyenne / ticket: {{ rapport.avgEffortMinutesPerReclamation | number:'1.1-1' }} min</p>
        </article>
      </div>

      <div *ngIf="rapport && !isLoading && !errorMessage" class="grid gap-4 xl:grid-cols-3">
        <article class="rounded-2xl border border-slate-200 bg-white p-4">
          <h3 class="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Repartition par statut</h3>
          <ul class="mt-4 grid gap-2 sm:grid-cols-2">
            <li *ngFor="let item of repartitionEntries" class="flex items-center justify-between rounded-xl border border-slate-100 px-3 py-2">
              <span class="inline-flex rounded-full px-2.5 py-1 text-xs font-semibold" [class]="statusClass(item.statut)">{{ item.statut }}</span>
              <span class="text-sm font-semibold text-slate-800">{{ item.count }}</span>
            </li>
          </ul>
        </article>

        <article class="rounded-2xl border border-slate-200 bg-white p-4">
          <h3 class="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Repartition par priorite</h3>
          <ul class="mt-4 grid gap-2 sm:grid-cols-2">
            <li *ngFor="let item of priorityEntries" class="flex items-center justify-between rounded-xl border border-slate-100 px-3 py-2">
              <span class="inline-flex rounded-full px-2.5 py-1 text-xs font-semibold" [class]="priorityClass(item.priorite)">{{ item.priorite }}</span>
              <span class="text-sm font-semibold text-slate-800">{{ item.count }}</span>
            </li>
          </ul>
        </article>

        <article class="rounded-2xl border border-slate-200 bg-white p-4">
          <h3 class="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Repartition par cause</h3>
          <ul class="mt-4 grid gap-2">
            <li *ngFor="let item of causeEntries" class="flex items-center justify-between rounded-xl border border-slate-100 px-3 py-2">
              <span class="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">{{ item.cause }}</span>
              <span class="text-sm font-semibold text-slate-800">{{ item.count }}</span>
            </li>
          </ul>
        </article>
      </div>
    </section>
  `
})
export class ReclamationReportComponent implements OnInit {
  isLoading = true;
  isDownloading = false;
  errorMessage = '';
  fromDate = '';
  toDate = '';
  rapport: RapportSatisfaction | null = null;

  constructor(
    private readonly reclamationService: ReclamationService,
    private readonly toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.loadRapport();
  }

  applyFilters(): void {
    if (this.fromDate && this.toDate && this.fromDate > this.toDate) {
      this.toastService.error('Erreur', 'La date de debut doit etre inferieure ou egale a la date de fin.');
      return;
    }

    this.loadRapport();
  }

  resetFilters(): void {
    this.fromDate = '';
    this.toDate = '';
    this.loadRapport();
  }

  download(format: 'csv' | 'json' | 'pdf'): void {
    if (this.fromDate && this.toDate && this.fromDate > this.toDate) {
      this.toastService.error('Erreur', 'La date de debut doit etre inferieure ou egale a la date de fin.');
      return;
    }

    this.isDownloading = true;

    this.reclamationService.downloadRapport(format, this.fromDate || undefined, this.toDate || undefined).subscribe({
      next: (response: HttpResponse<Blob>) => {
        const blob = response.body;
        if (!blob || blob.size === 0) {
          this.toastService.error('Erreur', 'Le fichier genere est vide.');
          this.isDownloading = false;
          return;
        }

        const contentDisposition = response.headers.get('content-disposition') || '';
        const filenameFromHeader = this.extractFilename(contentDisposition);
        const timestamp = this.buildTimestamp();
        const filename = filenameFromHeader || `rapport-reclamations-${timestamp}.${format}`;

        const objectUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = objectUrl;
        link.download = filename;
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(objectUrl);

        this.toastService.success('Succes', 'Le rapport a ete telecharge.');
        this.isDownloading = false;
      },
      error: async (error: HttpErrorResponse) => {
        const message = await this.extractErrorMessage(error);
        this.toastService.error('Erreur', message);
        this.isDownloading = false;
      }
    });
  }

  get periodLabel(): string {
    const start = this.rapport?.dateDebut || '';
    const end = this.rapport?.dateFin || '';
    if (!start && !end) {
      return 'Toutes les dates';
    }
    return `${start || '...'} -> ${end || '...'}`;
  }

  get repartitionEntries(): Array<{ statut: ReclamationStatut; count: number }> {
    if (!this.rapport) {
      return [];
    }

    const statuts: ReclamationStatut[] = ['OUVERTE', 'EN_COURS', 'RESOLUE', 'FERMEE'];
    return statuts.map((statut) => ({
      statut,
      count: this.rapport?.repartitionParStatut?.[statut] ?? 0
    }));
  }

  get priorityEntries(): Array<{ priorite: ReclamationPriorite; count: number }> {
    if (!this.rapport) {
      return [];
    }

    const priorities: ReclamationPriorite[] = ['CRITIQUE', 'HAUTE', 'MOYENNE', 'BASSE'];
    return priorities.map((priorite) => ({
      priorite,
      count: this.rapport?.repartitionParPriorite?.[priorite] ?? 0
    }));
  }

  get causeEntries(): Array<{ cause: string; count: number }> {
    if (!this.rapport || !this.rapport.repartitionParCause) {
      return [];
    }

    return Object.entries(this.rapport.repartitionParCause).map(([cause, count]) => ({ cause, count }));
  }

  statusClass(statut: ReclamationStatut): string {
    const classes: Record<ReclamationStatut, string> = {
      OUVERTE: 'bg-amber-100 text-amber-800',
      EN_COURS: 'bg-sky-100 text-sky-800',
      RESOLUE: 'bg-emerald-100 text-emerald-800',
      FERMEE: 'bg-slate-200 text-slate-700'
    };

    return classes[statut];
  }

  priorityClass(priorite: ReclamationPriorite): string {
    const classes: Record<ReclamationPriorite, string> = {
      CRITIQUE: 'bg-rose-100 text-rose-800',
      HAUTE: 'bg-orange-100 text-orange-800',
      MOYENNE: 'bg-indigo-100 text-indigo-800',
      BASSE: 'bg-slate-100 text-slate-700'
    };

    return classes[priorite];
  }

  applyPreset(preset: 'today' | '7d' | '30d' | 'month'): void {
    const range = this.getPresetRange(preset);
    this.fromDate = range.fromDate;
    this.toDate = range.toDate;
    this.loadRapport();
  }

  private loadRapport(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.reclamationService.getRapport(this.fromDate || undefined, this.toDate || undefined).subscribe({
      next: (rapport) => {
        this.rapport = rapport;
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Impossible de charger le rapport pour le moment.';
        this.toastService.loadError('le rapport');
        this.isLoading = false;
      }
    });
  }

  private buildTimestamp(): string {
    const now = new Date();
    const pad = (value: number) => String(value).padStart(2, '0');
    return `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}-${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
  }

  private getPresetRange(preset: 'today' | '7d' | '30d' | 'month'): { fromDate: string; toDate: string } {
    const now = new Date();
    const today = this.formatDateInput(now);

    const start = new Date(now);
    switch (preset) {
      case 'today':
        return { fromDate: today, toDate: today };
      case '7d':
        start.setDate(now.getDate() - 6);
        return { fromDate: this.formatDateInput(start), toDate: today };
      case '30d':
        start.setDate(now.getDate() - 29);
        return { fromDate: this.formatDateInput(start), toDate: today };
      case 'month':
        start.setDate(1);
        return { fromDate: this.formatDateInput(start), toDate: today };
    }
  }

  private formatDateInput(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  private extractFilename(contentDisposition: string): string {
    if (!contentDisposition) {
      return '';
    }

    const filenameStarMatch = contentDisposition.match(/filename\*=UTF-8''([^;]+)/i);
    if (filenameStarMatch?.[1]) {
      return decodeURIComponent(filenameStarMatch[1]);
    }

    const filenameMatch = contentDisposition.match(/filename="?([^";]+)"?/i);
    return filenameMatch?.[1] || '';
  }

  private async extractErrorMessage(error: HttpErrorResponse): Promise<string> {
    if (error.error instanceof Blob) {
      try {
        const text = await error.error.text();
        if (!text) {
          return 'Impossible de telecharger le rapport pour le moment.';
        }

        try {
          const payload = JSON.parse(text) as { message?: string };
          return payload.message || 'Impossible de telecharger le rapport pour le moment.';
        } catch {
          return text;
        }
      } catch {
        return 'Impossible de telecharger le rapport pour le moment.';
      }
    }

    if (typeof error.error === 'string' && error.error.trim()) {
      return error.error;
    }

    return error.message || 'Impossible de telecharger le rapport pour le moment.';
  }
}
