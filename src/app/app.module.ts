// src/app/app.module.ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms'; // FormGroup için gerekli
import { FormsModule } from '@angular/forms'; // [(ngModel)] için gerekli
import { CommonModule } from '@angular/common'; // ngClass gibi direktifler için gerekli
import { RouterModule } from '@angular/router'; // router-outlet için gerekli

import { AppRoutingModule } from './app-routing.module'; // AppRoutingModule'i import ediyoruz
import { AppComponent } from './app.component';

// Düzeltilen yollar: login ve tasinmaz-list doğrudan 'app/' altında
import { LoginComponent } from './login/login.component';
import { TasinmazListComponent } from './tasinmaz-list/tasinmaz-list.component';
import { TasinmazAddComponent } from './components/tasinmaz-add/tasinmaz-add.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    TasinmazListComponent,
    TasinmazAddComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule, // AppRoutingModule'i buraya import ediyoruz
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    // RouterModule'ü burada tekrar etmiyoruz çünkü AppRoutingModule zaten onu dışa aktarıyor
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
