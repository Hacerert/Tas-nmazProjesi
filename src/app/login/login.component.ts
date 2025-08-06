// src/app/login/login.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  username: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    // Eğer kullanıcı zaten giriş yapmış ve token'ı geçerliyse, rolüne göre yönlendir
    if (this.authService.isLoggedIn()) {
      this.redirectBasedOnRole();
    }
  }

  onLogin(): void {
    this.errorMessage = '';
    const credentials = { username: this.username, password: this.password };

    this.authService.login(credentials).subscribe({
      next: (res) => {
        // Başarılı giriş sonrası rolüne göre yönlendirme
        this.redirectBasedOnRole();
      },
      error: (error) => {
        console.error('❌ Giriş hatası:', error);
        this.errorMessage = 'Giriş başarısız. Lütfen kullanıcı adı ve şifrenizi kontrol edin.';
        if (error.error && error.error.message) {
          this.errorMessage = error.error.message;
        } else if (error.status === 401) {
          this.errorMessage = 'Geçersiz kullanıcı adı veya şifre.';
        } else if (error.status === 0) {
          this.errorMessage = 'Sunucuya ulaşılamadı. Backend çalışıyor mu?';
        }
      }
    });
  }

  /**
   * Kullanıcının rolüne göre uygun sayfaya yönlendirir
   */
  private redirectBasedOnRole(): void {
    const userRole = this.authService.getUserRole();
    
    if (userRole === 'Admin') {
      this.router.navigate(['/admin-dashboard']);
    } else {
      this.router.navigate(['/tasinmazlar']);
    }
  }
}
