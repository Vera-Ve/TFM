import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { FilterService } from '../filter.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  constructor(private router: Router, private authService: AuthService, private filterService: FilterService ) {}

  goToWatchlist() {
    // Navegar al componente de Watchlist (asegúrate de configurar las rutas correctamente)
    this.router.navigate(['/watchlist']);
  }

  logout() {
    // Llama al método de logout del servicio de autenticación
    console.log("Logout function");
    this.authService.logout();
  }

  newSearch() {
    this.filterService.clearFilters;
    this.router.navigate(['/subscriptions']);

  }
}
