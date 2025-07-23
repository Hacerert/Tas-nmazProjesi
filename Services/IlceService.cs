using Microsoft.EntityFrameworkCore;
using tasinmazBackend.Data;
using tasinmazBackend.Dtos;
using tasinmazBackend.Entitiy;
using tasinmazBackend.Services.Interfaces;

namespace tasinmazBackend.Services
{
    public class IlceService : Interfaces.IIlceService
    {
        private readonly AppDbContext _context;

        public IlceService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<IlceDto>> GetAllAsync()
        {
            return await _context.Ilceler
                .Include(i => i.Il)
                .Select(i => new IlceDto
                {
                    Id = i.Id,
                    Ad = i.Ad,
                    IlId = i.IlId,
                    Il = i.Il == null ? null : new IlDto
                    {
                        Id = i.Il.Id,
                        Ad = i.Il.Ad
                    }
                }).ToListAsync();
        }

        public async Task<IlceDto> CreateAsync(IlceDto dto)
        {
            var ilce = new Ilce
            {
                Ad = dto.Ad,
                IlId = dto.IlId
            };

            _context.Ilceler.Add(ilce);
            await _context.SaveChangesAsync();

            dto.Id = ilce.Id;
            return dto;
        }
    }
}
