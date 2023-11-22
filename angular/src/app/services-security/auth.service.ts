import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, map, throwError } from 'rxjs';
import { Token } from '../token';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'https://localhost:7136/api/login'; // Substitua pela URL da sua API .NET

  constructor(private http: HttpClient, private route: Router) {
    localStorage.clear();
  }



  login(login: []): Observable<Token> {
    return this.http.post<Token>(this.apiUrl, login).pipe(
      map((res) => {
        debugger
        if (res.value == "EmailNotValidated")
          return res;
        
        localStorage.setItem('token', res.value.token);
        localStorage.setItem('isAuthenticated', 'true');
        return res;
      }),
      catchError((error: any) => {
        debugger
        // Aqui você pode lidar com o erro como desejar, por exemplo, logá-lo ou notificar o usuário
        console.error('Ocorreu um erro durante o login:', error);
        return throwError(() => error); // Isso reenviará o erro para quem chamar o método
      })
    );
  }

  logout() {
    localStorage.clear();
    this.route.navigate(['/login'])
    return this.http.post(`${this.apiUrl}/logout`, '')
  }

  register(login: []) {
    return this.http.post(`${this.apiUrl}/register`, login)
  }

  generateCode(login: []) {
    return this.http.post(`${this.apiUrl}/GenCode`, login)
  }
  setToken(token: string): void {
    localStorage.setItem('token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }
}
