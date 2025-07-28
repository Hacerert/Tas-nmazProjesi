// src/app/app-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Düzeltilen yollar: login ve tasinmaz-list doğrudan 'app/' altında
import { LoginComponent } from './login/login.component';
import { TasinmazListComponent } from './tasinmaz-list/tasinmaz-list.component';
import { AuthGuard } from './guards/auth.guard'; // Bu yol klasör yapına göre doğru

import { TasinmazAddComponent } from './components/tasinmaz-add/tasinmaz-add.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'tasinmazlar', component: TasinmazListComponent, canActivate: [AuthGuard] },
  { path: 'tasinmaz-ekle', component: TasinmazAddComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: '/login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
