import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost/codeigniter/api';

  constructor(private http: HttpClient, private router: Router) {}


  login(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, data);
  }


  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  getUser(): any {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
  saveSession(token: string, user: any): void {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
  }

  clearSession(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }


  logout(): void {
    const user = this.getUser();

    if (!user?.id) {
      this.clearSession();
      this.router.navigate(['/login']);
      return;
    }


    this.http.post(`${this.apiUrl}/logout`, { org_id: user.id }).subscribe({
      next: () => {
        this.clearSession();
        this.router.navigate(['/login']);
      },
      error: () => {
        this.clearSession();
        this.router.navigate(['/login']);
      }
    });
  }
}
