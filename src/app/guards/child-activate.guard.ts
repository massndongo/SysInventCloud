import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { InventoryService } from '../services/inventory.service';
import { jwtDecode } from 'jwt-decode';

export const childActivateGuard: CanActivateFn = (route, state) => {
  const authService = inject(InventoryService)
  const token = authService.getToken()
  const router = inject(Router);

  if (token) {
      const decode = jwtDecode(token);
      const expire = decode.exp;
      const date = (Math.floor((new Date).getTime() / 1000))
      if (expire!=undefined && date <= expire) {
        return true;
      }
      else {
        localStorage.removeItem('token')
        alert('Session expirée')
        router.navigate(['connexion'])
        alert
        return false;
      }
  } else {
    router.navigate(['connexion']);
    return false
  }
};
