using Microsoft.AspNetCore.Mvc;
using tasinmazBackend.Dtos;
using tasinmazBackend.Services.Interfaces;

namespace tasinmazBackend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TasinmazController : ControllerBase
    {
        private readonly ITasinmazService _service;

        public TasinmazController(ITasinmazService service)
        {
            _service = service;
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
    }
}
