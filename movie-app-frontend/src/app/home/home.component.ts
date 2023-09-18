import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  constructor(private router: Router) {}

  startNewSearch(): void {
    // Redirige a la página de selección de plataformas
    this.router.navigate(['/subscription']);
  }

  viewSavedMovies(): void {
    // Redirige a la página de películas guardadas
    this.router.navigate(['/watchlist']);
  }
}
