using tasinmazBackend.Data;
using tasinmazBackend.Entitiy;
using tasinmazBackend.Services.Interfaces;

public class LogService : ILogService
{
    private readonly AppDbContext _context;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public LogService(AppDbContext context, IHttpContextAccessor httpContextAccessor)
    {
        _context = context;
        _httpContextAccessor = httpContextAccessor;
    }

    public async Task AddLogAsync(string status, string actionType, string description, int? userId = null)
    {
        var ipAddress = _httpContextAccessor.HttpContext?.Connection?.RemoteIpAddress?.ToString() ?? "Bilinmiyor";

        var log = new Log
        {
            Status = status,
            ActionType = string.IsNullOrEmpty(actionType) ? "Bilinmeyen İşlem" : actionType,
            Description = description,
            UserId = userId ?? 1, 
            IpAddress = ipAddress
        };

        _context.Logs.Add(log);
        await _context.SaveChangesAsync();
    }
}
