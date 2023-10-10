import { Component, OnInit } from '@angular/core';
import { ResetPasswordService } from '../reset-password.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-reset-password-email',
  templateUrl: './reset-password-email.component.html',
  styleUrls: ['./reset-password-email.component.scss']
})
export class ResetPasswordEmailComponent implements OnInit {
  email: string = '';
  isRequestSent: boolean = false;
  errorMessage: string = '';
  emailFormControl!: FormGroup;

  constructor(private resetPasswordService: ResetPasswordService, private formBuilder: FormBuilder) {}
  
  ngOnInit(): void {
    // Inicializa el FormGroup en el método ngOnInit
    this.emailFormControl = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]] // Agrega validadores para el correo electrónico
    });
  }


  resetPassword() {
    const email = this.emailFormControl.value.email;
    this.resetPasswordService.resetPassword(this.email)
      .subscribe(
        (response) => {
          this.isRequestSent = true;
          this.errorMessage = ''; // Limpiar cualquier mensaje de error previo
          console.log('Solicitud de restablecimiento de contraseña enviada con éxito.');
          // Redirigir a una página de confirmación o mostrar un mensaje al usuario.
        },
        (error) => {
          this.isRequestSent = false;
          this.errorMessage = 'Error al enviar la solicitud de restablecimiento de contraseña';
          console.error('Error al enviar la solicitud de restablecimiento de contraseña:', error);
          // Mostrar un mensaje de error al usuario o redirigir a una página de error.
        }
      );
  }

  clearMessages() {
    this.isRequestSent = false;
    this.errorMessage = '';
  }

}
