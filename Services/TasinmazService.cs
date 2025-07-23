using Microsoft.EntityFrameworkCore;
using tasinmazBackend.Data;
using tasinmazBackend.Dtos;
using tasinmazBackend.Entitiy;
using tasinmazBackend.Services.Interfaces;

namespace tasinmazBackend.Services
{
    public class TasinmazService : ITasinmazService
    {
        private readonly AppDbContext _context;

        public TasinmazService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<CreateTasinmazDto>> GetAllAsync()
        {
            return await _context.Tasinmazlar
                .Include(t => t.Mahalle)
                    .ThenInclude(m => m.Ilce)
                        .ThenInclude(i => i.Il)
                .Select(t => new CreateTasinmazDto
                {
                    Id = t.Id,
                    Ada = t.Ada,
                    Parsel = t.Parsel,
                    Koordinat = t.Koordinat,
                    Adres = t.Adres,
                    MahalleId = t.MahalleId,
                    Mahalle = new MahalleDto
                    {
                        Id = t.Mahalle.Id,
                        Ad = t.Mahalle.Ad,
                        IlceId = t.Mahalle.IlceId,
                        Ilce = new IlceDto
                        {
                            Id = t.Mahalle.Ilce.Id,
                            Ad = t.Mahalle.Ilce.Ad,
                            IlId = t.Mahalle.Ilce.IlId,
                            Il = new IlDto
                            {
                                Id = t.Mahalle.Ilce.Il.Id,
                                Ad = t.Mahalle.Ilce.Il.Ad
                            }
                        }
                    }
                }).ToListAsync();
        }

        public async Task<CreateTasinmazDto> CreateAsync(CreateTasinmazDto dto)
        {
            var tasinmaz = new Tasinmaz
            {
                Ada = dto.Ada,
                Parsel = dto.Parsel,
                Koordinat = dto.Koordinat,
                Adres = dto.Adres,
                MahalleId = dto.MahalleId
            };

            _context.Tasinmazlar.Add(tasinmaz);
            await _context.SaveChangesAsync();

            dto.Id = tasinmaz.Id;
            return dto;
        }
    }
}
