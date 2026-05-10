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
    <section class="card">
      <div>
        <p class="label">Authentification</p>
        <h2>Connexion JWT</h2>
        <p class="description">Utilisez les identifiants de démonstration pour obtenir un token d'accès.</p>
      </div>

      <form [formGroup]="form" (ngSubmit)="submit()" class="form">
        <label>
          Email
          <input type="email" formControlName="email" placeholder="admin@company.tn">
        </label>

        <label>
          Mot de passe
          <input type="password" formControlName="password" placeholder="admin123">
        </label>

        <button type="submit" [disabled]="form.invalid || loading">{{ loading ? 'Connexion...' : 'Se connecter' }}</button>

        <p class="error" *ngIf="errorMessage">{{ errorMessage }}</p>
      </form>
    </section>
  `,
  styles: [`
    .card {
      max-width: 480px;
      margin: 40px auto;
      padding: 32px;
      background: var(--surface);
      border-radius: 24px;
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
      font-size: 2rem;
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
    }

    input:focus {
      border-color: rgba(15, 118, 110, 0.4);
      box-shadow: 0 0 0 4px rgba(15, 118, 110, 0.08);
    }

    button {
      padding: 14px 18px;
      border: 0;
      border-radius: 14px;
      background: linear-gradient(135deg, var(--primary), var(--primary-strong));
      color: white;
      font-weight: 700;
      cursor: pointer;
    }

    button:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }

    .error {
      margin: 0;
      color: #b91c1c;
      font-weight: 600;
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
