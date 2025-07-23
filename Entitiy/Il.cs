using System.ComponentModel.DataAnnotations;
using tasinmazBackend.Entitiy;


namespace tasinmazBackend.Entitiy
{
    public class Il
    {
        [Key]
        public int Id { get; set; }
        public string Ad { get; set; } = null!;


    }
}