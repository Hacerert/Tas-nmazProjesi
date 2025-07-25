using Microsoft.AspNetCore.Mvc;
using tasinmazBackend.Data;
using tasinmazBackend.Entitiy;
using Microsoft.EntityFrameworkCore;

namespace tasinmazBackend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LogController : ControllerBase
    {
        private readonly AppDbContext _context;

        public LogController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var logs = await _context.Logs
                .Include(l => l.User)
                .OrderByDescending(l => l.CreatedAt)
                .ToListAsync();

            return Ok(logs);
        }

        [HttpPost]
        public async Task<IActionResult> CreateLog([FromBody] Log log)
        {
            if (log == null)
                return BadRequest("Log nesnesi boş olamaz.");

            log.CreatedAt = DateTime.UtcNow; 

            await _context.Logs.AddAsync(log);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetAll), new { id = log.Id }, log);
        }
    }
}
