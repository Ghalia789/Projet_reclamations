import { Component, OnInit } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AdminAccountResponse, AdminAccountService } from '../../core/services/admin-account.service';
import { Agent, AgentService } from '../../core/services/agent.service';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-admin-accounts',
  standalone: true,
  imports: [NgIf, NgFor, ReactiveFormsModule],
  template: `
    <section class="grid gap-5">
      <header>
        <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Administration</p>
        <h2 class="mt-1 text-2xl font-bold text-slate-900">Comptes agents</h2>
      </header>

      <div class="flex flex-wrap gap-2">
        <button type="button" (click)="toggleCreate()" class="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
          {{ showCreate ? 'Masquer création' : 'Créer un compte' }}
        </button>
        <button type="button" (click)="toggleUpdate()" class="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
          {{ showUpdate ? 'Masquer mise à jour' : 'Mettre à jour un compte' }}
        </button>
        <button type="button" (click)="toggleReset()" class="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
          {{ showReset ? 'Masquer reset' : 'Réinitialiser mot de passe' }}
        </button>
      </div>

      <form *ngIf="showCreate" [formGroup]="createForm" (ngSubmit)="createAccount()" class="grid gap-4 rounded-2xl border border-slate-200 bg-white p-4 lg:grid-cols-6">
        <label class="grid gap-1 text-sm font-medium text-slate-700">
          Email
          <input type="email" formControlName="email" placeholder="agent@company.tn" class="rounded-xl border border-slate-300 px-3 py-2 outline-none focus:border-brand-600/50 focus:ring-2 focus:ring-brand-600/20">
        </label>

        <label class="grid gap-1 text-sm font-medium text-slate-700">
          Mot de passe
          <input type="password" formControlName="password" placeholder="Mot de passe" class="rounded-xl border border-slate-300 px-3 py-2 outline-none focus:border-brand-600/50 focus:ring-2 focus:ring-brand-600/20">
        </label>

        <label class="grid gap-1 text-sm font-medium text-slate-700">
          Rôle
          <select formControlName="role" class="rounded-xl border border-slate-300 px-3 py-2 outline-none focus:border-brand-600/50 focus:ring-2 focus:ring-brand-600/20">
            <option value="AGENT">AGENT</option>
            <option value="ADMIN">ADMIN</option>
          </select>
        </label>

        <label class="grid gap-1 text-sm font-medium text-slate-700">
          Agent lié
          <select formControlName="agentId" class="rounded-xl border border-slate-300 px-3 py-2 outline-none focus:border-brand-600/50 focus:ring-2 focus:ring-brand-600/20">
            <option value="">Aucun</option>
            <option *ngFor="let agent of agents" [value]="agent.id">{{ agent.nom }}</option>
          </select>
        </label>

        <label class="grid gap-1 text-sm font-medium text-slate-700">
          Activé
          <select formControlName="enabled" class="rounded-xl border border-slate-300 px-3 py-2 outline-none focus:border-brand-600/50 focus:ring-2 focus:ring-brand-600/20">
            <option value="true">Oui</option>
            <option value="false">Non</option>
          </select>
        </label>

        <div class="flex items-end">
          <button type="submit" [disabled]="createForm.invalid || isSubmitting" class="w-full rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-70">
            {{ isSubmitting ? 'Création...' : 'Créer compte' }}
          </button>
        </div>
      </form>

      <form *ngIf="showUpdate" [formGroup]="updateForm" (ngSubmit)="updateAccount()" class="grid gap-4 rounded-2xl border border-slate-200 bg-white p-4 lg:grid-cols-6">
        <label class="grid gap-1 text-sm font-medium text-slate-700">
          ID Compte
          <input type="number" min="1" formControlName="accountId" placeholder="ID compte" class="rounded-xl border border-slate-300 px-3 py-2 outline-none focus:border-brand-600/50 focus:ring-2 focus:ring-brand-600/20">
        </label>

        <label class="grid gap-1 text-sm font-medium text-slate-700">
          Email
          <input type="email" formControlName="email" placeholder="email@company.tn" class="rounded-xl border border-slate-300 px-3 py-2 outline-none focus:border-brand-600/50 focus:ring-2 focus:ring-brand-600/20">
        </label>

        <label class="grid gap-1 text-sm font-medium text-slate-700">
          Rôle
          <select formControlName="role" class="rounded-xl border border-slate-300 px-3 py-2 outline-none focus:border-brand-600/50 focus:ring-2 focus:ring-brand-600/20">
            <option value="">Inchangé</option>
            <option value="AGENT">AGENT</option>
            <option value="ADMIN">ADMIN</option>
          </select>
        </label>

        <label class="grid gap-1 text-sm font-medium text-slate-700">
          Agent lié
          <select formControlName="agentId" class="rounded-xl border border-slate-300 px-3 py-2 outline-none focus:border-brand-600/50 focus:ring-2 focus:ring-brand-600/20">
            <option value="">Inchangé</option>
            <option value="null">Aucun</option>
            <option *ngFor="let agent of agents" [value]="agent.id">{{ agent.nom }}</option>
          </select>
        </label>

        <label class="grid gap-1 text-sm font-medium text-slate-700">
          Activé
          <select formControlName="enabled" class="rounded-xl border border-slate-300 px-3 py-2 outline-none focus:border-brand-600/50 focus:ring-2 focus:ring-brand-600/20">
            <option value="">Inchangé</option>
            <option value="true">Oui</option>
            <option value="false">Non</option>
          </select>
        </label>

        <div class="flex items-end">
          <button type="submit" [disabled]="updateForm.invalid || isUpdating" class="w-full rounded-xl bg-slate-800 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-900 disabled:cursor-not-allowed disabled:opacity-70">
            {{ isUpdating ? 'Mise à jour...' : 'Mettre à jour' }}
          </button>
        </div>
      </form>

      <form *ngIf="showReset" [formGroup]="resetForm" (ngSubmit)="resetPassword()" class="grid gap-4 rounded-2xl border border-slate-200 bg-white p-4 md:grid-cols-3">
        <label class="grid gap-1 text-sm font-medium text-slate-700">
          ID Compte
          <input type="number" min="1" formControlName="accountId" placeholder="ID compte" class="rounded-xl border border-slate-300 px-3 py-2 outline-none focus:border-brand-600/50 focus:ring-2 focus:ring-brand-600/20">
        </label>

        <label class="grid gap-1 text-sm font-medium text-slate-700">
          Nouveau mot de passe
          <input type="password" formControlName="newPassword" placeholder="Nouveau mot de passe" class="rounded-xl border border-slate-300 px-3 py-2 outline-none focus:border-brand-600/50 focus:ring-2 focus:ring-brand-600/20">
        </label>

        <div class="flex items-end">
          <button type="submit" [disabled]="resetForm.invalid || isResetting" class="w-full rounded-xl bg-slate-800 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-900 disabled:cursor-not-allowed disabled:opacity-70">
            {{ isResetting ? '...' : 'Réinitialiser' }}
          </button>
        </div>
      </form>

      <p *ngIf="isLoading" class="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
        Chargement des comptes...
      </p>

      <p *ngIf="errorMessage" class="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
        {{ errorMessage }}
      </p>

      <div *ngIf="!isLoading && !errorMessage" class="overflow-hidden rounded-2xl border border-slate-200">
        <table class="w-full border-collapse bg-white text-left text-sm">
          <thead class="bg-slate-50 text-slate-600">
            <tr>
              <th class="px-4 py-3 font-semibold">ID</th>
              <th class="px-4 py-3 font-semibold">Email</th>
              <th class="px-4 py-3 font-semibold">Rôle</th>
              <th class="px-4 py-3 font-semibold">Actif</th>
              <th class="px-4 py-3 font-semibold">Agent lié</th>
              <th class="px-4 py-3 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let account of accounts" class="border-t border-slate-100">
              <td class="px-4 py-3 text-slate-500">{{ account.id }}</td>
              <td class="px-4 py-3 font-medium text-slate-800">{{ account.email }}</td>
              <td class="px-4 py-3 text-slate-600">{{ account.role }}</td>
              <td class="px-4 py-3 text-slate-600">{{ account.enabled ? 'Oui' : 'Non' }}</td>
              <td class="px-4 py-3 text-slate-600">{{ account.agentId ?? '—' }}</td>
              <td class="px-4 py-3">
                <div class="flex flex-wrap gap-2">
                  <button type="button" (click)="prefillUpdate(account)" class="rounded-lg border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-700 transition hover:bg-slate-50">
                    Modifier
                  </button>
                  <button type="button" (click)="toggleEnabled(account)" class="rounded-lg border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-700 transition hover:bg-slate-50">
                    {{ account.enabled ? 'Désactiver' : 'Activer' }}
                  </button>
                </div>
              </td>
            </tr>
            <tr *ngIf="accounts.length === 0">
              <td colspan="6" class="px-4 py-5 text-center text-slate-500">Aucun compte disponible.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  `
})
export class AdminAccountsComponent implements OnInit {
  accounts: AdminAccountResponse[] = [];
  agents: Agent[] = [];
  isLoading = true;
  isSubmitting = false;
  isResetting = false;
  isUpdating = false;
  errorMessage = '';
  showCreate = false;
  showUpdate = false;
  showReset = false;

