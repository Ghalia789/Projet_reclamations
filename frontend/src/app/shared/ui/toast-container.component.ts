import { Component } from '@angular/core';
import { AsyncPipe, NgClass, NgFor, NgIf } from '@angular/common';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [NgFor, NgIf, NgClass, AsyncPipe],
  template: `
    <aside class="pointer-events-none fixed right-4 top-4 z-50 flex w-[min(92vw,360px)] flex-col gap-2">
      <article
        *ngFor="let toast of toastService.toasts$ | async"
        class="pointer-events-auto rounded-xl border px-4 py-3 shadow-lg backdrop-blur"
        [ngClass]="toastClasses(toast.type)"
      >
        <div class="flex items-start justify-between gap-3">
          <div class="flex items-start gap-3">
            <span
              class="inline-flex h-6 w-6 items-center justify-center rounded-full text-[0.68rem] font-bold"
              [ngClass]="iconClasses(toast.type)"
            >
              {{ iconLabel(toast.type) }}
            </span>

            <div>
              <p class="text-sm font-semibold">{{ toast.title }}</p>
              <p *ngIf="toast.message" class="mt-0.5 text-sm opacity-90">{{ toast.message }}</p>
            </div>
          </div>

          <button
            type="button"
            class="rounded-md px-2 py-0.5 text-xs font-semibold opacity-80 transition hover:opacity-100"
            (click)="toastService.dismiss(toast.id)"
            aria-label="Fermer"
          >
            X
          </button>
        </div>
      </article>
    </aside>
  `,
  styles: [`
    .loading-dot {
      animation: pulseDot 1s ease-in-out infinite;
    }

    @keyframes pulseDot {
      0%, 100% { opacity: 0.45; transform: scale(0.92); }
      50% { opacity: 1; transform: scale(1); }
    }
  `]
})
export class ToastContainerComponent {
  constructor(public readonly toastService: ToastService) {}

  toastClasses(type: 'success' | 'error' | 'info' | 'loading'): string {
    if (type === 'success') {
      return 'border-emerald-200 bg-emerald-50 text-emerald-900';
    }

    if (type === 'error') {
      return 'border-red-200 bg-red-50 text-red-900';
    }

    if (type === 'loading') {
      return 'border-amber-200 bg-amber-50 text-amber-900';
    }

    return 'border-sky-200 bg-sky-50 text-sky-900';
  }

  iconClasses(type: 'success' | 'error' | 'info' | 'loading'): string {
    if (type === 'success') {
      return 'bg-emerald-200/80 text-emerald-900';
    }

    if (type === 'error') {
      return 'bg-red-200/80 text-red-900';
    }

    if (type === 'loading') {
      return 'loading-dot bg-amber-200/80 text-amber-900';
    }

    return 'bg-sky-200/80 text-sky-900';
  }

  iconLabel(type: 'success' | 'error' | 'info' | 'loading'): string {
    if (type === 'success') {
      return 'OK';
    }

    if (type === 'error') {
      return '!';
    }

    if (type === 'loading') {
      return '...';
    }

    return 'i';
  }
}
