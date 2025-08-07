using Microsoft.AspNetCore.Mvc;
using tasinmazBackend.Dtos;
using tasinmazBackend.Services.Interfaces;

namespace tasinmazBackend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class IlceController : ControllerBase
    {
        private readonly IIlceService _ilceService;

        public IlceController(IIlceService ilceService)
        {
            _ilceService = ilceService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var ilceler = await _ilceService.GetAllAsync();
            return Ok(ilceler);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] IlceDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Ad))
                return BadRequest("İlçe adı boş olamaz.");

            var created = await _ilceService.CreateAsync(dto);
            return CreatedAtAction(nameof(GetAll), new { id = created.Id }, created);
        }

        [HttpGet("{ilId}")]
        public async Task<IActionResult> Get(int ilId)
        {
            var ilceler = await _ilceService.GetAsync(ilId);
            return Ok(ilceler);
        }
    }
}
