using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using tasinmazBackend.Data;
using tasinmazBackend.Dtos;
using tasinmazBackend.Entitiy;
using tasinmazBackend.Services.Interfaces;
using System;

public class TasinmazService : ITasinmazService
{
    private readonly AppDbContext _context;
    private readonly ILogService _logService;

    public TasinmazService(AppDbContext context, ILogService logService)
    {
        _context = context;
        _logService = logService;
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
            })
            .ToListAsync();
    }

    public async Task<List<CreateTasinmazDto>> GetByUserIdAsync(int userId)
    {
        return await _context.Tasinmazlar
            .Include(t => t.Mahalle)
                .ThenInclude(m => m.Ilce)
                    .ThenInclude(i => i.Il)
            .Where(t => t.UserId == userId)
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
            })
            .ToListAsync();
    }

    public async Task<CreateTasinmazDto> CreateAsync(CreateTasinmazDto dto)
    {
        try
        {
            var tasinmaz = new Tasinmaz
            {
                Ada = dto.Ada,
                Parsel = dto.Parsel,
                Koordinat = dto.Koordinat,
                Adres = dto.Adres,
                MahalleId = dto.MahalleId,
                UserId = 1 // Burayı dinamik yapmalısın, şimdilik örnek sabit ID
            };

            _context.Tasinmazlar.Add(tasinmaz);
            await _context.SaveChangesAsync();

            dto.Id = tasinmaz.Id;

            await _logService.AddLogAsync(
                status: "Başarılı",
                actionType: "Taşınmaz Ekleme",
                description: $"Taşınmaz {tasinmaz.Id} başarıyla eklendi.",
                userId: tasinmaz.UserId
            );

            return dto;
        }
        catch (Exception ex)
        {
            await _logService.AddLogAsync(
                status: "Hata",
                actionType: "Taşınmaz Ekleme",
                description: $"Taşınmaz eklenirken hata oluştu: {ex.Message}",
                userId: null
            );

            throw;
        }
    }

    public async Task<CreateTasinmazDto?> UpdateAsync(int id, CreateTasinmazDto dto)
    {
        var tasinmaz = await _context.Tasinmazlar.FindAsync(id);
        if (tasinmaz == null)
            return null;

        tasinmaz.Ada = dto.Ada;
        tasinmaz.Parsel = dto.Parsel;
        tasinmaz.Koordinat = dto.Koordinat;
        tasinmaz.Adres = dto.Adres;
        tasinmaz.MahalleId = dto.MahalleId;

        try
        {
            await _context.SaveChangesAsync();

            await _logService.AddLogAsync(
                status: "Başarılı",
                actionType: "Taşınmaz Güncelleme",
                description: $"Taşınmaz {id} başarıyla güncellendi.",
                userId: tasinmaz.UserId
            );

            dto.Id = id;
            return dto;
        }
        catch (Exception ex)
        {
            await _logService.AddLogAsync(
                status: "Hata",
                actionType: "Taşınmaz Güncelleme",
                description: $"Taşınmaz güncellenirken hata oluştu: {ex.Message}",
                userId: tasinmaz.UserId
            );

            throw;
        }
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var tasinmaz = await _context.Tasinmazlar.FindAsync(id);
        if (tasinmaz == null)
            return false;

        try
        {
            _context.Tasinmazlar.Remove(tasinmaz);
            await _context.SaveChangesAsync();

            await _logService.AddLogAsync(
                status: "Başarılı",
                actionType: "Taşınmaz Silme",
                description: $"Taşınmaz {id} başarıyla silindi.",
                userId: tasinmaz.UserId
            );

            return true;
        }
        catch (Exception ex)
        {
            await _logService.AddLogAsync(
                status: "Hata",
                actionType: "Taşınmaz Silme",
                description: $"Taşınmaz silinirken hata oluştu: {ex.Message}",
                userId: tasinmaz.UserId
            );

            return false;
        }
    }
}
