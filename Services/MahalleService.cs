using Microsoft.EntityFrameworkCore;
using tasinmazBackend.Data;
using tasinmazBackend.Dtos;
using tasinmazBackend.Entitiy;
using tasinmazBackend.Services.Interfaces;

namespace tasinmazBackend.Services
{
    public class MahalleService : IMahalleService
    {
        private readonly AppDbContext _context;

        public MahalleService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<MahalleDto>> GetAllAsync()
        {
            return await _context.Mahalleler
                .Include(m => m.Ilce)               // İlçe bilgisi dahil et
                    .ThenInclude(i => i.Il)         // İlçe içindeki İl bilgisi dahil et
                .Select(m => new MahalleDto
                {
                    Id = m.Id,
                    Ad = m.Ad,
                    IlceId = m.IlceId,
                    Ilce = new IlceDto
                    {
                        Id = m.Ilce.Id,
                        Ad = m.Ilce.Ad,
                        IlId = m.Ilce.IlId,
                        Il = m.Ilce.Il == null ? null : new IlDto
                        {
                            Id = m.Ilce.Il.Id,
                            Ad = m.Ilce.Il.Ad
                        }
                    }
                }).ToListAsync();
        }

        public async Task<MahalleDto> CreateAsync(MahalleDto dto)
        {
            var mahalle = new Mahalle
            {
                Ad = dto.Ad,
                IlceId = dto.IlceId
            };

            _context.Mahalleler.Add(mahalle);
            await _context.SaveChangesAsync();

            dto.Id = mahalle.Id;
            return dto;
        }

        public Task<List<MahalleDto>> GetAsync(int ilceId)
        {
            throw new NotImplementedException();
        }
    }
}
