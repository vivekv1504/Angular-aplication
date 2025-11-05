import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    // Check for role-based access
    const requiredRole = route.data['role'];
    
    if (requiredRole === 'owner' && !authService.isOwner()) {
      router.navigate(['/customer-products']);
      return false;
    }
    
    if (requiredRole === 'customer' && !authService.isCustomer()) {
      router.navigate(['/admin-dashboard']);
      return false;
    }
    
    return true;
  }

  router.navigate(['/login']);
  return false;
};
