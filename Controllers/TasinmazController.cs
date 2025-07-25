using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using tasinmazBackend.Dtos;
using tasinmazBackend.Services.Interfaces;

[ApiController]
[Route("api/[controller]")]
public class TasinmazController : ControllerBase
{
    private readonly ITasinmazService _service;
    private readonly ILogService _logService;

    public TasinmazController(ITasinmazService service, ILogService logService)
    {
        _service = service;
        _logService = logService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var data = await _service.GetAllAsync();
        return Ok(data);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateTasinmazDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Ada) || string.IsNullOrWhiteSpace(dto.Parsel))
            return BadRequest("Ada ve Parsel boş olamaz.");

        var created = await _service.CreateAsync(dto);
        return CreatedAtAction(nameof(GetAll), new { id = created.Id }, created);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] CreateTasinmazDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Ada) || string.IsNullOrWhiteSpace(dto.Parsel))
            return BadRequest("Ada ve Parsel boş olamaz.");

        var updated = await _service.UpdateAsync(id, dto);
        if (updated == null)
            return NotFound();

        return Ok(updated);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var deleted = await _service.DeleteAsync(id);
        if (!deleted)
            return NotFound();

        return NoContent();
    }

    // Yeni endpoint: userId’ye göre taşınmazları getir
    [HttpGet("kullanici-tasinmazlarim/{userId}")]
    public async Task<IActionResult> GetTasinmazlarByUserId(int userId)
    {
        var userProperties = await _service.GetByUserIdAsync(userId);
        if (userProperties == null || !userProperties.Any())
            return NotFound("Bu kullanıcıya ait taşınmaz bulunamadı.");

        return Ok(userProperties);
    }
}
