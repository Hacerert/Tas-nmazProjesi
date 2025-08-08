using System.ComponentModel.DataAnnotations;
using tasinmazBackend.Entitiy;

public class Ilce
{
    [Key]
    public int Id { get; set; }

    public string Ad { get; set; }
    public int IlId { get; set; }    
    public Il Il { get; set; }     
}
