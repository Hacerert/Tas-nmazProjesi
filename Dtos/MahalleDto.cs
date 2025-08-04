namespace tasinmazBackend.Dtos
{
    public class MahalleDto
    {
        public int? Id { get; set; }
        public string Ad { get; set; } = null!;
        public int IlceId { get; set; }
        public IlceDto? Ilce { get; set; }  
    }
}
