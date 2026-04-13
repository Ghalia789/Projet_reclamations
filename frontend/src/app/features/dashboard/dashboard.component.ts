import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  template: `
    <section class="hero">
      <p class="label">Frontend scaffold</p>
      <h2>Dashboard</h2>
      <p>
        The Angular structure is ready for JWT auth, reclamation management, and service integration.
      </p>
    </section>
  `,
  styles: [`
    .hero {
      display: grid;
      gap: 12px;
      padding: 24px;
    }

    .label {
      margin: 0;
      color: var(--primary);
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.12em;
      font-size: 0.78rem;
    }

    h2 {
      margin: 0;
      font-size: 2rem;
    }

    p {
      margin: 0;
      color: var(--muted);
      max-width: 60ch;
    }
  `]
})
export class DashboardComponent {}
