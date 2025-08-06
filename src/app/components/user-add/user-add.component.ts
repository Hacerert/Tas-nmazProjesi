// src/app/components/user-add/user-add.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-user-add',
  templateUrl: './user-add.component.html',
  styleUrls: ['./user-add.component.css']
})
export class UserAddComponent implements OnInit {
  userForm: FormGroup;
  error: string | null = null;
  loading: boolean = false;
  roles: string[] = ['Admin', 'User'];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.userForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      role: ['User', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit(): void {
    // Admin kontrolü yap
    this.authService.userRole$.subscribe(role => {
      if (role !== 'Admin') {
        alert('Bu sayfaya erişim yetkiniz yok. Yönetici olmalısınız.');
        this.router.navigate(['/tasinmazlar']);
      }
    });
  }

  // Şifre eşleşme kontrolü
  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');
    
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      return { passwordMismatch: true };
    }
    return null;
  }

  onSubmit(): void {
    if (this.userForm.invalid) {
      this.error = 'Lütfen tüm alanları doğru şekilde doldurun.';
      this.userForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.error = null;

    const userData = {
      username: this.userForm.value.username,
      email: this.userForm.value.email,
      role: this.userForm.value.role,
      password: this.userForm.value.password
    };

    this.authService.register(userData).subscribe({
      next: (response) => {
        alert('Kullanıcı başarıyla eklendi!');
        this.router.navigate(['/admin-dashboard']);
      },
      error: (err) => {
        console.error('Kullanıcı eklenirken hata oluştu:', err);
        this.error = 'Kullanıcı eklenirken bir hata oluştu: ' + (err.error?.message || err.message);
        this.loading = false;
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/admin-dashboard']);
  }

  // Form kontrolü için yardımcı metodlar
  get username() { return this.userForm.get('username'); }
  get email() { return this.userForm.get('email'); }
  get role() { return this.userForm.get('role'); }
  get password() { return this.userForm.get('password'); }
  get confirmPassword() { return this.userForm.get('confirmPassword'); }
}