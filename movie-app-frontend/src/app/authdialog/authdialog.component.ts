import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-authdialog',
  templateUrl: './authdialog.component.html',
  styleUrls: ['./authdialog.component.scss']
})
export class AuthdialogComponent {
  email: string = '';
  password: string = '';
  statusMessage: string = '';
  



  constructor(private authService: AuthService, private router: Router, public dialogRef: MatDialogRef<AuthdialogComponent>) {}
  
  login() {
    // Llama al servicio de autenticación para realizar el inicio de sesión
    this.authService.login(this.email, this.password).subscribe(
      response => {
        this.statusMessage = response.message;
        console.log(this.statusMessage);
        localStorage.setItem('jwtToken', response.token);
        console.log("Token recieved", response.token);
        this.dialogRef.close(true);
        // Redirige al primer paso después del inicio de sesión
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
