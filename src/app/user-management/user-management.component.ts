// src/app/user-management/user-management.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserService } from '../services/user.service'; // Kullanıcı servisi
import { AuthService } from '../services/auth.service'; // Kimlik doğrulama servisi
import { Router } from '@angular/router'; // Router import edildi
import { Subscription } from 'rxjs';

// Kullanıcı arayüzü (interface) tanımlandı
interface User {
  id: number;
  username: string;
  role: string;
  // Diğer kullanıcı özellikleri buraya eklenebilir (örneğin email, vs.)
}

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit, OnDestroy {
  users: User[] = [];
  loading: boolean = true;
  error: string | null = null;
  private userRoleSubscription: Subscription | undefined;

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private router: Router // Router enjekte edildi
  ) { }

  ngOnInit(): void {
    this.userRoleSubscription = this.authService.userRole$.subscribe(role => {
      if (role !== 'Admin') {
        this.router.navigate(['/tasinmazlar']);
      } else {
        this.loadUsers();
      }
    });
  }

  ngOnDestroy(): void {
    if (this.userRoleSubscription) {
      this.userRoleSubscription.unsubscribe();
    }
  }
  loadUsers(): void {
    this.loading = true;
    this.error = null;
    this.userService.getAllUsers().subscribe({
      next: (data: User[]) => {
        this.users = data;
        this.loading = false;
        console.log('Kullanıcılar başarıyla yüklendi:', this.users);
      },
      error: (err: any) => {
        console.error('Kullanıcılar yüklenirken hata oluştu:', err);
        this.error = 'Kullanıcılar yüklenirken bir hata oluştu: ' + (err.error?.message || err.message);
        this.loading = false;
        if (err.status === 401 || err.status === 403) {
          this.authService.logout();
          this.router.navigate(['/login']);
        }
      }
    });
  }

  deleteUser(userId: number): void {
    if (confirm('Bu kullanıcıyı silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.')) {
      this.userService.deleteUser(userId).subscribe({
        next: () => {
          alert('Kullanıcı başarıyla silindi.');
          this.loadUsers();
        },
        error: (err: any) => {
          console.error('Kullanıcı silinirken hata oluştu:', err);
          this.error = 'Kullanıcı silinirken bir hata oluştu: ' + (err.error?.message || err.message);
          if (err.status === 401 || err.status === 403) {
            this.authService.logout();
            this.router.navigate(['/login']);
          }
        }
      });
    }
  }

  // YENİ EKLENEN/DÜZELTİLEN: Kullanıcı düzenleme metodu
  editUser(userId: number): void {
    console.log('Kullanıcı düzenleme sayfasına yönlendiriliyor:', userId);
    this.router.navigate(['/admin/users/edit', userId]); // Kullanıcı düzenleme sayfasına yönlendir
  }

  // YENİ EKLENEN: Yeni kullanıcı ekleme metodu
  addNewUser(): void {
    console.log('Yeni kullanıcı ekleme sayfasına yönlendiriliyor.');
    this.router.navigate(['/admin/users/add']); // Yeni kullanıcı ekleme sayfasına yönlendir
  }

  logout(): void {
    console.log('🚪 UserManagement - Logout butonuna tıklandı');
    this.authService.logout();
    console.log('🔄 UserManagement - Login sayfasına yönlendiriliyor...');
    
    // Router navigation dene, başarısız olursa window.location kullan
    this.router.navigate(['/login']).then(() => {
      console.log('✅ UserManagement - Login sayfasına başarıyla yönlendirildi');
    }).catch((error) => {
      console.error('❌ UserManagement - Router navigation hatası:', error);
      console.log('🔄 UserManagement - Window.location ile yönlendiriliyor...');
      window.location.href = '/login';
    });
  }
}
