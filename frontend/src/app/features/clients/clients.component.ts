import { Component, OnInit } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Client, ClientService } from '../../core/services/client.service';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [NgIf, NgFor, ReactiveFormsModule],
  template: `
    <section class="grid gap-5">
      <header>
        <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Référentiel</p>
        <h2 class="mt-1 text-2xl font-bold text-slate-900">Clients</h2>
      </header>

      <form [formGroup]="form" (ngSubmit)="submit()" class="grid gap-4 rounded-2xl border border-slate-200 bg-white p-4 md:grid-cols-6">
        <label class="grid gap-1 text-sm font-medium text-slate-700">
          Nom
          <input type="text" formControlName="nom" placeholder="Ex: Jean Dupont" class="rounded-xl border border-slate-300 px-3 py-2 outline-none focus:border-brand-600/50 focus:ring-2 focus:ring-brand-600/20">
        </label>

        <label class="grid gap-1 text-sm font-medium text-slate-700">
          Email
          <input type="email" formControlName="email" placeholder="Ex: jean@email.com" class="rounded-xl border border-slate-300 px-3 py-2 outline-none focus:border-brand-600/50 focus:ring-2 focus:ring-brand-600/20">
        </label>

        <label class="grid gap-1 text-sm font-medium text-slate-700">
          Téléphone
          <input type="text" formControlName="telephone" placeholder="Ex: 0612345678" class="rounded-xl border border-slate-300 px-3 py-2 outline-none focus:border-brand-600/50 focus:ring-2 focus:ring-brand-600/20">
        </label>

        <label class="grid gap-1 text-sm font-medium text-slate-700">
          Type
          <select formControlName="typeClient" class="rounded-xl border border-slate-300 px-3 py-2 outline-none focus:border-brand-600/50 focus:ring-2 focus:ring-brand-600/20">
            <option value="PARTICULIER">PARTICULIER</option>
            <option value="ENTREPRISE">ENTREPRISE</option>
          </select>
        </label>

        <label class="grid gap-1 text-sm font-medium text-slate-700">
          Ville
          <input type="text" formControlName="ville" placeholder="Ex: Casablanca" class="rounded-xl border border-slate-300 px-3 py-2 outline-none focus:border-brand-600/50 focus:ring-2 focus:ring-brand-600/20">
        </label>

        <div class="flex items-end">
          <button type="submit" [disabled]="form.invalid || isSubmitting" class="w-full rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-70">
            {{ isSubmitting ? 'Ajout...' : 'Ajouter client' }}
          </button>
        </div>
      </form>

      <p *ngIf="isLoading" class="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
        Chargement des clients...
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
              <th class="px-4 py-3 font-semibold">Email</th>
              <th class="px-4 py-3 font-semibold">Téléphone</th>
              <th class="px-4 py-3 font-semibold">Type</th>
              <th class="px-4 py-3 font-semibold">Ville</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let client of clients" class="border-t border-slate-100">
              <td class="px-4 py-3 text-slate-500">{{ client.id }}</td>
              <td class="px-4 py-3 font-medium text-slate-800">{{ client.nom }}</td>
              <td class="px-4 py-3 text-slate-600">{{ client.email }}</td>
              <td class="px-4 py-3 text-slate-600">{{ client.telephone }}</td>
              <td class="px-4 py-3 text-slate-600">{{ client.typeClient }}</td>
              <td class="px-4 py-3 text-slate-600">{{ client.ville || '—' }}</td>
            </tr>
            <tr *ngIf="clients.length === 0">
              <td colspan="6" class="px-4 py-5 text-center text-slate-500">Aucun client disponible.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  `
})
export class ClientsComponent implements OnInit {
  clients: Client[] = [];
  isLoading = true;
  errorMessage = '';
  isSubmitting = false;

  form = this.formBuilder.nonNullable.group({
    nom: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    telephone: ['', [Validators.required]],
    typeClient: ['PARTICULIER' as 'PARTICULIER' | 'ENTREPRISE', [Validators.required]],
    ville: ['']
  });

  constructor(
    private readonly clientService: ClientService,
    private readonly formBuilder: FormBuilder,
    private readonly toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.loadClients();
  }

  submit(): void {
    if (this.form.invalid || this.isSubmitting) {
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';
    const loadingToastId = this.toastService.loading('Traitement', 'Ajout du client en cours...');

    this.clientService.create(this.form.getRawValue()).subscribe({
      next: () => {
        this.toastService.dismiss(loadingToastId);
        this.form.reset({ nom: '', email: '', telephone: '' });
        this.isSubmitting = false;
        this.toastService.created('Client');
        this.loadClients();
      },
      error: () => {
        this.toastService.dismiss(loadingToastId);
        this.isSubmitting = false;
        this.errorMessage = 'Impossible d\'ajouter le client pour le moment.';
        this.toastService.actionError('ajouter le client');
      }
    });
  }

  private loadClients(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.clientService.getAll().subscribe({
      next: (clients) => {
        this.clients = clients;
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Impossible de charger les clients pour le moment.';
        this.toastService.loadError('les clients');
        this.isLoading = false;
      }
    });
  }
}
