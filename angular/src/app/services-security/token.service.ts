import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  private apiUrl = 'https://localhost:7136/api/tokenvalidation'; // Substitua pela URL da sua API .NET
  constructor(private http: HttpClient) { }

  isAuthenticated() {
    const token = this.getToken();
    var data = {token: token}
    var result =  this.http.post(`${this.apiUrl}`, data)
    return result
  }

  getToken(){
    return localStorage.getItem('token');
  }
}
