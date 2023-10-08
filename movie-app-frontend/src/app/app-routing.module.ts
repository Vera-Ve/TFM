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
import { BlacklistComponent } from './blacklist/blacklist.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { AuthGuard } from './auth.guard';

const routes: Routes = [
  { path: '', component: AuthComponent }, // Página de inicio de sesión
  { path: 'register', component: RegisterComponent }, // Página de registro
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard]}, 
  { path: 'subscription', component: SubscriptionComponent, canActivate: [AuthGuard] },// Página de selección de plataformas streaming
  { path: 'genre', component: GenreComponent,canActivate: [AuthGuard], }, 
  { path: 'duration', component: DurationComponent,canActivate: [AuthGuard],}, 
  { path: 'language', component: OriginalLanguageComponent,canActivate: [AuthGuard],}, 
  { path: 'search-results', component: SearchResultsComponent,canActivate: [AuthGuard],}, 
  { path: 'watchlist', component: WatchlistComponent,canActivate: [AuthGuard],}, 
  { path: 'blacklist', component: BlacklistComponent,canActivate: [AuthGuard],}, 
  { path: 'reset-password', component: ResetPasswordComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
