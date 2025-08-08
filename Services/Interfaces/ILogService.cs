using System.Threading.Tasks;

namespace tasinmazBackend.Services.Interfaces
{
    public interface ILogService
    {
        Task AddLogAsync(string status, string actionType, string description, int? userId = null);
    }
}