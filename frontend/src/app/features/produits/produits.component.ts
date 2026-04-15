import { Component, OnInit } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Produit, ProduitService } from '../../core/services/produit.service';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-produits',
  standalone: true,
  imports: [NgIf, NgFor, ReactiveFormsModule],
  template: `
    <section class="grid gap-5">
      <header>
        <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Catalogue</p>
        <h2 class="mt-1 text-2xl font-bold text-slate-900">Produits</h2>
      </header>

      <form [formGroup]="form" (ngSubmit)="submit()" class="grid gap-4 rounded-2xl border border-slate-200 bg-white p-4 md:grid-cols-5">
        <label class="grid gap-1 text-sm font-medium text-slate-700">
          Nom
          <input
            type="text"
            formControlName="nom"
            placeholder="Ex: Smartphone X"
            class="rounded-xl border border-slate-300 px-3 py-2 outline-none focus:border-brand-600/50 focus:ring-2 focus:ring-brand-600/20"
          >
        </label>

        <label class="grid gap-1 text-sm font-medium text-slate-700">
          Categorie
          <input
            type="text"
            formControlName="categorie"
            placeholder="Ex: Electronique"
            class="rounded-xl border border-slate-300 px-3 py-2 outline-none focus:border-brand-600/50 focus:ring-2 focus:ring-brand-600/20"
          >
        </label>

        <label class="grid gap-1 text-sm font-medium text-slate-700">
          Marque
          <input
            type="text"
            formControlName="marque"
            placeholder="Ex: Samsung"
            class="rounded-xl border border-slate-300 px-3 py-2 outline-none focus:border-brand-600/50 focus:ring-2 focus:ring-brand-600/20"
          >
        </label>

        <label class="grid gap-1 text-sm font-medium text-slate-700">
          Modèle
          <input
            type="text"
            formControlName="modele"
            placeholder="Ex: S24"
            class="rounded-xl border border-slate-300 px-3 py-2 outline-none focus:border-brand-600/50 focus:ring-2 focus:ring-brand-600/20"
          >
        </label>

        <label class="grid gap-1 text-sm font-medium text-slate-700">
          Garantie (mois)
          <input
            type="number"
            min="0"
            formControlName="garantieMois"
            placeholder="Ex: 24"
            class="rounded-xl border border-slate-300 px-3 py-2 outline-none focus:border-brand-600/50 focus:ring-2 focus:ring-brand-600/20"
          >
        </label>

        <div class="flex items-end">
          <button
            type="submit"
            [disabled]="form.invalid || isSubmitting"
            class="w-full rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {{ isSubmitting ? 'Ajout...' : 'Ajouter produit' }}
          </button>
        </div>
      </form>

      <p *ngIf="isLoading" class="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
        Chargement des produits...
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
              <th class="px-4 py-3 font-semibold">Categorie</th>
              <th class="px-4 py-3 font-semibold">Marque</th>
              <th class="px-4 py-3 font-semibold">Modèle</th>
              <th class="px-4 py-3 font-semibold">Garantie</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let produit of produits" class="border-t border-slate-100">
              <td class="px-4 py-3 text-slate-500">{{ produit.id }}</td>
              <td class="px-4 py-3 font-medium text-slate-800">{{ produit.nom }}</td>
              <td class="px-4 py-3 text-slate-600">{{ produit.categorie || '—' }}</td>
              <td class="px-4 py-3 text-slate-600">{{ produit.marque || '—' }}</td>
              <td class="px-4 py-3 text-slate-600">{{ produit.modele || '—' }}</td>
              <td class="px-4 py-3 text-slate-600">{{ produit.garantieMois == null ? '—' : (produit.garantieMois + ' mois') }}</td>
            </tr>
            <tr *ngIf="produits.length === 0">
              <td colspan="6" class="px-4 py-5 text-center text-slate-500">Aucun produit disponible.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  `
})
export class ProduitsComponent implements OnInit {
  produits: Produit[] = [];
  isLoading = true;
  errorMessage = '';
  isSubmitting = false;

  form = this.formBuilder.nonNullable.group({
    nom: ['', [Validators.required]],
    categorie: ['', [Validators.required]],
    marque: [''],
    modele: [''],
    garantieMois: ['']
  });

  constructor(
    private readonly produitService: ProduitService,
    private readonly formBuilder: FormBuilder,
    private readonly toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.loadProduits();
  }

  submit(): void {
    if (this.form.invalid || this.isSubmitting) {
      return;
    }

    const raw = this.form.getRawValue();

    this.isSubmitting = true;
    this.errorMessage = '';
    const loadingToastId = this.toastService.loading('Traitement', 'Ajout du produit en cours...');

    this.produitService.create({
      nom: raw.nom,
      categorie: raw.categorie,
      ...(raw.marque ? { marque: raw.marque } : {}),
      ...(raw.modele ? { modele: raw.modele } : {}),
      ...(raw.garantieMois ? { garantieMois: Number(raw.garantieMois) } : {})
    }).subscribe({
      next: () => {
        this.toastService.dismiss(loadingToastId);
        this.form.reset({ nom: '', categorie: '', marque: '', modele: '', garantieMois: '' });
        this.isSubmitting = false;
        this.toastService.created('Produit');
        this.loadProduits();
      },
      error: () => {
        this.toastService.dismiss(loadingToastId);
        this.isSubmitting = false;
        this.errorMessage = 'Impossible d\'ajouter le produit pour le moment.';
        this.toastService.actionError('ajouter le produit');
      }
    });
  }

  private loadProduits(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.produitService.getAll().subscribe({
      next: (produits) => {
        this.produits = produits;
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Impossible de charger les produits pour le moment.';
        this.toastService.loadError('les produits');
        this.isLoading = false;
      }
    });
  }
}
