// tasinmazBackend/Dtos/UserUpdateDto.cs
namespace tasinmazBackend.Dtos
{
    public class UserUpdateDto
    {
        public int Id { get; set; }
        public string Username { get; set; } = string.Empty; 
        public string Email { get; set; } = string.Empty;    
        public string Role { get; set; } = string.Empty;     
    }
}
