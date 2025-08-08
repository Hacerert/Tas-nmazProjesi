// src/app/app.module.ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms'; // [formGroup] için gerekli
import { FormsModule } from '@angular/forms'; // [(ngModel)] ve #ngForm için gerekli

import { AppRoutingModule } from './app-routing.module'; // Kendi routing modülümüz
import { AppComponent } from './app.component';

// Bileşenlerin yolları, Get-ChildItem çıktısına göre KESİNLEŞTİRİLDİ:
// (Ekran görüntülerinizdeki dosya yapınıza göre bu yolların doğru olduğunu varsayıyorum)
import { LoginComponent } from './login/login.component'; // components klasörü altında
import { RegisterComponent } from './components/register/register.component'; // components klasörü altında
import { TasinmazListComponent } from './tasinmaz-list/tasinmaz-list.component'; // components klasörü altında
import { TasinmazAddComponent } from './components/tasinmaz-add/tasinmaz-add.component'; // components klasörü altında
import { TasinmazEditComponent } from './tasinmaz-edit/tasinmaz-edit.component'; // components klasörü altında
import { UserManagementComponent } from './user-management/user-management.component'; // app klasörü altında

import { JwtModule } from '@auth0/angular-jwt';
import { UserEditComponent } from './components/user-edit/user-edit.component'; // <-- BU SATIR DOĞRU
import { UserAddComponent } from './components/user-add/user-add.component'; // Yeni eklenen UserAddComponent

// JWT token'ının nerede saklandığını belirtiyoruz.
export function tokenGetter() {
  return localStorage.getItem('jwt_token');
}

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    TasinmazListComponent,
    TasinmazAddComponent,
    TasinmazEditComponent,
    UserManagementComponent,
    UserEditComponent,
    UserAddComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule, // Kendi routing modülümüzü buraya import ediyoruz
    HttpClientModule,
    ReactiveFormsModule, // Formlar için
    FormsModule,         // Template-driven formlar için (login gibi)
    // CommonModule ve RouterModule genellikle AppRoutingModule veya BrowserModule tarafından sağlanır.
    // Eğer hata almazsanız bu şekilde bırakabilirsiniz.
    
    JwtModule.forRoot({ // <-- BU KISIM ÇOK ÖNEMLİ! Buraya eklenmeliydi!
      config: {
        tokenGetter: tokenGetter,
        allowedDomains: ['localhost:5000'], // Backend domain'inizi buraya ekleyin
        disallowedRoutes: []
      }
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
