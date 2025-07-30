// src/app/app-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Bileşenlerin yolları, Get-ChildItem çıktısına göre KESİNLEŞTİRİLDİ:
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './components/register/register.component'; // YOL KESİNLEŞTİRİLDİ
import { TasinmazListComponent } from './tasinmaz-list/tasinmaz-list.component';
import { TasinmazAddComponent } from './components/tasinmaz-add/tasinmaz-add.component'; // YOL KESİNLEŞTİRİLDİ
import { TasinmazEditComponent } from './tasinmaz-edit/tasinmaz-edit.component';
import { AuthGuard } from './guards/auth.guard'; // Varsayım: guards altında

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'tasinmazlar', component: TasinmazListComponent, canActivate: [AuthGuard] },
  { path: 'tasinmaz-ekle', component: TasinmazAddComponent, canActivate: [AuthGuard] },
  { path: 'tasinmaz-duzenle/:id', component: TasinmazEditComponent, canActivate: [AuthGuard] },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
//uygulamadaki sayfalarnı nasıl erişileceğini gösteeriyor