// src/app/tasinmaz-list/tasinmaz-list.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { TasinmazService, Tasinmaz } from '../services/tasinmaz.service';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-tasinmaz-list',
  templateUrl: './tasinmaz-list.component.html',
  styleUrls: ['./tasinmaz-list.component.css']
})
export class TasinmazListComponent implements OnInit, OnDestroy {

  tasinmazlar: Tasinmaz[] = [];
  loading: boolean = true;
  error: string | null = null;
  private userIdSubscription: Subscription | undefined;

  constructor(
    private tasinmazService: TasinmazService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    // userId$ observable'ına abone oluyoruz.
    // Kullanıcı ID'si değiştiğinde veya yüklendiğinde loadTasinmazlar'ı çağıracağız.
    this.userIdSubscription = this.authService.userId$.subscribe(userId => {
      console.log('TasinmazListComponent (ngOnInit): userId$ güncellendi:', userId);
      if (userId !== null) { // userId null değilse (yani geçerli bir ID varsa)
        this.loadTasinmazlar(userId);
      } else {
        // userId null ise ve zaten tasinmazlar sayfasındaysak, login sayfasına yönlendir
        // Bu durum, token süresi dolduğunda veya logout yapıldığında tetiklenebilir
        if (this.authService.isAuthenticated()) {
          // Eğer isAuthenticated() true dönüyorsa ama userId null ise bu bir hata durumudur, konsola logla
          console.error('TasinmazListComponent: isAuthenticated true olmasına rağmen userId null.');
        } else {
          console.log('TasinmazListComponent: Kullanıcı ID null ve kimlik doğrulaması yapılmamış, login sayfasına yönlendiriliyor.');
          this.router.navigate(['/login']);
        }
        this.loading = false; // Yükleme durumunu kapat
        this.tasinmazlar = []; // Tabloyu temizle
        this.error = 'Kullanıcı oturumu bulunamadı veya geçersiz.';
      }
    });
  }

  ngOnDestroy(): void {
    // Bellek sızıntılarını önlemek için aboneliği iptal et
    if (this.userIdSubscription) {
      this.userIdSubscription.unsubscribe();
    }
  }

  /**
   * Backend'den taşınmaz verilerini çeker.
   * @param userId Taşınmazları çekilecek kullanıcının ID'si.
   */
  loadTasinmazlar(userId: number): void {
    this.loading = true;
    this.error = null;

    console.log('TasinmazListComponent (loadTasinmazlar): Taşınmazlar yükleniyor, Kullanıcı ID:', userId);

    this.tasinmazService.getKullaniciTasinmazlarim(userId).subscribe({
      next: (data) => {
        this.tasinmazlar = data;
        this.loading = false;
        console.log('TasinmazListComponent (loadTasinmazlar): Taşınmazlar başarıyla yüklendi:', this.tasinmazlar);
      },
      error: (err) => {
        this.error = 'Taşınmazlar alınırken bir hata oluştu. Lütfen konsolu kontrol edin.';
        this.loading = false;
        console.error('TasinmazListComponent (loadTasinmazlar): Taşınmazlar alınırken hata:', err);
        if (err.status === 401) {
          this.authService.logout();
        } else if (err.status === 404) {
          this.error = 'Bu kullanıcıya ait taşınmaz bulunamadı.'; // 404 için daha spesifik mesaj
          this.tasinmazlar = []; // Tabloyu boşalt
        }
      }
    });
  }

  /**
   * "Düzenle" butonuna tıklandığında çalışır.
   * @param id Düzenlenecek taşınmazın ID'si.
   */
  editTasinmaz(id: number): void {
    console.log('Düzenlenecek Taşınmaz ID:', id);
    this.router.navigate(['/tasinmaz-duzenle', id]); // Bu rota henüz tanımlı değil, sonra tanımlayacağız
  }

  /**
   * "Sil" butonuna tıklandığında çalışır.
   * @param id Silinecek taşınmazın ID'si.
   */
  deleteTasinmaz(id: number): void {
    if (confirm('Bu taşınmazı silmek istediğinizden emin misiniz?')) {
      console.log('Silinecek Taşınmaz ID:', id);
      this.tasinmazService.deleteTasinmaz(id).subscribe({
        next: () => {
          console.log('Taşınmaz başarıyla silindi.');
          // Silme sonrası listeyi yenilemek için userId'nin güncel değerini kullan
          const currentUserId = this.authService.getUserId();
          if (currentUserId !== null) {
            this.loadTasinmazlar(currentUserId);
          } else {
            this.router.navigate(['/login']);
          }
        },
        error: (err) => {
          console.error('Taşınmaz silinirken hata:', err);
          this.error = 'Taşınmaz silinirken bir hata oluştu.';
          if (err.status === 401) {
            this.authService.logout();
          }
        }
      });
    }
  }

  /**
   * "Yeni Taşınmaz Ekle" butonu için metod.
   */
  addTasinmaz(): void {
    this.router.navigate(['/tasinmaz-ekle']);
  }

  /**
   * "Çıkış Yap" butonu için metod.
   * AuthService üzerindeki logout metodunu çağırır.
   */
  logout(): void {
    this.authService.logout();
  }
}
