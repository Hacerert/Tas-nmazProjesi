namespace tasinmazBackend.Dtos
{
    public class IlceDto
    {
        public int Id { get; set; }
        public string Ad { get; set; } = null!;
        public int IlId { get; set; }
        public IlDto? Il { get; set; }
    }
}
