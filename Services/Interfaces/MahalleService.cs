using tasinmazBackend.Dtos;

namespace tasinmazBackend.Services.Interfaces
{
    public interface IMahalleService
    {
        Task<List<MahalleDto>> GetAllAsync();
        Task<MahalleDto> CreateAsync(MahalleDto dto);
    }
}
