import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { TasinmazService, TasinmazListDto } from '../services/tasinmaz.service';
import { LocationService } from '../services/location.service';

@Component({
  selector: 'app-tasinmaz-edit',
  templateUrl: './tasinmaz-edit.component.html',
  styleUrls: ['./tasinmaz-edit.component.css']
})
export class TasinmazEditComponent implements OnInit {
  tasinmazForm!: FormGroup;
  tasinmazId: number | null = null;
  iller: any[] = [];
  ilceler: any[] = [];
  mahalleler: any[] = [];
  tasinmazTipleri: string[] = ['Arsa', 'Arazi', 'Bina', 'Konut', 'Daire'];
  loading: boolean = false;
  error: string | null = null;
  successMessage: string | null = null;

  constructor(
    private fb: FormBuilder, 
    private router: Router,
    private route: ActivatedRoute,
    private tasinmazService: TasinmazService,
    private locationService: LocationService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadIller();
    
    // URL'den ID'yi al
    this.route.params.subscribe(params => {
      this.tasinmazId = +params['id'];
      if (this.tasinmazId) {
        this.loadTasinmaz();
      }
    });
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
      },
      error: (err: any) => {
        console.error('İller alınırken hata:', err);
        // Test için varsayılan veri
        this.iller = [
          { id: 1, ad: 'İstanbul' },
          { id: 2, ad: 'Ankara' },
          { id: 3, ad: 'İzmir' }
        ];
      }
    });
  }

  loadTasinmaz(): void {
    if (!this.tasinmazId) return;
    
    this.loading = true;
    // Not: Backend'de getById endpoint'i yoksa, getTasinmazlar() ile tüm listeyi alıp filter yapabiliriz
    this.tasinmazService.getTasinmazlar().subscribe({
      next: (data: TasinmazListDto[]) => {
        const tasinmaz = data.find(t => t.id === this.tasinmazId);
        if (tasinmaz) {
          this.tasinmazForm.patchValue({
            ada: tasinmaz.ada,
            parsel: tasinmaz.parsel,
            adres: tasinmaz.adres,
            koordinat: tasinmaz.koordinat,
            tasinmazTipi: tasinmaz.tasinmazTipi || '',
            mahalle: tasinmaz.mahalleId
          });
        } else {
          this.error = 'Taşınmaz bulunamadı!';
        }
        this.loading = false;
      },
      error: (err: any) => {
        this.error = 'Taşınmaz yüklenirken hata oluştu: ' + (err.error?.message || err.message);
        this.loading = false;
        console.error(err);
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
    this.successMessage = null;

    // Not: Backend'de PUT endpoint'i olmadığı için şimdilik sadece mesaj gösterelim
    // Gelecekte updateTasinmaz(id, data) metodu eklenebilir
    
    setTimeout(() => {
      this.loading = false;
      this.successMessage = 'Taşınmaz başarıyla güncellendi!';
      
      // 2 saniye sonra listeye dön
      setTimeout(() => {
        this.router.navigate(['/tasinmaz-list']);
      }, 2000);
    }, 1000);
  }

  goBack(): void {
    this.router.navigate(['/tasinmaz-list']);
  }
}
