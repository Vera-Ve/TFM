import { Component, OnInit, ViewChild, ElementRef, Inject  } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';


import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

import { MatChipInputEvent } from '@angular/material/chips';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { FormControl } from '@angular/forms';

import { FilterService } from '../filter.service';

interface Language {
  english_name: string;
  iso_639_1: string;
  name: string;
  selected: boolean;
}

@Component({
  selector: 'app-original-language',
  templateUrl: './original-language.component.html',
  styleUrls: ['./original-language.component.scss']
})
export class OriginalLanguageComponent implements OnInit {
  filteredLanguages: Observable<any[]>;
  languageCtrl = new FormControl('');
  languages: Language[] = [];
  selectedLanguages: any[] = [];
  isNextButtonDisabled = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  @ViewChild('languageInput') languageInput!: ElementRef<HTMLInputElement>;
  announcer: LiveAnnouncer;

  constructor(private router: Router, private http: HttpClient, @Inject(LiveAnnouncer) announcer: LiveAnnouncer, private filterService: FilterService) {
    this.announcer = announcer;
    this.filteredLanguages = this.languageCtrl.valueChanges.pipe(
      startWith(null),
      map((value: string | null) => (value ? this._filter(value) : this.languages.slice()))
        
     
    );
  }

  ngOnInit() {
    // Realiza la solicitud HTTP para obtener la lista de idiomas desde la API
    this.http.get<any[]>('https://api.themoviedb.org/3/configuration/languages?api_key=78d37cb93c16264fe12628edbd4dfe86').subscribe(
      (response) => {
        // Asigna los idiomas a la variable 'languages' después de recibir la respuesta
        this.languages = response;
        // Agrega la propiedad 'selected' a cada idioma
        this.languages.forEach((language) => (language.selected = false));
      },
      (error) => {
        console.error('Error al obtener los idiomas:', error);
      }
    );
  }


  saveLanguages() {
    this.selectedLanguages.forEach(language => {this.filterService.languages.push(language.iso_639_1);
    });
    // Here, you can send the selected platforms to your backend or perform any other actions
    console.log('Selected languages:', this.filterService.languages);
  }
  navegateNext() {
    this.router.navigate(['/search-results']); // Redirige al siguiente paso
  }
  saveAndNavigate() {
    this.saveLanguages();
    this.navegateNext();
     
     
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    const selectedLanguage = this.languages.find(Language => Language.english_name === value);
    if (value)  {
      if (selectedLanguage) {
      this.selectedLanguages.push({ english_name : value,
        iso_639_1: selectedLanguage.iso_639_1,
        name: selectedLanguage.name,
         selected: true });
    }
  }
    console.log(this.selectedLanguages);
    event.chipInput!.clear();
    this.languageCtrl.setValue(null);
  }

  removeChip(language: Language): void {
    const index = this.selectedLanguages.indexOf(language);

    if (index >= 0) {
      this.selectedLanguages.splice(index, 1);
      this.announcer.announce(`Removed ${language.english_name}`);
      this.updateNextButtonState();
    }
  }
  selected(event: MatAutocompleteSelectedEvent): void {
    const selectedLanguage = this.languages.find(Language => Language.english_name === event.option.viewValue);
    if (selectedLanguage) {
      this.selectedLanguages.push({
          english_name: selectedLanguage.english_name,
          iso_639_1: selectedLanguage.iso_639_1,
          name: selectedLanguage.name,
          selected: true,
      });
      this.updateNextButtonState();
  } else {
      // Manejar el caso en que no se encontró la plataforma
      console.error(`No se encontró la plataforma con el nombre: ${event.option.viewValue}`);
  }
    this.languageInput.nativeElement.value = '';
    this.languageCtrl.setValue(null);
    console.log(this.selectedLanguages);
  }

  private updateNextButtonState(): void {
    console.log("Update next button call");
    this.isNextButtonDisabled = this.selectedLanguages.length === 0;
    console.log(this.isNextButtonDisabled);
  }

  private _filter(value: string): any[] {
    const filterValue = (value).toLowerCase();
    

    return this.languages.filter((language) =>
    language.english_name.toLowerCase().includes(filterValue)
    );
  }
}
