import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-watchlist',
  templateUrl: './watchlist.component.html',
  styleUrls: ['./watchlist.component.scss']
})
export class WatchlistComponent implements OnInit {
  private watchlistApiUrl = '//localhost:8000/api/watchlist/';
  watchlist: any[] = [];

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    // Obtén el token JWT almacenado en localStorage
    const token = localStorage.getItem('jwtToken');

    if (!token) {
      console.error('Token JWT no encontrado');
      // Manejo de errores, redirección o cualquier otra acción necesaria
      return;
    }

    // Configura los encabezados con el token JWT
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    // Realiza la solicitud GET a la watchlist
    this.http.get(`${this.watchlistApiUrl}`, { headers }).subscribe(
      (data: any) => {
        // La respuesta debería contener la lista de películas de la watchlist
        this.watchlist = data;
        console.log(this.watchlist);
      },
      (error) => {
        console.error('Error al obtener la watchlist', error);
        // Manejo de errores
      }
    );
  }
}
