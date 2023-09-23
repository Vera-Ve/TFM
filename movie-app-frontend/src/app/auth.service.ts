import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap , catchError, throwError} from 'rxjs';
import { Router } from '@angular/router';




@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8000/'; 
  
  constructor(private http: HttpClient, private router: Router) {}

  login(email: string, password: string): Observable<any> {
    const body = { email, password };
    return this.http.post(`${this.apiUrl}api/login/`, body);
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

  isAuthenticated(): boolean {
     // Recupera el token almacenado en localStorage
     const token = localStorage.getItem('jwtToken');

     // Comprueba si el token existe
     if (!token) {
       return false;
     }
 
     // Decodifica el token para obtener la fecha de vencimiento (puedes usar una librería como 'jsonwebtoken')
     const tokenData = this.decodeToken(token);
 
     // Obtiene la fecha actual
     const currentTime = new Date().getTime() / 1000;
 
     // Comprueba si el token ha expirado
     if (tokenData.exp && tokenData.exp < currentTime) {
       // El token ha expirado, el usuario debe iniciar sesión nuevamente
       return false;
     }
 
     // El token es válido y no ha expirado
     return true;
   }
   private decodeToken(token: string): any {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace('-', '+').replace('_', '/');
    return JSON.parse(atob(base64));
  }
 



 
  logout() {
    // Agrega cualquier lógica necesaria antes del logout, como limpiar datos de usuario en el almacenamiento local
    // Por ejemplo, si estás utilizando JWT, puedes eliminar el token almacenado en localStorage.
    localStorage.removeItem('jwtToken');
    document.cookie = 'refresh_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    // Redirige al usuario a la página de inicio de sesión o a la página principal
    this.router.navigate(['']); // Reemplaza '/login' con la ruta correcta
    console.log("Logiut function")
  }

}
