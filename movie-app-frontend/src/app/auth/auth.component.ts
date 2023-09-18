import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent {
  email: string = '';
  password: string = '';
  statusMessage: string = '';
  



  constructor(private authService: AuthService, private router: Router) {}
  
  login() {
    // Llama al servicio de autenticación para realizar el inicio de sesión
    this.authService.login(this.email, this.password).subscribe(
      response => {
        this.statusMessage = response.message;
        console.log(this.statusMessage);
        localStorage.setItem('jwtToken', response.token);
        console.log("Token recieved", response.token);
        this.router.navigate(['/home']); // Redirige al primer paso después del inicio de sesión
        // Manejar respuesta exitosa (guardar token, redirigir, etc.)
      },
      error => {
        this.statusMessage = error.error.message;
        console.log(this.statusMessage);
        // Manejar error de autenticación
      }
    );
  }
}
