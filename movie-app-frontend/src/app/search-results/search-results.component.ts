import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';


import { AuthdialogComponent } from '../authdialog/authdialog.component';
import { MovieService } from '../movies.service';
import { FilterService } from '../filter.service';
import { AuthService } from '../auth.service';

import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.scss']
})
export class SearchResultsComponent {
  filteredMovies: any[] = [];
  blacklist: number[] = [];
  blacklistTemp:number[] = [];
  currentPage = 1;
  currentMovieIndex = 0;
  itemsPerPage = 20;
  showFavoriteText: boolean = false;
  genreMap: Map<number, string> = new Map<number, string>();
  movieForm: FormGroup;
  showAuthWindow = false;
  
  
  

  constructor(private movieService: MovieService, private filterService: FilterService, private fb: FormBuilder,  private authService: AuthService, private snackBar: MatSnackBar, public dialog: MatDialog) {
    this.movieForm = this.fb.group({
      adult: [false, Validators.required],
      backdrop_path: [null, Validators.required],
      genre_ids: [[], Validators.required],
      id: [null, Validators.required],
      original_language: [null, Validators.required],
      original_title: [null, Validators.required],
      overview: [null, Validators.required],
      popularity: [null, Validators.required],
      poster_path: [null, Validators.required],
      release_date: [null, Validators.required],
      title: [null, Validators.required],
      video: [false, Validators.required],
      vote_average: [null, Validators.required],
      vote_count: [null, Validators.required],
    });
  }

  ngOnInit(): void {
    
    this.loadBlacklist().then(() => {
      this.filterByBlacklist();
    });
    
// Llama al servicio para obtener los géneros y crear el mapa
    this.loadGenres();
    this.loadMovies();
    // Calcular el índice de inicio y el índice final para la página actual
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
  }

  loadGenres() {
    this.movieService.getGenres().subscribe((data) => {
      if (data.genres) {
        // Crea un mapa de ID de género a nombre de género
        data.genres.forEach((genre:any) => {
          this.genreMap.set(genre.id, genre.name);
        });
      }
    });
  }
  
  
  async loadBlacklist() {
    console.log("call blacklist")
    try {
      const data = await this.movieService.getBlacklist().toPromise();
      if (data && data.length > 0) {
        // Almacena los IDs de las películas en la lista negra
        this.blacklist = data.map((movie: any) => movie.id);
        console.log('Blacklist received', this.blacklist);
      }
    } catch (error) {
      console.error('Error loading blacklist', error);
    }
  }
    
    
  loadMovies() {
    // Acceder a las variables a través de la instancia de FilterService
    const subscriptions = this.filterService.subscriptions;
    const genres = this.filterService.genres;
    const languages = this.filterService.languages;
    const minDuration = this.filterService.minDuration;
    const maxDuration = this.filterService.maxDuration;
    console.log('filter data',subscriptions,genres, minDuration, maxDuration, languages);
   
    this.movieService
      .getFilteredMovies(subscriptions, genres, minDuration, maxDuration, languages, this.currentPage)
      .subscribe((data) => {
        
        
        if (data.results && data.results.length > 0) {
          this.filteredMovies.push(...data.results);
        console.log("Before filter by Blacklist", this.filteredMovies);
          // Filtra las películas que no están en la lista negra
          this.filterByBlacklist();
          this.currentPage++;   
        }
        
        });
  }

  filterByBlacklist() {
    // Filtra las películas que no están en la lista negra
     // Filtra las películas que no están en la lista negra
  this. loadBlacklist()
  this.filteredMovies = this.filteredMovies.filter((movie) => !this.blacklist.includes(movie.id));
  console.log("After filter by blacklist", this.filteredMovies);
  }

  // Función para mostrar la siguiente película
  showNextMovie() {
    if (this.currentMovieIndex < this.filteredMovies.length - 1) {
      this.currentMovieIndex++;
      const currentMovie = this.filteredMovies[this.currentMovieIndex];
      
      // Verifica si la película actual está en la lista negra provisional
      if (this.blacklistTemp.includes(currentMovie.id)) {
        // Si está en la lista negra provisional, pasa a la siguiente película
        this.showNextMovie();
      }
    } else {
      // Llegaste al final de la lista actual, carga más películas
      this.loadMovies();
      this.currentMovieIndex++;
      
      
    }
  }








getGenreName(genreId: number): string {
  // Encuentra el nombre del género correspondiente en la lista de géneros
  const genreName = this.genreMap.get(genreId);
  
  return genreName ? genreName : 'Desconocido'; // Retorna 'Desconocido' si no se encuentra el género
}


  // Función para mostrar la película anterior
  showPreviousMovie() {
    if (this.currentMovieIndex > 0) {
      let previousIndex = this.currentMovieIndex - 1;
  
      while (previousIndex >= 0) {
        const previousMovie = this.filteredMovies[previousIndex];
        if (!this.isMovieInBlacklistArray(previousMovie.id)) {
          this.currentMovieIndex = previousIndex;
          break;
        }
        previousIndex--;
      }
    }
  }
  
