import { Component } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = ''; 
  successMessage: string = '';// Agrega una propiedad para almacenar el mensaje de error

  constructor(private authService: AuthService) {}

  register() {
    // Llama al servicio de registro para crear un nuevo usuario
    this.authService.register(this.email, this.password).subscribe(
      response => {
        this.successMessage = response.message; 
        this.errorMessage = '';
        // Manejar respuesta exitosa (redirigir a la página de inicio de sesión)
      },
      error => {
        // Manejar error de registro
        this.errorMessage = error.error.message; // Asigna el mensaje de error a la propiedad errorMessage
      }
    );
  }
}
