using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using tasinmazBackend.Entitiy;


namespace tasinmazBackend.Entitiy
{
    [Table("Iller")]
    public class Il
    {
        [Key]
        public int Id { get; set; }
        public string Ad { get; set; } = null!;


    }
}