  isMovieInBlacklistArray(movieId: number): boolean {
    return this.blacklistTemp.includes(movieId);
  }
 
  addToWatchlist(movieId: number) {
  // Obtén el token JWT almacenado en localStorage
  
    
    // Obtén la película actual de filteredMovies
  const currentMovie = this.filteredMovies[this.currentMovieIndex];

  // Llena el formulario con los datos de la película actual
  this.movieForm.patchValue({
    adult: currentMovie.adult,
    backdrop_path: currentMovie.backdrop_path,
    genre_ids: currentMovie.genre_ids,
    id: currentMovie.id,
    original_language: currentMovie.original_language,
    original_title: currentMovie.original_title,
    overview: currentMovie.overview,
    popularity: currentMovie.popularity,
    poster_path: currentMovie.poster_path,
    release_date: currentMovie.release_date,
    title: currentMovie.title,
    video: currentMovie.video,
    vote_average: currentMovie.vote_average,
    vote_count: currentMovie.vote_count,
  });
  
  console.log(this.movieForm.value);
  
  // Llama al servicio para agregar la película a la watchlist.
  this.movieService.addToWatchlist(this.movieForm.value).subscribe(
    (response) => {
      this.showErrorMessage(response.message);
      console.log(response.message); // Muestra un mensaje de éxito
      // Luego, navega al siguiente paso o realiza acciones necesarias
    },
    
      (error) => {
        if (error.status === 400 && error.error.message === 'La película ya está en tu watchlist') {
          this.showErrorMessage(error.error.message); // Muestra el mensaje de error
        } else {
          if (error.status === 401) {
            const dialogRef = this.dialog.open(AuthdialogComponent, {
              width: '400px', // Personaliza el ancho y otras propiedades del diálogo
            });
      
            dialogRef.afterClosed().subscribe((result) => {
              // Maneja la respuesta después de cerrar el diálogo modal
              console.log('Diálogo cerrado con resultado:', result);
              // Realiza acciones adicionales según sea necesario
            });
            
          } else {
          console.error('Error al anadir la pelicúla a watchlist', error);
          this.showErrorMessage('Error al anadir la pelicúla a watchlist');
        }
      }
      }
  );
  
    
    }
 
    
    addToBlacklist(movieId: number) {
      
        // Obtén la película actual de filteredMovies
      const currentMovie = this.filteredMovies[this.currentMovieIndex];
      
      // Llena el formulario con los datos de la película actual
  this.movieForm.patchValue({
    adult: currentMovie.adult,
    backdrop_path: currentMovie.backdrop_path,
    genre_ids: currentMovie.genre_ids,
    id: currentMovie.id,
    original_language: currentMovie.original_language,
    original_title: currentMovie.original_title,
    overview: currentMovie.overview,
    popularity: currentMovie.popularity,
    poster_path: currentMovie.poster_path,
    release_date: currentMovie.release_date,
    title: currentMovie.title,
    video: currentMovie.video,
    vote_average: currentMovie.vote_average,
    vote_count: currentMovie.vote_count,
  });
  
  console.log(this.movieForm.value);
      
      
      // Llama al servicio para agregar la película a la blacklist.
      this.movieService.addToBlacklist(this.movieForm.value).subscribe(
        (response) => {
          console.log(response.message);
          this.showErrorMessage(response.message);
          this.blacklistTemp.push(currentMovie.id);
          
          setTimeout(() => {
            this.showNextMovie();
          }, 500); // Muestra un mensaje de éxito
          // Luego, navega al siguiente paso o realiza acciones necesarias
        },
        (error) => {
          if (error.status === 400 && error.error.message === 'La película ya está en tu blacklist') {
            this.showErrorMessage(error.error.message); // Muestra el mensaje de error
          } else  {
              if (error.status === 401) {
                const dialogRef = this.dialog.open(AuthdialogComponent, {
                  width: '400px', // Personaliza el ancho y otras propiedades del diálogo
                });
          
                dialogRef.afterClosed().subscribe((result) => {
                  // Maneja la respuesta después de cerrar el diálogo modal
                  console.log('Diálogo cerrado con resultado:', result);
                  // Realiza acciones adicionales según sea necesario
                });
              
                
              } else {
            
            console.error('Error al añadir la película de la lista negra', error);
            this.showErrorMessage('Error al al añadir la película de la lista negra');
          }
        }
      }  );
        
      } 
  
      
      private showErrorMessage(message: string) {
        console.log("Call snackbar");
        this.snackBar.open(message, '', {
          duration: 1000, // Duración del mensaje en milisegundos (3 segundos)
          verticalPosition: 'top',
          horizontalPosition: 'center',
          panelClass: 'custom-mat-snack-bar',
        });
      }
   
}