  createForm = this.formBuilder.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
    role: ['AGENT' as 'AGENT' | 'ADMIN', [Validators.required]],
    agentId: [''],
    enabled: ['true']
  });

  resetForm = this.formBuilder.nonNullable.group({
    accountId: ['', [Validators.required]],
    newPassword: ['', [Validators.required]]
  });

  updateForm = this.formBuilder.nonNullable.group({
    accountId: ['', [Validators.required]],
    email: [''],
    role: [''],
    agentId: [''],
    enabled: ['']
  });

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly accountService: AdminAccountService,
    private readonly agentService: AgentService,
    private readonly toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  toggleCreate(): void {
    this.showCreate = !this.showCreate;
  }

  toggleUpdate(): void {
    this.showUpdate = !this.showUpdate;
  }

  toggleReset(): void {
    this.showReset = !this.showReset;
  }

  createAccount(): void {
    if (this.createForm.invalid || this.isSubmitting) {
      return;
    }

    const raw = this.createForm.getRawValue();
    this.isSubmitting = true;
    const loadingToastId = this.toastService.loading('Traitement', 'Création du compte...');

    this.accountService.create({
      email: raw.email,
      password: raw.password,
      role: raw.role,
      agentId: raw.agentId ? Number(raw.agentId) : null,
      enabled: raw.enabled === 'true'
    }).subscribe({
      next: () => {
        this.toastService.dismiss(loadingToastId);
        this.isSubmitting = false;
        this.toastService.created('Compte');
        this.createForm.reset({ email: '', password: '', role: 'AGENT', agentId: '', enabled: 'true' });
        this.loadAccounts();
      },
      error: () => {
        this.toastService.dismiss(loadingToastId);
        this.isSubmitting = false;
        this.errorMessage = 'Impossible de créer le compte pour le moment.';
        this.toastService.actionError('créer le compte');
      }
    });
  }

  resetPassword(): void {
    if (this.resetForm.invalid || this.isResetting) {
      return;
    }

    const raw = this.resetForm.getRawValue();
    this.isResetting = true;
    const loadingToastId = this.toastService.loading('Traitement', 'Réinitialisation du mot de passe...');

    this.accountService.resetPassword(Number(raw.accountId), { newPassword: raw.newPassword }).subscribe({
      next: () => {
        this.toastService.dismiss(loadingToastId);
        this.isResetting = false;
        this.toastService.updated('Mot de passe');
        this.resetForm.reset({ accountId: '', newPassword: '' });
      },
      error: () => {
        this.toastService.dismiss(loadingToastId);
        this.isResetting = false;
        this.errorMessage = 'Impossible de réinitialiser le mot de passe.';
        this.toastService.actionError('réinitialiser le mot de passe');
      }
    });
  }

  updateAccount(): void {
    if (this.updateForm.invalid || this.isUpdating) {
      return;
    }

    const raw = this.updateForm.getRawValue();
    this.isUpdating = true;
    const loadingToastId = this.toastService.loading('Traitement', 'Mise à jour du compte...');

    const payload: {
      email?: string;
      role?: 'ADMIN' | 'AGENT';
      enabled?: boolean;
      agentId?: number | null;
      unlinkAgent?: boolean;
    } = {};

    if (raw.email.trim()) {
      payload.email = raw.email.trim();
    }
    if (raw.role === 'ADMIN' || raw.role === 'AGENT') {
      payload.role = raw.role as 'ADMIN' | 'AGENT';
    }
    if (raw.enabled === 'true' || raw.enabled === 'false') {
      payload.enabled = raw.enabled === 'true';
    }
    if (raw.agentId === 'null') {
      payload.unlinkAgent = true;
    } else if (raw.agentId) {
      payload.agentId = Number(raw.agentId);
    }

    this.accountService.update(Number(raw.accountId), payload).subscribe({
      next: () => {
        this.toastService.dismiss(loadingToastId);
        this.isUpdating = false;
        this.toastService.updated('Compte');
        this.updateForm.reset({ accountId: '', email: '', role: '', agentId: '', enabled: '' });
        this.loadAccounts();
      },
      error: () => {
        this.toastService.dismiss(loadingToastId);
        this.isUpdating = false;
        this.errorMessage = 'Impossible de mettre à jour le compte.';
        this.toastService.actionError('mettre à jour le compte');
      }
    });
  }

  prefillUpdate(account: AdminAccountResponse): void {
    this.updateForm.reset({
      accountId: String(account.id),
      email: account.email,
      role: account.role,
      agentId: account.agentId != null ? String(account.agentId) : 'null',
      enabled: account.enabled ? 'true' : 'false'
    });
    this.showUpdate = true;
  }

  toggleEnabled(account: AdminAccountResponse): void {
    const loadingToastId = this.toastService.loading('Traitement', 'Mise à jour du compte...');

    this.accountService.update(account.id, { enabled: !account.enabled }).subscribe({
      next: () => {
        this.toastService.dismiss(loadingToastId);
        this.toastService.updated('Compte');
        this.loadAccounts();
      },
      error: () => {
        this.toastService.dismiss(loadingToastId);
        this.errorMessage = 'Impossible de mettre à jour le compte.';
        this.toastService.actionError('mettre à jour le compte');
      }
    });
  }

  private loadData(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.agentService.getAll().subscribe({
      next: (agents) => {
        this.agents = agents;
        this.loadAccounts();
      },
      error: () => {
        this.errorMessage = 'Impossible de charger les agents.';
        this.isLoading = false;
      }
    });
  }

  private loadAccounts(): void {
    this.accountService.getAll().subscribe({
      next: (accounts) => {
        this.accounts = accounts;
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Impossible de charger les comptes.';
        this.isLoading = false;
      }
    });
  }
}
