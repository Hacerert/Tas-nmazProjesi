// src/app/components/user-edit/user-edit.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from '../../interfaces/user.interface'; // Merkezi User arayüzünü import ediyoruz!

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css']
})
export class UserEditComponent implements OnInit {
  userForm: FormGroup;
  userId: number | null = null;
  isNewUser: boolean = false;
  error: string | null = null;
  loading: boolean = true;
  roles: string[] = ['Admin', 'User'];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private authService: AuthService
  ) {
    this.userForm = this.fb.group({
      id: [null],
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]], // Email alanı formda kalmaya devam ediyor
      role: ['User', Validators.required],
      password: ['', Validators.minLength(6)],
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      if (idParam) {
        this.userId = +idParam;
        this.isNewUser = false;
        this.loadUser(this.userId);
        this.userForm.get('password')?.clearValidators();
        this.userForm.get('password')?.updateValueAndValidity();
      } else {
        this.isNewUser = true;
        this.loading = false;
        this.userForm.get('password')?.setValidators(Validators.required);
        this.userForm.get('password')?.updateValueAndValidity();
      }
    });

    this.authService.userRole$.subscribe(role => {
      if (role !== 'Admin') {
        alert('Bu sayfaya erişim yetkiniz yok. Yönetici olmalısınız.');
        this.router.navigate(['/tasinmazlar']);
      }
    });
  }

  loadUser(id: number): void {
    this.loading = true;
    this.error = null;
    this.userService.getUserById(id).subscribe({
      next: (user: User) => {
        this.userForm.patchValue({
          id: user.id,
          username: user.username,
          email: '', // <-- user.email yerine boş string atıyoruz, hata vermemesi için
          role: user.role
        });
        this.loading = false;
      },
      error: (err) => {
        console.error('Kullanıcı yüklenirken hata oluştu:', err);
        this.error = 'Kullanıcı yüklenirken bir hata oluştu: ' + (err.error?.message || err.message);
        this.loading = false;
        if (err.status === 401 || err.status === 403) {
          this.authService.logout();
          this.router.navigate(['/login']);
        } else if (err.status === 404) {
          this.error = 'Kullanıcı bulunamadı.';
        }
      }
    });
  }

  onSubmit(): void {
    if (this.userForm.invalid) {
      this.error = 'Lütfen tüm alanları doğru şekilde doldurun.';
      this.userForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.error = null;

    const userData = this.userForm.value;

    if (this.isNewUser) {
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
    } else {
      this.userService.updateUser(this.userId!, userData).subscribe({
        next: () => {
          alert('Kullanıcı başarıyla güncellendi!');
          this.router.navigate(['/admin-dashboard']);
        },
        error: (err) => {
          console.error('Kullanıcı güncellenirken hata oluştu:', err);
          this.error = 'Kullanıcı güncellenirken bir hata oluştu: ' + (err.error?.message || err.message);
          this.loading = false;
          if (err.status === 401 || err.status === 403) {
            this.authService.logout();
            this.router.navigate(['/login']);
          }
        }
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/admin-dashboard']);
  }
}
