using tasinmazBackend.Dtos;

namespace tasinmazBackend.Services.Interfaces
{
    public interface IIlService
    {
        Task<List<IlDto>> GetAllAsync();
        Task<IlDto> CreateAsync(IlDto dto);
    }
}
