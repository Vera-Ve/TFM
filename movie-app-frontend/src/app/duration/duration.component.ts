import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FilterService } from '../filter.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-duration',
  templateUrl: './duration.component.html',
  styleUrls: ['./duration.component.scss']
})
export class DurationComponent {
  durationForm: FormGroup;

  constructor(private fb: FormBuilder, private router: Router, private filterService: FilterService, private authService: AuthService) {
    this.durationForm = this.fb.group({
      minDuration: [null, Validators.required],
      maxDuration: [null, Validators.required]
    });
  }

  saveAndNavigate() {
    if (this.durationForm.valid) {
      const minDuration = this.durationForm.value.minDuration;
      const maxDuration = this.durationForm.value.maxDuration;

      // Haz algo con los valores aquí (por ejemplo, enviarlos al servidor)
      console.log('Min Duration:', minDuration);
      console.log('Max Duration:', maxDuration);
      // Almacena los valores en el servicio FilterService
      this.filterService.minDuration = minDuration;
      this.filterService.maxDuration = maxDuration;
      if (this.authService.isAuthenticated()) {
      // Luego, navega al siguiente paso
      this.router.navigate(['/language'])
    } else {
       
          // Abre el diálogo de autenticación si recibes un error 401 al navegar a /language
          this.authService.openAuthDialog();
        }
     
    }
  }
}
