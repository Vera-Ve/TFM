// reset-password.component.ts

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ResetPasswordService } from '../reset-password.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
})
export class ResetPasswordComponent implements OnInit {
  uid!: string;
  token!: string;
  password: string = '';
  repeatPassword: string = '';
  errorMessagePassword: string[] = []; 
  errorMessage: string = ''; 
  successMessage: string = '';
  showPassword: boolean = false;

  constructor(private resetPasswordService: ResetPasswordService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    // Obtiene los valores uid y token de la URL
    this.route.params.subscribe(params => {
      this.uid = params['uid'];
      this.token = params['token'];
      console.log(this.uid);
      console.log(this.token);
    });
  }

  resetPasswordConfirm() {
    this.resetPasswordService
      .resetPasswordConfirm(this.uid, this.token, this.password, this.repeatPassword)
      .subscribe(
        (response) => {
          this.errorMessage = '';
          this.errorMessagePassword =[] ;
          console.log(response);
          this.successMessage = 'Contraseña restablecida con éxito. Redirigiendo a la página de inicio de sesión...';
          // Redirigir a la página de inicio de sesión después de un breve período
          setTimeout(() => {
            this.router.navigate(['']);
          }, 3000); // Redirige después de 3 segundos (puedes ajustar el tiempo)
          },
        (error) => {
          if  (error.error.new_password) {
            this.errorMessagePassword = error.error.new_password; 
            this.errorMessage = '';
          } else {
            this.errorMessagePassword = [];
            this.errorMessage = 'Error al restablecer la contraseña';
          }
          
          // Manejar errores (por ejemplo, mostrar un mensaje de error al usuario)
        }
      );
  }
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
}
