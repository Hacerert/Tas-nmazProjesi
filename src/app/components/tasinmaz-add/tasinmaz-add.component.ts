// src/app/components/tasinmaz-add/tasinmaz-add.component.ts
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TasinmazService, TasinmazAddRequest } from 'src/app/services/tasinmaz.service';
import { LocationService } from 'src/app/services/location.service';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tasinmaz-add',
  templateUrl: './tasinmaz-add.component.html',
  styleUrls: ['./tasinmaz-add.component.css']
})
export class TasinmazAddComponent implements OnInit {
  tasinmazForm!: FormGroup;
  iller: any[] = [];
  ilceler: any[] = [];
  mahalleler: any[] = [];
  tasinmazTipleri: string[] = ['Arsa', 'Arazi', 'Bina', 'Konut', 'Daire'];
  error: string | null = null;
  loading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private tasinmazService: TasinmazService,
    private locationService: LocationService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadIller();
  }

  initForm(): void {
    this.tasinmazForm = this.fb.group({
      il: ['', Validators.required],
      ilce: ['', Validators.required],
      mahalle: ['', Validators.required],
      ada: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
      parsel: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
      adres: ['', Validators.required],
      koordinat: ['', Validators.required],
      tasinmazTipi: ['', Validators.required],
    });
  }

  loadIller(): void {
    this.locationService.getIller().subscribe({
      next: (data: any) => {
        this.iller = data;
        console.log('İller yüklendi:', data);
      },
      error: (err: any) => {
        console.error('İller alınırken hata:', err);
        this.error = 'İller alınamadı. Backend service kontrol edin.';
        // Test için varsayılan veri
        this.iller = [
          { id: 1, ad: 'İstanbul' },
          { id: 2, ad: 'Ankara' },
          { id: 3, ad: 'İzmir' }
        ];
      }
    });
  }

  onIlChange(): void {
    const ilId = this.tasinmazForm.get('il')?.value;
    if (ilId) {
      this.locationService.getIlceler(ilId).subscribe({
        next: (data: any) => {
          this.ilceler = data;
          this.mahalleler = [];
          this.tasinmazForm.get('ilce')?.setValue('');
          this.tasinmazForm.get('mahalle')?.setValue('');
        },
        error: (err: any) => {
          console.error('İlçeler alınırken hata:', err);
          // Test için varsayılan veri
          this.ilceler = [
            { id: 1, ad: 'Merkez', ilId: ilId },
            { id: 2, ad: 'Batı', ilId: ilId }
          ];
        }
      });
    } else {
      this.ilceler = [];
      this.mahalleler = [];
    }
  }

  onIlceChange(): void {
    const ilceId = this.tasinmazForm.get('ilce')?.value;
    if (ilceId) {
      this.locationService.getMahalleler(ilceId).subscribe({
        next: (data: any) => {
          this.mahalleler = data;
          this.tasinmazForm.get('mahalle')?.setValue('');
        },
        error: (err: any) => {
          console.error('Mahalleler alınırken hata:', err);
          // Test için varsayılan veri
          this.mahalleler = [
            { id: 1, ad: 'Test Mahalle 1', ilceId: ilceId },
            { id: 2, ad: 'Test Mahalle 2', ilceId: ilceId }
          ];
        }
      });
    } else {
      this.mahalleler = [];
    }
  }

  onSubmit(): void {
    if (this.tasinmazForm.invalid) {
      this.tasinmazForm.markAllAsTouched();
      this.error = 'Lütfen tüm alanları doğru şekilde doldurunuz.';
      return;
    }

    this.loading = true;
    this.error = null;

    const userId = this.authService.getUserId();
    if (!userId) {
      this.error = 'Kullanıcı oturumu bulunamadı. Lütfen tekrar giriş yapın.';
      this.loading = false;
      this.router.navigate(['/login']);
      return;
    }

    const newTasinmaz: TasinmazAddRequest = {
      ilId: this.tasinmazForm.get('il')?.value,
      ilceId: this.tasinmazForm.get('ilce')?.value,
      mahalleId: this.tasinmazForm.get('mahalle')?.value,
      ada: this.tasinmazForm.get('ada')?.value,
      parsel: this.tasinmazForm.get('parsel')?.value,
      adres: this.tasinmazForm.get('adres')?.value,
      koordinat: this.tasinmazForm.get('koordinat')?.value,
      tasinmazTipi: this.tasinmazForm.get('tasinmazTipi')?.value,
      userId: userId
    };

    this.tasinmazService.addTasinmaz(newTasinmaz).subscribe({
      next: (response) => {
        console.log('Taşınmaz başarıyla eklendi:', response);
        alert('Taşınmaz başarıyla eklendi!');
        this.loading = false;
        this.router.navigate(['/tasinmazlarim']);
      },
      error: (err) => {
        console.error('Taşınmaz eklenirken bir hata oluştu:', err);
        this.loading = false;
        this.error = 'Taşınmaz eklenirken bir hata oluştu: ' + (err.error?.message || err.message);
      }
    });
  }
}
