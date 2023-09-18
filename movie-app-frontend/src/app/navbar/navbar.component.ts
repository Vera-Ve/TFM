import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  constructor(private router: Router) {}

  goToWatchlist() {
    // Navegar al componente de Watchlist (asegúrate de configurar las rutas correctamente)
    this.router.navigate(['/watchlist']);
  }
}
