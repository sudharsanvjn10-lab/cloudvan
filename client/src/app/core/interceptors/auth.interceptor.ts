import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

function isTokenExpired(token: string): boolean {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return true;
    const payload = JSON.parse(atob(parts[1]));
    if (!payload.exp) return false;
    return Date.now() >= payload.exp * 1000;
  } catch {
    return true;
  }
}

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  let token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null;

  if (token && isTokenExpired(token)) {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_email');
      localStorage.removeItem('admin_privilege');
    }
    token = null;
  }

  let authReq = req;
  if (token && req.url.includes('/api/admin')) {
    authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 || error.status === 403) {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('admin_token');
          localStorage.removeItem('admin_email');
          localStorage.removeItem('admin_privilege');
        }
        router.navigate(['/login']);
      }
      return throwError(() => error);
    })
  );
};
