using tasinmazBackend.Entitiy;

public class Log
{
    public int Id { get; set; }

    public string Status { get; set; } 
    public int? UserId { get; set; }
    public string ActionType { get; set; } 
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public string IpAddress { get; set; }
    public string Description { get; set; }

    public User? User { get; set; }
}
