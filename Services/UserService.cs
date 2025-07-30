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

        public string ComputeSha256Hash(string rawData) //düz metni hashler string yapar
        {
            using (SHA256 sha256Hash = SHA256.Create()) //hash işlemini yapar
            {
                byte[] bytes = sha256Hash.ComputeHash(Encoding.UTF8.GetBytes(rawData)); //rawData byte çevrilip -sha256 hash hesaplaması yapılır
                StringBuilder builder = new StringBuilder(); //hash okunmak için nesne oluşturuyor
                foreach (byte b in bytes) 
                    builder.Append(b.ToString("x2")); //her byte *2 ile builder içine ekleniyor
                return builder.ToString(); //hash stringe döndürülüyor mesela 12345=59944abb...
            }
        }

        public User? ValidateUser(string userName, string password) //login olmak için kullanıcı adı ve şifre kontrol eder.
        {
            var user = _context.Users.FirstOrDefault(u => u.UserName == userName); //user tablosundan usurname eşleşen ilk kullanıcıyı alır
            if (user == null) //kullanıcı yoksa null oluyor
                return null;

            string hashedInputPassword = ComputeSha256Hash(password); //bu hash ile veritabanındaki hash karşılaştırıyor

            return hashedInputPassword == user.Password ? user : null; //aynıysa giriş başarılı değilse null
        }

    }
}
