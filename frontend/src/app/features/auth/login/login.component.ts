import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgIf } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf],
  template: `
    <section class="auth-shell">
      <div class="hero">
        <p class="eyebrow">Systeme de gestion des reclamations</p>
        <h1>Acces securise aux espaces agent et admin.</h1>
        <p class="hero-copy">
          Suivez, assignez et priorisez les reclamations avec une vue claire sur les urgences.
          Connectez-vous pour acceder a votre tableau de bord personnalise.
        </p>
        <div class="hero-grid">
          <div>
            <p class="hero-label">Suivi temps reel</p>
            <p class="hero-value">Tickets, priorites, SLA</p>
          </div>
          <div>
            <p class="hero-label">Acces controle</p>
            <p class="hero-value">Roles, comptes, audits</p>
          </div>
        </div>
      </div>

      <div class="card">
        <div>
          <p class="label">Authentification</p>
          <h2>Connexion a votre espace</h2>
          <p class="description">Saisissez vos identifiants pour continuer.</p>
        </div>

        <form [formGroup]="form" (ngSubmit)="submit()" class="form">
          <label>
            Email
            <input type="email" formControlName="email" placeholder="nom@entreprise.tn">
          </label>

          <label>
            Mot de passe
            <input type="password" formControlName="password" placeholder="Votre mot de passe">
          </label>

          <button type="submit" [disabled]="form.invalid || loading">{{ loading ? 'Connexion...' : 'Se connecter' }}</button>

          <p class="error" *ngIf="errorMessage">{{ errorMessage }}</p>
          <p class="hint">Besoin d'aide ? Contactez l'administrateur pour reinitialiser le mot de passe.</p>
        </form>
      </div>
    </section>
  `,
  styles: [`
    .auth-shell {
      min-height: calc(100vh - 140px);
      margin: 32px auto 48px;
      display: grid;
      gap: 28px;
      align-items: center;
      max-width: 1100px;
      padding: 0 20px;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    }

    .hero {
      padding: 32px;
      border-radius: 28px;
      background:
        radial-gradient(circle at top left, rgba(15, 118, 110, 0.12), transparent 55%),
        linear-gradient(135deg, rgba(15, 118, 110, 0.08), rgba(15, 118, 110, 0));
      border: 1px solid rgba(15, 118, 110, 0.12);
      display: grid;
      gap: 16px;
    }

    .eyebrow {
      margin: 0;
      color: var(--primary);
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.16em;
      font-size: 0.72rem;
    }

    h1 {
      margin: 0;
      font-size: clamp(2rem, 2.4vw, 2.6rem);
      line-height: 1.2;
      color: var(--text);
    }

    .hero-copy {
      margin: 0;
      color: var(--muted);
      font-size: 1rem;
      line-height: 1.6;
    }

    .hero-grid {
      display: grid;
      gap: 12px;
      grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
    }

    .hero-label {
      margin: 0 0 4px;
      font-size: 0.72rem;
      text-transform: uppercase;
      letter-spacing: 0.12em;
      color: rgba(15, 118, 110, 0.7);
      font-weight: 700;
    }

    .hero-value {
      margin: 0;
      font-weight: 600;
      color: var(--text);
    }

    .card {
      padding: 32px;
      background: var(--surface);
      border-radius: 28px;
      border: 1px solid var(--border);
      box-shadow: var(--shadow);
      display: grid;
      gap: 24px;
    }

    .label {
      margin: 0 0 8px;
      color: var(--primary);
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.12em;
      font-size: 0.78rem;
    }

    h2 {
      margin: 0 0 8px;
      font-size: 1.9rem;
    }

    .description {
      margin: 0;
      color: var(--muted);
    }

    .form {
      display: grid;
      gap: 16px;
    }

    label {
      display: grid;
      gap: 8px;
      font-weight: 600;
      color: var(--text);
    }

    input {
      padding: 14px 16px;
      border-radius: 14px;
      border: 1px solid var(--border);
      background: #fff;
      outline: none;
      transition: box-shadow 0.2s ease, border-color 0.2s ease;
    }

    input:focus {
      border-color: rgba(15, 118, 110, 0.45);
      box-shadow: 0 0 0 4px rgba(15, 118, 110, 0.12);
    }

    button {
      padding: 14px 18px;
      border: 0;
      border-radius: 14px;
      background: linear-gradient(135deg, var(--primary), var(--primary-strong));
      color: white;
      font-weight: 700;
      cursor: pointer;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
      box-shadow: 0 10px 22px rgba(15, 118, 110, 0.18);
    }

    button:hover:not(:disabled) {
      transform: translateY(-1px);
      box-shadow: 0 16px 28px rgba(15, 118, 110, 0.22);
    }

    button:disabled {
      opacity: 0.7;
      cursor: not-allowed;
      box-shadow: none;
    }

    .error {
      margin: 0;
      color: #b91c1c;
      font-weight: 600;
    }

    .hint {
      margin: 0;
      color: var(--muted);
      font-size: 0.88rem;
    }
  `]
})
export class LoginComponent {
  loading = false;
  errorMessage = '';

  form = this.formBuilder.nonNullable.group({
    email: ['admin@company.tn', [Validators.required, Validators.email]],
    password: ['admin123', [Validators.required]]
  });

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}

  submit(): void {
    if (this.form.invalid) {
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    this.authService.login(this.form.getRawValue()).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/dashboard']);
      },
      error: () => {
        this.loading = false;
        this.errorMessage = 'Connexion refusée. Vérifiez les identifiants.';
      }
    });
  }
}
