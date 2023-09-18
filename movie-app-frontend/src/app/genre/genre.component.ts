import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http'; 

import { FilterService } from '../filter.service';
interface Genre {
  id: number;
  name: string;
  selected:boolean;
}
@Component({
  selector: 'app-genre',
  templateUrl: './genre.component.html',
  styleUrls: ['./genre.component.scss']
})
export class GenreComponent implements OnInit {
  genres: Genre[] = [];
  selectAll: boolean = false;

  constructor(private router: Router, private filterService: FilterService, private http: HttpClient) {}


  ngOnInit(): void {
    // Llama a la API de TMDb para obtener la lista de géneros
    this.http.get<any>('https://api.themoviedb.org/3/genre/movie/list', {
      params: {
        api_key: '78d37cb93c16264fe12628edbd4dfe86', // Reemplaza con tu API key de TMDb
        language: 'en', // Cambia al idioma deseado
      }
    }).subscribe(data => {
      // Procesa la respuesta y asigna los géneros
      if (data.genres) {
        this.genres = data.genres.map((genre: any) => ({ id: genre.id, name: genre.name, selected: false }));
      }
    });
  }


 
  setSelectAll(selected: boolean) {
    this.selectAll = selected;
    this.genres.forEach(genre => (genre.selected = selected));
    
  }
  someComplete(): boolean {
    
    return this.genres.filter(genre => genre.selected).length > 0 && !this.selectAll;
  }

  updateSelectAll() {
    this.selectAll =  this.genres.every(genre => genre.selected);
   
  }
  saveGenres() {
    const selectedGenres = this.genres.filter(genre => genre.selected);
    selectedGenres.forEach(genre => {
      const lowercaseName = genre.id; // Convierte el nombre a minúsculas
      this.filterService.genres.push(lowercaseName);
    });
    
    // Here, you can send the selected platforms to your backend or perform any other actions
    console.log('Selected generos:', this.filterService.genres);
  }
  navegateNext() {
    this.router.navigate(['/duration']); // Redirige al siguiente paso
  }
  saveAndNavigate() {
    this.saveGenres();
    this.navegateNext();
     // Sincroniza selectAll con el estado de los checkboxes individuales
     this.selectAll = this.genres.every(genres => genres.selected);
  }
  
 
 
  

}
