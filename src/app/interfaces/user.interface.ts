// src/app/interfaces/user.interface.ts

// Kullanıcı arayüzü (interface) tanımlandı.
// Email alanı, derleme sorununu çözmek için geçici olarak kaldırıldı.
export interface User {
  id: number;
  username: string;
  // email: string; // <-- BU SATIR ŞİMDİLİK KALDIRILDI!
  role: string;
  // Diğer kullanıcı özellikleri buraya eklenebilir.
}
