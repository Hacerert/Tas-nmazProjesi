using Microsoft.Extensions.Logging;
using System.Linq;
using tasinmazBackend.Data;
using tasinmazBackend.Dtos;
using tasinmazBackend.Entitiy;
using tasinmazBackend.Services.Interfaces;

namespace tasinmazBackend.Services
{
    public class UserService : IUserService
    {
        private readonly AppDbContext _context;
        private readonly ILogger<UserService> _logger;

        public UserService(AppDbContext context, ILogger<UserService> logger)
        {
            _context = context;
            _logger = logger;
        }

        public void RegisterUser(RegisterUserDto dto)
        {
            string hashedPassword = BCrypt.Net.BCrypt.HashPassword(dto.Password);

            User user = new User
            {
                UserName = dto.Username,
                Email = dto.Email,
                PasswordHash = hashedPassword,
                Role = "User"
            };

            _context.Users.Add(user);
            _context.SaveChanges();

            _logger.LogInformation("Yeni kullanıcı eklendi: " + dto.Username);
        }

        public bool Login(string username, string password)
        {
            var user = _context.Users.FirstOrDefault(u => u.UserName == username);

            if (user == null)
            {
                _logger.LogWarning("Giriş başarısız: kullanıcı bulunamadı -> " + username);
                return false;
            }

            bool result = BCrypt.Net.BCrypt.Verify(password, user.PasswordHash);

            if (!result)
            {
                _logger.LogWarning("Giriş başarısız: şifre hatalı -> " + username);
            }
            else
            {
                _logger.LogInformation("Giriş başarılı: " + username);
            }

            return result;
        }

        // İşte JWT login için yeni metod:
        public User? ValidateUser(string username, string password)
        {
            var user = _context.Users.FirstOrDefault(u => u.UserName == username);
            if (user == null)
                return null;

            bool verified = BCrypt.Net.BCrypt.Verify(password, user.PasswordHash);
            return verified ? user : null;
        }
    }
}
