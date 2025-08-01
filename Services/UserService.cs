// tasinmazBackend/Services/UserService.cs
using Microsoft.EntityFrameworkCore;
using tasinmazBackend.Data;
using tasinmazBackend.Entitiy;
using tasinmazBackend.Services.Interfaces;
using tasinmazBackend.Dtos; // DTO'lar için
using BCrypt.Net; // BCrypt için

namespace tasinmazBackend.Services
{
    public class UserService : IUserService
    {
        private readonly AppDbContext _context;

        public UserService(AppDbContext context)
        {
            _context = context;
        }

        public User? ValidateUser(string username, string password)
        {
            // Kullanıcı adı veya e-posta ile giriş yapmayı desteklemek için
            var user = _context.Users.SingleOrDefault(u => u.UserName == username || u.Email == username);

            if (user == null)
            {
                return null; // Kullanıcı bulunamadı
            }

            // BCrypt ile şifre doğrulaması
            // user.Password (entity'deki alan) ile gelen şifreyi karşılaştır
            if (BCrypt.Net.BCrypt.Verify(password, user.Password)) // <-- BURASI DÜZELTİLDİ!
            {
                return user; // Şifre doğru
            }

            return null; // Şifre yanlış
        }

        public async Task<User> RegisterUser(RegisterUserDto registerDto)
        {
            // Kullanıcı adı veya e-posta zaten kullanımda mı kontrol et
            if (await _context.Users.AnyAsync(u => u.UserName == registerDto.Username))
            {
                throw new InvalidOperationException("Bu kullanıcı adı zaten kullanımda.");
            }
            if (await _context.Users.AnyAsync(u => u.Email == registerDto.Email))
            {
                throw new InvalidOperationException("Bu e-posta adresi zaten kullanımda.");
            }

            // Şifreyi hash'le
            string passwordHash = BCrypt.Net.BCrypt.HashPassword(registerDto.Password);

            var user = new User
            {
                UserName = registerDto.Username,
                Email = registerDto.Email,
                Password = passwordHash, // <-- BURASI DÜZELTİLDİ! PasswordHash yerine Password kullanıldı
                Role = registerDto.Role // Rolü DTO'dan al
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();
            return user;
        }

        // YENİ EKLENEN METOTLARIN UYGULAMASI
        public async Task<IEnumerable<User>> GetAllUsers()
        {
            return await _context.Users.ToListAsync();
        }

        public async Task<User?> GetUserById(int id)
        {
            return await _context.Users.FindAsync(id);
        }

        public async Task UpdateUser(UserUpdateDto userUpdateDto)
        {
            var user = await _context.Users.FindAsync(userUpdateDto.Id);
            if (user == null)
            {
                throw new KeyNotFoundException($"ID'si {userUpdateDto.Id} olan kullanıcı bulunamadı.");
            }

            // Kullanıcı adı veya e-posta değişikliği varsa, benzersizlik kontrolü yap
            if (user.UserName != userUpdateDto.Username && await _context.Users.AnyAsync(u => u.UserName == userUpdateDto.Username))
            {
                throw new InvalidOperationException("Bu kullanıcı adı zaten kullanımda.");
            }
            if (user.Email != userUpdateDto.Email && await _context.Users.AnyAsync(u => u.Email == userUpdateDto.Email))
            {
                throw new InvalidOperationException("Bu e-posta adresi zaten kullanımda.");
            }

            user.UserName = userUpdateDto.Username;
            user.Email = userUpdateDto.Email;
            user.Role = userUpdateDto.Role;

            _context.Users.Update(user);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteUser(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                throw new KeyNotFoundException($"ID'si {id} olan kullanıcı bulunamadı.");
            }

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();
        }
    }
}
