using Microsoft.AspNetCore.Mvc;
using tasinmazBackend.Dtos;
using tasinmazBackend.Services.Interfaces;

namespace tasinmazBackend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MahalleController : ControllerBase
    {
        private readonly IMahalleService _mahalleService;

        public MahalleController(IMahalleService mahalleService)
        {
            _mahalleService = mahalleService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var mahalleler = await _mahalleService.GetAllAsync();
            return Ok(mahalleler);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] MahalleDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Ad))
                return BadRequest("Mahalle adı boş olamaz.");

            var created = await _mahalleService.CreateAsync(dto);
            return CreatedAtAction(nameof(GetAll), new { id = created.Id }, created);
        }
    }
}
