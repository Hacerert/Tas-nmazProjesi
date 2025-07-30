// src/app/app.module.ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms'; // [formGroup] için gerekli
import { FormsModule } from '@angular/forms'; // [(ngModel)] ve #ngForm için gerekli
import { CommonModule } from '@angular/common'; // *ngIf, [ngClass] gibi direktifler için gerekli
import { RouterModule } from '@angular/router'; // router-outlet ve [routerLink] için gerekli

import { AppRoutingModule } from './app-routing.module'; // Kendi routing modülümüz
import { AppComponent } from './app.component';

// Bileşenlerin yolları, Get-ChildItem çıktısına göre KESİNLEŞTİRİLDİ:
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './components/register/register.component'; // YOL KESİNLEŞTİRİLDİ
import { TasinmazListComponent } from './tasinmaz-list/tasinmaz-list.component';
import { TasinmazAddComponent } from './components/tasinmaz-add/tasinmaz-add.component'; // YOL KESİNLEŞTİRİLDİ
import { TasinmazEditComponent } from './tasinmaz-edit/tasinmaz-edit.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    TasinmazListComponent,
    TasinmazAddComponent,
    TasinmazEditComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule, // Kendi routing modülümüzü buraya import ediyoruz
    HttpClientModule,
    ReactiveFormsModule, // Formlar için
    FormsModule,         // Template-driven formlar için (login gibi)
    CommonModule,        // *ngIf, [ngClass] gibi temel direktifler için
    RouterModule         // router-outlet ve [routerLink] için (AppRoutingModule içinde de var ama burada da olması önemli)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
