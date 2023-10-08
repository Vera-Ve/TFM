// reset-password.component.ts

import { Component } from '@angular/core';
import { ResetPasswordService } from '../reset-password.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
})
export class ResetPasswordComponent {
  email: string = '';
  password: string = '';

  constructor(private resetPasswordService: ResetPasswordService) {}

  resetPassword() {
    this.resetPasswordService
      .resetPassword(this.email, this.password)
      .subscribe(
        (response) => {
          // Manejar la respuesta exitosa (por ejemplo, redirigir a la página de inicio de sesión)
        },
        (error) => {
          // Manejar errores (por ejemplo, mostrar un mensaje de error al usuario)
        }
      );
  }
}
