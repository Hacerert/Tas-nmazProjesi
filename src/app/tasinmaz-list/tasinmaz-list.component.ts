// src/app/tasinmaz-list/tasinmaz-list.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { TasinmazService, Tasinmaz } from '../services/tasinmaz.service';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { Subscription, forkJoin } from 'rxjs'; // forkJoin import edildi

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
  selectedTasinmazIds: number[] = []; // Seçilen taşınmaz ID'lerini tutacak dizi

  constructor(
    private tasinmazService: TasinmazService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.userIdSubscription = this.authService.userId$.subscribe(userId => {
      console.log('TasinmazListComponent (ngOnInit): userId$ güncellendi:', userId);
      if (userId !== null) {
        this.loadTasinmazlar(userId);
      } else {
        if (this.authService.isAuthenticated()) {
          console.error('TasinmazListComponent: isAuthenticated true olmasına rağmen userId null.');
        } else {
          console.log('TasinmazListComponent: Kullanıcı ID null ve kimlik doğrulaması yapılmamış, login sayfasına yönlendiriliyor.');
          this.router.navigate(['/login']);
        }
        this.loading = false;
        this.tasinmazlar = [];
        this.error = 'Kullanıcı oturumu bulunamadı veya geçersiz.';
      }
    });
  }

  ngOnDestroy(): void {
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
    this.selectedTasinmazIds = []; // Yeni yüklemede seçimleri sıfırla

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
          this.error = 'Bu kullanıcıya ait taşınmaz bulunamadı.';
          this.tasinmazlar = [];
        } else if (err.status === 0) {
          this.error = 'Sunucuya ulaşılamadı. Backend çalışıyor mu?';
        }
      }
    });
  }

  /**
   * Checkbox durumu değiştiğinde seçili ID'leri günceller.
   * @param id Taşınmaz ID'si.
   * @param event Checkbox değişim olayı.
   */
  onCheckboxChange(id: number, event: any): void {
    if (event.target.checked) {
      this.selectedTasinmazIds.push(id);
    } else {
      this.selectedTasinmazIds = this.selectedTasinmazIds.filter(tasinmazId => tasinmazId !== id);
    }
    console.log('Seçilen Taşınmaz ID\'leri:', this.selectedTasinmazIds);
  }

  /**
   * Tüm taşınmazları seçer veya seçimi kaldırır.
   * @param event Tümünü Seç checkbox'ının değişim olayı.
   */
  toggleSelectAll(event: any): void {
    if (event.target.checked) {
      this.selectedTasinmazIds = this.tasinmazlar.map(tasinmaz => tasinmaz.id!);
    } else {
      this.selectedTasinmazIds = [];
    }
    console.log('Tümünü Seç/Seçimi Kaldır. Seçilen ID\'ler:', this.selectedTasinmazIds);
  }

  /**
   * Seçilen tüm taşınmazları siler.
   */
  deleteSelectedTasinmazlar(): void {
    const currentUserId = this.authService.getUserId();
    if (currentUserId === null) {
      this.error = 'Kullanıcı ID\'si bulunamadı. Lütfen tekrar giriş yapın.';
      this.router.navigate(['/login']);
      return;
    }

    if (this.selectedTasinmazIds.length === 0) {
      this.error = 'Lütfen silmek için en az bir taşınmaz seçin.';
      return;
    }

    if (confirm(`Seçilen ${this.selectedTasinmazIds.length} adet taşınmazı silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.`)) {
      console.log('Seçilen taşınmazlar siliniyor:', this.selectedTasinmazIds);

      // Her bir seçilen taşınmaz için silme isteği gönder
      const deleteObservables = this.selectedTasinmazIds.map(id =>
        this.tasinmazService.deleteTasinmaz(id) // Tekil silme metodunu kullanıyoruz
      );

      // Tüm silme istekleri tamamlandığında
      forkJoin(deleteObservables).subscribe({
        next: () => {
          console.log('Seçilen tüm taşınmazlar başarıyla silindi.');
          this.loadTasinmazlar(currentUserId); // Listeyi yeniden yükle
          this.selectedTasinmazIds = []; // Seçimleri sıfırla
        },
        error: (err) => {
          console.error('Seçilen taşınmazlar silinirken hata:', err);
          this.error = 'Seçilen taşınmazlar silinirken bir hata oluştu.';
          if (err.status === 401) {
            this.authService.logout();
          } else if (err.status === 0) {
            this.error = 'Sunucuya ulaşılamadı. Backend çalışıyor mu?';
          }
        }
      });
    }
  }

  /**
   * "Düzenle" butonuna tıklandığında çalışır.
   * @param id Düzenlenecek taşınmazın ID'si.
   */
  editTasinmaz(id: number): void {
    console.log('Düzenlenecek Taşınmaz ID:', id);
    this.router.navigate(['/tasinmaz-duzenle', id]);
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
