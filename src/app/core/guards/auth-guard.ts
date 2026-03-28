import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  const token = localStorage.getItem('token');

  if (token) {
    return true; // ✅ allow access
  }

  // ❌ not logged in → redirect
  router.navigate(['/login']);
  return false;
};