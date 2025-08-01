// tasinmazBackend/Dtos/RegisterUserDto.cs
using System.ComponentModel.DataAnnotations;

namespace tasinmazBackend.Dtos
{
    public class RegisterUserDto
    {
        [Required]
        [StringLength(100)]
        public string Username { get; set; } = string.Empty; // DTO'da 'Username' (PascalCase) kullanıyoruz

        [Required]
        [EmailAddress] // Email alanı User entity'de olduğu için burada da var
        [StringLength(100)]
        public string Email { get; set; } = string.Empty;

        [Required]
        [StringLength(255)] // Kullanıcının girdiği şifre için uzunluk
        public string Password { get; set; } = string.Empty;

        [Required]
        [StringLength(50)]
        public string Role { get; set; } = "User"; // Varsayılan rol "User"
    }
}
