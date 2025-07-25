using tasinmazBackend.Models;

using System.ComponentModel.DataAnnotations.Schema;

namespace tasinmazBackend.Entitiy
{
    public class Tasinmaz
    {
        public int Id { get; set; }
        public string Ada { get; set; } = null!;
        public string Parsel { get; set; } = null!;
        public string Koordinat { get; set; } = null!;
        public string Adres { get; set; } = null!;
        public int MahalleId { get; set; }
        public Mahalle? Mahalle { get; set; }
        public int UserId { get; set; }
        public User? User { get; set; }
    }
}
