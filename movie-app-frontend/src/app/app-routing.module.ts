import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './auth/auth.component';
import { RegisterComponent } from './register/register.component';
import { HomeComponent } from './home/home.component';
import { SubscriptionComponent } from './subscription/subscription.component';
import { GenreComponent } from './genre/genre.component';
import { DurationComponent } from './duration/duration.component';
import { OriginalLanguageComponent } from './original-language/original-language.component';
import { SearchResultsComponent } from './search-results/search-results.component';
import { WatchlistComponent } from './watchlist/watchlist.component';

const routes: Routes = [
  { path: '', component: AuthComponent }, // Página de inicio de sesión
  { path: 'register', component: RegisterComponent }, // Página de registro
  { path: 'home', component: HomeComponent}, 
  { path: 'subscription', component: SubscriptionComponent },// Página de selección de plataformas streaming
  { path: 'genre', component: GenreComponent }, 
  { path: 'duration', component: DurationComponent}, 
  { path: 'language', component: OriginalLanguageComponent}, 
  { path: 'search-results', component: SearchResultsComponent}, 
  { path: 'watchlist', component: WatchlistComponent}, 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
