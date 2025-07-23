using Microsoft.EntityFrameworkCore;
using tasinmazBackend.Data;
using tasinmazBackend.Dtos;
using tasinmazBackend.Entitiy;
using tasinmazBackend.Services.Interfaces;

namespace tasinmazBackend.Services
{
    public class IlService : Interfaces.IIlService
    {
        private readonly AppDbContext _context;

        public IlService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<IlDto>> GetAllAsync()
        {
            return await _context.Iller
                .Select(i => new IlDto
                {
                    Id = i.Id,
                    Ad = i.Ad
                })
                .ToListAsync();
        }

        public async Task<IlDto> CreateAsync(IlDto dto)
        {
            var il = new Il { Ad = dto.Ad };

            _context.Iller.Add(il);
            await _context.SaveChangesAsync();

            dto.Id = il.Id;
            return dto;
        }
    }
}
