// tasinmazBackend/Services/Interfaces/IUserService.cs
using tasinmazBackend.Entitiy; // User entity'si için
using tasinmazBackend.Dtos; // DTO'lar için
using System.Collections.Generic; // IEnumerable için

namespace tasinmazBackend.Services.Interfaces
{
    public interface IUserService
    {
        // Mevcut metotlar
        User? ValidateUser(string username, string password); // Email yerine username kullanıldı
        Task<User> RegisterUser(RegisterUserDto registerDto);

        // YENİ EKLENEN VE EKSİK OLAN METOTLAR (UserController'ın beklediği)
        Task<IEnumerable<User>> GetAllUsers(); // Tüm kullanıcıları getir
        Task<User?> GetUserById(int id); // ID'ye göre kullanıcı getir
        Task UpdateUser(UserUpdateDto userUpdateDto); // Kullanıcı güncelle
        Task DeleteUser(int id); // Kullanıcı sil
    }
}
