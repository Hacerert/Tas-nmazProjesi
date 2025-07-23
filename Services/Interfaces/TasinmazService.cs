using tasinmazBackend.Dtos;

namespace tasinmazBackend.Services.Interfaces
{
    public interface ITasinmazService
    {
        Task<List<CreateTasinmazDto>> GetAllAsync();
        Task<CreateTasinmazDto> CreateAsync(CreateTasinmazDto dto);
    }
}
