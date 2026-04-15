import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type ToastType = 'success' | 'error' | 'info';
export type ToastTypeExtended = ToastType | 'loading';

export interface ToastMessage {
  id: number;
  type: ToastTypeExtended;
  title: string;
  message?: string;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private readonly toastsSubject = new BehaviorSubject<ToastMessage[]>([]);
  readonly toasts$ = this.toastsSubject.asObservable();
  private nextId = 1;

  success(title: string, message?: string, durationMs = 3500): void {
    this.show('success', title, message, durationMs);
  }

  error(title: string, message?: string, durationMs = 4500): void {
    this.show('error', title, message, durationMs);
  }

  info(title: string, message?: string, durationMs = 3500): void {
    this.show('info', title, message, durationMs);
  }

  loading(title: string, message?: string): number {
    return this.show('loading', title, message, 0);
  }

  created(entityLabel: string): void {
    this.success('Succes', `${entityLabel} ajoute(e) avec succes.`);
  }

  updated(entityLabel: string): void {
    this.success('Succes', `${entityLabel} mis(e) a jour avec succes.`);
  }

  loadError(scopeLabel: string): void {
    this.error('Erreur', `Impossible de charger ${scopeLabel} pour le moment.`);
  }

  actionError(actionLabel: string): void {
    this.error('Erreur', `Impossible de ${actionLabel} pour le moment.`);
  }

  dismiss(id: number): void {
    const nextToasts = this.toastsSubject.getValue().filter((toast) => toast.id !== id);
    this.toastsSubject.next(nextToasts);
  }

  private show(type: ToastTypeExtended, title: string, message?: string, durationMs = 3500): number {
    const toast: ToastMessage = {
      id: this.nextId++,
      type,
      title,
      message
    };

    this.toastsSubject.next([...this.toastsSubject.getValue(), toast]);

    if (durationMs > 0) {
      setTimeout(() => {
        this.dismiss(toast.id);
      }, durationMs);
    }

    return toast.id;
  }
}
