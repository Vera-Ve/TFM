import { Component, OnInit, ViewChild, ElementRef, Inject } from '@angular/core';
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

interface SubscriptionProvider {
  provider_name: string;
  provider_id: number;
  selected: boolean;
}

@Component({
  selector: 'app-subscription',
  templateUrl: './subscription.component.html',
  styleUrls: ['./subscription.component.scss'],
})
export class SubscriptionComponent implements OnInit {
  filteredPlatforms: Observable<any[]>;
  platformCtrl = new FormControl('');
  platforms: SubscriptionProvider[] = [];
  selectedPlatforms: SubscriptionProvider[] = [];
  isNextButtonDisabled = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  @ViewChild('platformInput') platformInput!: ElementRef<HTMLInputElement>;
  announcer: LiveAnnouncer;

  constructor(private router: Router, private http: HttpClient, @Inject(LiveAnnouncer) announcer: LiveAnnouncer, private filterService: FilterService) {
    this.announcer = announcer;
    this.filteredPlatforms = this.platformCtrl.valueChanges.pipe(
      startWith(null),
      map((value: string | null) => (value ? this._filter(value) : this.platforms.slice()))
        
     
    );
  }

  ngOnInit() {
    this.http
      .get<{ results: SubscriptionProvider[] }>(
        'https://api.themoviedb.org/3/watch/providers/movie?api_key=78d37cb93c16264fe12628edbd4dfe86'
      )
      .subscribe(
        (response) => {
          this.platforms = response.results.map((result) => ({
            provider_name: result.provider_name,
            provider_id: result.provider_id,
            selected: false,
          }));
        },
        (error) => {
          console.error('Error al obtener los nombres de suscripciones:', error);
        }
      );
  }

  selectAll: boolean = false;

  

  saveSubscriptions() {
    this.selectedPlatforms.forEach(platform => {this.filterService.subscriptions.push(platform.provider_name);
    });
   
    console.log('Selected platforms:',this.filterService.subscriptions);
  }

  navegarSiguiente() {
    this.router.navigate(['/genre']);
  }

  saveAndNavigate() {
    this.saveSubscriptions();
    this.navegarSiguiente();
    
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    if (value)  {
      this.selectedPlatforms.push({ provider_name: value, provider_id: 0, selected: true });
      
    
    }
    console.log(this.selectedPlatforms);
    event.chipInput!.clear();
    this.platformCtrl.setValue(null);
   
    
  }

  removeChip(platform: SubscriptionProvider): void {
    const index = this.selectedPlatforms.indexOf(platform);

    if (index >= 0) {
      this.selectedPlatforms.splice(index, 1);
      this.announcer.announce(`Removed ${platform.provider_name}`);
    }
    this.updateNextButtonState();
  }

  private updateNextButtonState(): void {
    console.log("Update next button call");
    this.isNextButtonDisabled = this.selectedPlatforms.length === 0;
    console.log(this.isNextButtonDisabled);
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    const selectedPlatform = this.platforms.find(platform => platform.provider_name === event.option.viewValue);
    if (selectedPlatform) {
      this.selectedPlatforms.push({
          provider_name: selectedPlatform.provider_name,
          provider_id: selectedPlatform.provider_id, // Usamos el ID real
          selected: true,
      });
      this.updateNextButtonState();
      
  } else {
      // Manejar el caso en que no se encontró la plataforma
      console.error(`No se encontró la plataforma con el nombre: ${event.option.viewValue}`);
  }
    this.platformInput.nativeElement.value = '';
    this.platformCtrl.setValue(null);
    console.log(this.selectedPlatforms);
  }

  private _filter(value: string): SubscriptionProvider[] {
    const filterValue = (value).toLowerCase();
    

    return this.platforms.filter((platform) =>
      platform.provider_name.toLowerCase().includes(filterValue)
    );
  }
}
