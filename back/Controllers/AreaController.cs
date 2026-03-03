using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Stage_API.Data;
using Stage_API.Models;

namespace Stage_API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AreaController : ControllerBase
    {
        private readonly AppDb _dbContext;

        public AreaController(AppDb context)
        {
            _dbContext = context;
        }

        [HttpGet("/api/AllArea")]
        public async Task<ActionResult<Area>> GetAllAreas()
        {
            var areas = await _dbContext.Area.ToListAsync();

            if (areas == null || areas.Count == 0) { return Ok(new { message = "Áreas não encontradas na base." }); }

            var areasFormatadas = new List<object>();

            foreach (var area in areas)
            {
                var obj = new
                {
                    Id = area.Id,
                    Nome = area.Nome                                    
                };

                areasFormatadas.Add(obj);
            }

            return Ok(areasFormatadas);
        }

        [HttpGet("/api/AreaById")]
        public async Task<ActionResult<Area>> GetAreaById(int Id)
        {
            var areas = await _dbContext.Area.FindAsync(Id);

            if (areas == null) { return NotFound(new { message = "Área não encontrada na base de dados." }); }

            return Ok(areas);
        }

        [HttpPost("/api/CreateArea")]
        public async Task<ActionResult<Area>> CreateArea(AreaCreateDTO atributes)
        {
            if (String.IsNullOrWhiteSpace(atributes.Nome))
            {
                return BadRequest(new { message = "Falha ao criar área." });
            }

            var novaArea = new Area
            {
                Nome = atributes.Nome,               
                DataCriacao = DateTime.Now
            };

            _dbContext.Area.Add(novaArea);
            await _dbContext.SaveChangesAsync();

            return Ok(new { message = "Área cadastrada com sucesso!" });
        }

        [HttpPut("/api/UpdateArea")]
        public async Task<ActionResult<Area>> UpdateArea(int Id, AreaUpdateDTO atributes)
        {
            var area = await _dbContext.Area.FindAsync(Id);

            if (area == null) { return NotFound(new { message = "Área não encontrada na base de dados." }); }

            if (!string.IsNullOrEmpty(atributes.Nome)) area.Nome = atributes.Nome;            

            await _dbContext.SaveChangesAsync();

            return Ok(new { message = "Área alterada com sucesso!" });
        }

        [HttpDelete("/api/AreaById")]
        public async Task<IActionResult> DeleteArea(int Id)
        {
            var area = await _dbContext.Area.FindAsync(Id);

            if (area == null) return NotFound(new { message = "Área não encontrada." });

            var processosDaArea = _dbContext.Processo.Where(p => p.IdArea == Id).ToList();                       

            _dbContext.Processo.RemoveRange(processosDaArea);

            _dbContext.Area.Remove(area);

            try
            {
                await _dbContext.SaveChangesAsync();
                return Ok(new { message = $"Área e todos os seus processos foram removidos com sucesso!" });
            }
            catch (Exception error)
            {
                return BadRequest(new { message = "Erro ao deletar: " + error.Message });
            }
        }
    }

}
