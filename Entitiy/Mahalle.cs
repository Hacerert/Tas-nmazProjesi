using System.ComponentModel.DataAnnotations;

namespace tasinmazBackend.Entitiy
{
    public class Mahalle
    {
        [Key]
        public int Id { get; set; }

        public string? Ad { get; set; }  

        public int IlceId { get; set; }

        public Ilce? Ilce { get; set; }  
    }
}
