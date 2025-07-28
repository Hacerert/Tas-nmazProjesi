// src/app/components/tasinmaz-add/tasinmaz-add.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TasinmazService, Tasinmaz } from '../../services/tasinmaz.service'; // Tasinmaz interface'ini de import ettik
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tasinmaz-add',
  templateUrl: './tasinmaz-add.component.html',
  styleUrls: ['./tasinmaz-add.component.css']
})
export class TasinmazAddComponent implements OnInit {
  tasinmazForm: FormGroup;
  message: string = '';
  isSuccess: boolean = false;

  constructor(
    private fb: FormBuilder,
    private tasinmazService: TasinmazService,
    private authService: AuthService,
    private router: Router
  ) {
    this.tasinmazForm = this.fb.group({
      il: ['', Validators.required],
      ilce: ['', Validators.required],
      mahalle: ['', Validators.required],
      ada: ['', Validators.required],
      parsel: ['', Validators.required],
      adres: ['', Validators.required],
      koordinat: ['', Validators.required],
      tasinmazTipi: ['', Validators.required] // TasinmazTipi alanı eklendi
    });
  }

  ngOnInit(): void {
    // Sayfa yüklendiğinde veya kullanıcı değiştiğinde gerekli başlangıç işlemleri
  }

  onSubmit(): void {
    this.message = '';
    this.isSuccess = false;

    // Formdaki tüm alanları dokunulmuş olarak işaretle ki validasyon mesajları görünsün
    this.tasinmazForm.markAllAsTouched();

    if (this.tasinmazForm.valid) {
      const userId = this.authService.getUserId();
      if (userId === null) {
        this.message = 'Kullanıcı ID\'si bulunamadı. Lütfen tekrar giriş yapın.';
        this.isSuccess = false;
        this.router.navigate(['/login']);
        return;
      }

      // Tasinmaz interface'ine uygun bir obje oluştur
      const newTasinmaz: Tasinmaz = { ...this.tasinmazForm.value, userId: userId };

      this.tasinmazService.addTasinmaz(newTasinmaz).subscribe({
        next: (response) => {
          this.message = 'Taşınmaz başarıyla eklendi!';
          this.isSuccess = true;
          this.tasinmazForm.reset(); // Formu sıfırla
          // Başarılı ekleme sonrası 2 saniye sonra taşınmazlar listesine yönlendir
          setTimeout(() => {
            this.router.navigate(['/tasinmazlar']);
          }, 2000);
        },
        error: (error) => {
          console.error('Taşınmaz eklenirken hata oluştu:', error);
          this.message = 'Taşınmaz eklenirken bir hata oluştu. Lütfen tekrar deneyin.';
          this.isSuccess = false;
          if (error.error && error.error.message) {
            this.message = error.error.message;
          } else if (error.status === 401) {
            this.message = 'Yetkisiz işlem. Lütfen tekrar giriş yapın.';
            this.authService.logout(); // Token süresi dolmuş olabilir
          } else if (error.status === 0) {
            this.message = 'Sunucuya ulaşılamadı. Backend çalışıyor mu?';
          }
        }
      });
    } else {
      this.message = 'Lütfen tüm alanları doğru şekilde doldurun.';
      this.isSuccess = false;
    }
  }
}
