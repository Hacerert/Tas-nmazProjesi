using System.Collections.Generic;
using System.Threading.Tasks;
using tasinmazBackend.Dtos;

public interface ITasinmazService
{
    Task<List<CreateTasinmazDto>> GetAllAsync();
    Task<List<CreateTasinmazDto>> GetByUserIdAsync(int userId);
    Task<CreateTasinmazDto> CreateAsync(CreateTasinmazDto dto);
    Task<CreateTasinmazDto?> UpdateAsync(int id, CreateTasinmazDto dto);
    Task<bool> DeleteAsync(int id);
}
