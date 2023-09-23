import { Component, OnInit  } from '@angular/core';
import { MovieService } from '../movies.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-blacklist',
  templateUrl: './blacklist.component.html',
  styleUrls: ['./blacklist.component.scss']
})
export class BlacklistComponent implements OnInit {
  blacklist: any[] = [];
  constructor(private http: HttpClient, private movieService: MovieService, private authService: AuthService) { }
  ngOnInit(): void {
     
    this.movieService.getBlacklist().subscribe(
      (data) => {
        this.blacklist = data;
        console.log(this.blacklist);
      },
      (error) => {
        console.error('Error al obtener la blacklist', error);
        
       
      }
    );
  }
  removeFromBlacklist(movieId: number) {
    this.movieService.removeFromBlacklist(movieId).subscribe(
      (response) => {
        // Maneja la respuesta exitosa, por ejemplo, eliminando la película de la lista en el frontend.
        console.log(response.message);
        this.blacklist = this.blacklist.filter((movie) => movie.id !== movieId);
      },
      (error) => {
        console.error('Error al eliminar la película de la lista negra', error);
        // Maneja los errores de manera apropiada, por ejemplo, mostrando un mensaje de error al usuario.
      }
    );
   
    }
  }
    

    

