import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from './auth.service'; // Adjust the path to your AuthService
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this.authService.isLoggedIn$.pipe(
      map((isLoggedIn: boolean) => {
        if (!isLoggedIn) {
          this.router.navigate(['/auth/login']);
          return false;
        }
        const user = this.authService.currentUserValue;
        const expectedRole = next.data.expectedRole;
        if (expectedRole && user.Role !== expectedRole) {
          this.router.navigate(['/unauthorized']);
          return false;
        }
        return true;
      })
    );
  }
}
