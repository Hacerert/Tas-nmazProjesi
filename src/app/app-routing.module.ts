// src/app/app-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Bileşenlerin yolları, sizin dosya yapınıza göre düzeltildi:
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { TasinmazListComponent } from './tasinmaz-list/tasinmaz-list.component';
import { TasinmazAddComponent } from './components/tasinmaz-add/tasinmaz-add.component';
import { TasinmazEditComponent } from './tasinmaz-edit/tasinmaz-edit.component';
import { UserManagementComponent } from './user-management/user-management.component';

// YENİ EKLENEN: UserEditComponent'i import et
import { UserEditComponent } from './components/user-edit/user-edit.component';
// YENİ EKLENEN: UserAddComponent'i import et
import { UserAddComponent } from './components/user-add/user-add.component';

// AuthGuard'ı import et
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  // Admin paneli rotaları - AuthGuard ile korunuyor
  { path: 'admin-dashboard', component: UserManagementComponent, canActivate: [AuthGuard] },
  // YENİ EKLENEN: Kullanıcı düzenleme rotası (id ile)
  { path: 'admin/users/edit/:id', component: UserEditComponent, canActivate: [AuthGuard] },
  // YENİ EKLENEN: Yeni kullanıcı ekleme rotası (id olmadan) - Ayrı component kullanıyor
  { path: 'admin/users/add', component: UserAddComponent, canActivate: [AuthGuard] },


  // Normal kullanıcılar için taşınmaz rotaları - AuthGuard ile korunuyor
  { path: 'tasinmazlar', component: TasinmazListComponent, canActivate: [AuthGuard] },
  { path: 'tasinmaz-ekle', component: TasinmazAddComponent, canActivate: [AuthGuard] },
  { path: 'tasinmaz-duzenle/:id', component: TasinmazEditComponent, canActivate: [AuthGuard] },

  // Varsayılan yönlendirme:
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
