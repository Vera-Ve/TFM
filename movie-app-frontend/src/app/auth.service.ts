import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8000/'; 
  
  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<any> {
    const body = { email, password };
    return this.http.post(`${this.apiUrl}login/`, body);
  }
  // Una función para establecer los encabezados con el token JWT después del inicio de sesión
  setJwtToken(token: string) {
    localStorage.setItem('jwtToken', token);
  }
// Agrega una función para obtener los encabezados con el token JWT
getHeaders(): HttpHeaders {
  return new HttpHeaders({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
  });
}
  
  register(email: string, password: string): Observable<any> {
    const body = { email, password };
    return this.http.post(`${this.apiUrl}/register/`, body);
    
  }
 
}
