namespace tasinmazBackend.Dtos
{
    public class CreateTasinmazDto
    {
        public int Id { get; set; }  

        public string Ada { get; set; } = null!;
        public string Parsel { get; set; } = null!;
        public string Koordinat { get; set; } = null!;
        public string Adres { get; set; } = null!;
        public int MahalleId { get; set; }
 
    }
}
