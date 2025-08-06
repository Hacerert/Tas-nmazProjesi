using tasinmazBackend.Dtos;

namespace tasinmazBackend.Services.Interfaces
{
    public interface IIlceService
    {
        Task<List<IlceDto>> GetAllAsync();
        Task<IlceDto> CreateAsync(IlceDto dto);

        Task<List<IlceDto>> GetAsync(int ilId);
    }
}
