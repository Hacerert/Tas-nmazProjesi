import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Component imports
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { TasinmazListComponent } from './tasinmaz-list/tasinmaz-list.component'; 
import { TasinmazAddComponent } from './components/tasinmaz-add/tasinmaz-add.component'; 
import { TasinmazEditComponent } from './tasinmaz-edit/tasinmaz-edit.component';
import { UserManagementComponent } from './user-management/user-management.component';
import { UserEditComponent } from './components/user-edit/user-edit.component';
import { UserAddComponent } from './components/user-add/user-add.component';

// Guards
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  // Ana sayfa
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  
  // Auth rotaları
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  // Admin rotaları - AuthGuard ile korunuyor
  { path: 'admin-dashboard', component: UserManagementComponent, canActivate: [AuthGuard] },
  { path: 'admin/users/edit/:id', component: UserEditComponent, canActivate: [AuthGuard] },
  { path: 'admin/users/add', component: UserAddComponent, canActivate: [AuthGuard] },

  // Taşınmaz rotaları - AuthGuard ile korunuyor
  { path: 'tasinmazlar', component: TasinmazListComponent, canActivate: [AuthGuard] },
  { path: 'tasinmaz-list', component: TasinmazListComponent, canActivate: [AuthGuard] },
  { path: 'tasinmaz-add', component: TasinmazAddComponent, canActivate: [AuthGuard] },
  { path: 'tasinmaz-ekle', component: TasinmazAddComponent, canActivate: [AuthGuard] },
  { path: 'tasinmaz-edit/:id', component: TasinmazEditComponent, canActivate: [AuthGuard] },
  { path: 'tasinmaz-duzenle/:id', component: TasinmazEditComponent, canActivate: [AuthGuard] },

  // Catch-all route
  { path: '**', redirectTo: '/login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
