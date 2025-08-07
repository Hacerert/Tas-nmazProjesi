// tasinmazBackend/Controllers/UserController.cs
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using tasinmazBackend.Dtos;
using tasinmazBackend.Services.Interfaces;
using tasinmazBackend.Entitiy; // User entity'si için
using Microsoft.Extensions.Logging; // Loglama için
using Microsoft.AspNetCore.Authorization; // Yetkilendirme için
using System.Collections.Generic; // IEnumerable için

namespace tasinmazBackend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly IConfiguration _configuration;
        private readonly ILogger<UserController> _logger; // Loglama için

        public UserController(IUserService userService, IConfiguration configuration, ILogger<UserController> logger)
        {
            _userService = userService;
            _configuration = configuration;
            _logger = logger;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterUserDto dto)
        {
            try
            {
                var user = await _userService.RegisterUser(dto);
                // Dönüş DTO'su oluşturarak hassas bilgileri (şifre hash'i) göndermeyin
                return CreatedAtAction(nameof(Login), new { username = user.UserName }, new { Message = "Kullanıcı başarıyla kaydedildi.", UserId = user.Id, Username = user.UserName, Role = user.Role });
            }
            catch (InvalidOperationException ex)
            {
                _logger.LogError($"Kayıt hatası: {ex.Message}");
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Beklenmedik kayıt hatası: {ex.Message}");
                return StatusCode(500, "Kayıt sırasında bir hata oluştu.");
            }
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginDto dto)
        {
            var user = _userService.ValidateUser(dto.Username, dto.Password);
            if (user == null)
                return Unauthorized("Kullanıcı adı veya şifre hatalı.");

            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
                new Claim(ClaimTypes.Name, user.UserName), // user.userName kullanıldı
                new Claim(ClaimTypes.Role, user.Role),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]!)); // Null kontrolü eklendi
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddHours(2),
                signingCredentials: creds
            );

            return Ok(new
            {
                token = new JwtSecurityTokenHandler().WriteToken(token)
            });
        }

        // YENİ EKLENEN: Tüm kullanıcıları getiren Admin endpoint'i
        [HttpGet("GetAllUsers")]
        [Authorize(Roles = "Admin")] // Sadece Admin rolüne sahip kullanıcılar erişebilir
        public async Task<IActionResult> GetAllUsers()
        {
            try
            {
                var users = await _userService.GetAllUsers();
                // Şifre gibi hassas bilgileri DTO'ya dönüştürerek göndermeyin
                var userDtos = users.Select(u => new { u.Id, u.UserName, u.Email, u.Role }); // user.UserName kullanıldı
                return Ok(userDtos);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Kullanıcılar alınırken hata: {ex.Message}");
                return StatusCode(500, "Kullanıcılar alınırken bir hata oluştu.");
            }
        }

        // YENİ EKLENEN: Kullanıcı silme Admin endpoint'i
        [HttpDelete("DeleteUser/{id}")]
        [Authorize(Roles = "Admin")] // Sadece Admin rolüne sahip kullanıcılar erişebilir
        public async Task<IActionResult> DeleteUser(int id)
        {
            try
            {
                await _userService.DeleteUser(id);
                return NoContent(); // Başarılı silme için 204 No Content döndür
            }
            catch (KeyNotFoundException ex)
            {
                _logger.LogWarning($"Kullanıcı silinemedi: {ex.Message}");
                return NotFound(ex.Message);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Kullanıcı silinirken hata: {ex.Message}");
                return StatusCode(500, "Kullanıcı silinirken bir hata oluştu.");
            }
        }

        // YENİ EKLENEN: Kullanıcı güncelleme Admin endpoint'i
        [HttpPut("UpdateUser/{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateUser(int id, [FromBody] UserUpdateDto dto)
        {
            if (id != dto.Id)
            {
                return BadRequest("ID uyuşmazlığı.");
            }

            try
            {
                await _userService.UpdateUser(dto);
                return NoContent();
            }
            catch (KeyNotFoundException ex)
            {
                _logger.LogWarning($"Kullanıcı güncellenemedi: {ex.Message}");
                return NotFound(ex.Message);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Kullanıcı güncellenirken hata: {ex.Message}");
                return StatusCode(500, "Kullanıcı güncellenirken bir hata oluştu.");
            }
        }

        // YENİ EKLENEN: ID'ye göre kullanıcı getirme Admin endpoint'i
        [HttpGet("GetUserById/{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetUserById(int id)
        {
            try
            {
                var user = await _userService.GetUserById(id);
                if (user == null)
                {
                    return NotFound($"ID'si {id} olan kullanıcı bulunamadı.");
                }
                var userDto = new { user.Id, user.UserName, user.Email, user.Role }; // user.UserName kullanıldı
                return Ok(userDto);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Kullanıcı alınırken hata: {ex.Message}");
                return StatusCode(500, "Kullanıcı alınırken bir hata oluştu.");
            }
        }
    }
}
