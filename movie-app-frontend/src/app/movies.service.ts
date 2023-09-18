import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MovieService {
  private apiKey = '78d37cb93c16264fe12628edbd4dfe86'; // Reemplaza con tu propia API key de TMDb
  private apiUrl = 'https://api.themoviedb.org/3';
  private watchlistApiUrl = '//localhost:8000/api/watchlist/add_to_watchlist/';
  private blacklistApiUrl = '//localhost:8000/api/blacklist/';




  constructor(private http: HttpClient) {}

  generateCacheBuster(): string {
    // Genera un número aleatorio único y lo convierte a cadena
    return Math.random().toString(36).substring(2);
  }

 





  // Método para obtener películas populares filtradas por suscripción, género, duración e idiomas
  getFilteredMovies(
    subscriptions: string[],
    genres: number[],
    minDuration: number,
    maxDuration: number,
    languages: string[],
    page: number,
  ): Observable<any> {
    const params = new HttpParams({
      
    fromObject: {
      api_key: this.apiKey,
      with_watch_providers: subscriptions.join('|'),
      with_genres: genres.join('|'),
      'with_runtime.gte': minDuration,
      'with_runtime.lte': maxDuration,
      with_original_language: languages.join('|'),
      page: page.toString(),
      include_adult:'false',
      sort_by: 'popularity.desc',
    },
  });
  


    // Agrega aquí los parámetros adicionales según tu lógica de filtro
    console.log(`${this.apiUrl}/discover/movie`, { params });
   

    return this.http.get(`${this.apiUrl}/discover/movie`, { params });
    
  }

// Nueva función para obtener la lista de géneros
  getGenres(): Observable<any> {
    const params = new HttpParams()
      .set('api_key', this.apiKey);

    return this.http.get(`${this.apiUrl}/genre/movie/list`, { params });
  }

  addToWatchlist(movieData: any): Observable<any> {
    const token = localStorage.getItem('jwtToken');
    if (!token) {
      console.error('Token JWT no encontrado');
      // Manejo de errores: Devuelve un observable de error
      return new Observable(); 
    }
    // Configura los encabezados con el token JWT
  const headers = new HttpHeaders({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  });
    // Realiza la solicitud POST al backend, incluyendo los datos de la película y el ID de usuario.
    console.log(movieData );
  return this.http.post(`${this.watchlistApiUrl}`, movieData , { headers });

}

addToBlacklist(movieId: number): Observable<any> {
  // Obtén el token JWT almacenado en localStorage
  const token = localStorage.getItem('jwtToken');

  if (!token) {
    console.error('Token JWT no encontrado');
    // Manejo de errores, redirección o cualquier otra acción necesaria
    return new Observable(); // Devuelve un observable vacío en caso de error
  }

  // Configura los encabezados con el token JWT
  const headers = new HttpHeaders({
    Authorization: `Bearer ${token}`,
  });

  // Crea el cuerpo de la solicitud con el ID de la película
  const requestBody = { movie_id: movieId };

  // Realiza una solicitud POST para agregar la película a la lista negra
  return this.http.post(`${this.blacklistApiUrl}add/`, requestBody, { headers });
}

getBlacklist(): Observable<number[]> {
  // Obtén el token JWT almacenado en localStorage
  const token = localStorage.getItem('jwtToken');

  if (!token) {
    console.error('Token JWT no encontrado');
    // Manejo de errores, redirección o cualquier otra acción necesaria
    return new Observable(); 
  }

  // Configura los encabezados con el token JWT
  const headers = new HttpHeaders({
    Authorization: `Bearer ${token}`,
  });
 
  // Realiza una solicitud GET para obtener la lista negra del usuario
  return this.http.get<number[]>(`${this.blacklistApiUrl}`, { headers });
}
}




