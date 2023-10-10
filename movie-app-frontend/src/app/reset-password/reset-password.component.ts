// reset-password.component.ts

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
  errorMessage: string = ''; 
  successMessage: string = '';

  constructor(private resetPasswordService: ResetPasswordService, private route: ActivatedRoute) {}

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
          console.log(response);
          // Manejar la respuesta exitosa (por ejemplo, redirigir a la página de inicio de sesión)
        },
        (error) => {
          this.errorMessage = error.error.message;
          console.log(error);
          // Manejar errores (por ejemplo, mostrar un mensaje de error al usuario)
        }
      );
  }
}
