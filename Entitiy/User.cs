namespace tasinmazBackend.Entitiy
{
    public class User
    {
        public int Id { get; set; }
        public string UserName { get; set; } = null!;
        public string Email { get; set; } = null!;
        public ICollection<Tasinmaz>? Tasinmazlar { get; set; }
        public string Password { get; set; } = null!; // PasswordHash yerine Password olarak düzeltildi

        public string Role { get; set; } = "User";
    }
}