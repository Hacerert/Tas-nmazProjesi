using Microsoft.AspNetCore.Mvc;
using tasinmazBackend.Dtos;
using tasinmazBackend.Services.Interfaces;

namespace tasinmazBackend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class IlController : ControllerBase
    {
        private readonly IIlService _ilService;

        public IlController(IIlService ilService)
        {
            _ilService = ilService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var iller = await _ilService.GetAllAsync();
            return Ok(iller);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] IlDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Ad))
                return BadRequest("İl adı boş olamaz.");

            var created = await _ilService.CreateAsync(dto);
            return CreatedAtAction(nameof(GetAll), new { id = created.Id }, created);
        }
    }
}
