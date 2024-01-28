import { Router } from '@angular/router';
import { inject } from '@angular/core';
import { tap } from 'rxjs';
import { AuthentificationService } from '../services/authentification.service';




export const authentificationGuard = () => {
  const router = inject(Router);
  const service = inject(AuthentificationService);
  return service.isLoggedIn$.pipe(
    tap((isLoggedIn) => {
        if (!isLoggedIn) {
            router.navigateByUrl('/login');
        }
    })
);
};
