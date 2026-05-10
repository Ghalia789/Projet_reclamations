import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const roleGuard = (allowedRoles: string[], fallbackRoute: string = '/dashboard'): CanActivateFn => {
  return () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (!authService.isAuthenticated()) {
      router.navigate(['/login']);
      return false;
    }

    const role = authService.getRole();
    if (role && allowedRoles.includes(role)) {
      return true;
    }

    router.navigate([fallbackRoute]);
    return false;
  };
};
