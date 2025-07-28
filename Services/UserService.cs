using Microsoft.Extensions.Logging;
using System.Linq;
using System.Text;
using tasinmazBackend.Data;
using tasinmazBackend.Dtos;
using tasinmazBackend.Entitiy;
using tasinmazBackend.Services.Interfaces;
using System.Security.Cryptography;


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
                Password = hashedPassword,
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

            bool result = BCrypt.Net.BCrypt.Verify(password, user.Password);

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
        //public User? ValidateUser(string userName, string password)
        //{
        //    var user = _context.Users.FirstOrDefault(u => u.UserName == userName);
        //    if (user == null)
        //        return null;

        //    bool verified = BCrypt.Net.BCrypt.Verify(password, user.Password);
        //    return verified ? user : null;
        //}

        public string ComputeSha256Hash(string rawData)
        {
            using (SHA256 sha256Hash = SHA256.Create())
            {
                byte[] bytes = sha256Hash.ComputeHash(Encoding.UTF8.GetBytes(rawData)); //burda şunu yapıyo
                StringBuilder builder = new StringBuilder();
                foreach (byte b in bytes)
                    builder.Append(b.ToString("x2"));
                return builder.ToString();
            }
        }

        public User? ValidateUser(string userName, string password)
        {
            var user = _context.Users.FirstOrDefault(u => u.UserName == userName); // username e göre user alma
            if (user == null)
                return null;

            string hashedInputPassword = ComputeSha256Hash(password);

            return hashedInputPassword == user.Password ? user : null;
        }

    }
}
