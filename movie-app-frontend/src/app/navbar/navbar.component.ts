import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  constructor(private router: Router, private authService: AuthService) {}

  goToWatchlist() {
    // Navegar al componente de Watchlist (asegúrate de configurar las rutas correctamente)
    this.router.navigate(['/watchlist']);
  }

  logout() {
    // Llama al método de logout del servicio de autenticación
    console.log("Logout function");
    this.authService.logout();
  }
}
