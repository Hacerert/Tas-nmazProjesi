using System.Threading.Tasks;
using tasinmazBackend.Dtos;

namespace tasinmazBackend.Services.Interfaces
{
    public interface IMahalleService
    {
        Task<List<MahalleDto>> GetAllAsync();
        Task<MahalleDto> CreateAsync(MahalleDto dto);
        Task<List<MahalleDto>> GetAsync(int ilceId);
    }
}
