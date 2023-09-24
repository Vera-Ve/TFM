import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthComponent } from './auth/auth.component';

import { MatFormFieldModule } from '@angular/material/form-field'; 

import { MatInputModule } from '@angular/material/input'; 
import {MatCheckboxModule} from '@angular/material/checkbox';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import { MatListModule } from '@angular/material/list';
import {MatChipsModule} from '@angular/material/chips';
import { MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatIconModule} from '@angular/material/icon';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatToolbarModule} from '@angular/material/toolbar';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import {MatDialogModule} from '@angular/material/dialog';

import { RegisterComponent } from './register/register.component';
import { SubscriptionComponent } from './subscription/subscription.component';
import { GenreComponent } from './genre/genre.component';
import { DurationComponent } from './duration/duration.component';
import { OriginalLanguageComponent } from './original-language/original-language.component';
import { HomeComponent } from './home/home.component';
import { SearchResultsComponent } from './search-results/search-results.component';
import { WatchlistComponent } from './watchlist/watchlist.component';
import { NavbarComponent } from './navbar/navbar.component';
import { BlacklistComponent } from './blacklist/blacklist.component';
import { AuthdialogComponent } from './authdialog/authdialog.component'; 

@NgModule({
  declarations: [
    AppComponent,
    AuthComponent,
    RegisterComponent,
    SubscriptionComponent,
    GenreComponent,
    DurationComponent,
    OriginalLanguageComponent,
    HomeComponent,
    SearchResultsComponent,
    WatchlistComponent,
    NavbarComponent,
    BlacklistComponent,
    AuthdialogComponent,
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule, 
    MatCheckboxModule,
    MatButtonToggleModule,
    MatListModule,
    MatChipsModule,
    MatAutocompleteModule,
    MatIconModule,
    MatPaginatorModule,
    MatGridListModule,
    MatTooltipModule,
    MatToolbarModule,
    MatSnackBarModule,
    MatDialogModule,
    
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
