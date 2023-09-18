import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class FilterService {
  subscriptions: string[] = [];
  genres: number[] = [];
  minDuration: number =0;
  maxDuration: number =0;
 
  languages: string[] = [];

  clearFilters() {
    this.subscriptions = [];
    this.genres = [];
    this.minDuration =0;
    this.maxDuration =0;
    this.languages = [];
  }
}
