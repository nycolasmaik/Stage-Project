using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Routing.Template;
using Microsoft.EntityFrameworkCore;
using Stage_API.Data;
using Stage_API.Models;
using System;

namespace Stage_API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProcessoController : ControllerBase
    {
        private readonly AppDb _dbContext;

        public ProcessoController(AppDb context)
        {
            _dbContext = context;
        }

        [HttpGet("/api/GetProcess")]
        public async Task<ActionResult<Processo>> GetProcess(int IdArea)
        {
            var processos = await _dbContext.Processo
                .Where(p => p.IdArea == IdArea && p.IdPai == null)
                .ToListAsync();

            if (processos == null || processos.Count == 0) { return NotFound(new { message = "Processos não encontradas na base." }); }

            var processosArea = new List<object>();


            foreach (Processo item in processos)
            {
                ProcessoDetailDTO processoDetalhado = new ProcessoDetailDTO();
                processoDetalhado.Id = item.Id;
                processoDetalhado.IdArea = item.IdArea;
                processoDetalhado.IdPai = item.IdPai;
                processoDetalhado.Nome = item.Nome;
                processoDetalhado.Descricao = item.Descricao;
                processoDetalhado.Ferramentas = item.Ferramentas;
                processoDetalhado.Responsaveis = item.Responsaveis;
                processoDetalhado.Documentacoes = item.Documentacoes;
                processoDetalhado.IsSistemico = item.IsSistemico;
                processoDetalhado.Status = item.Status;
                processoDetalhado.SubProcessos = GetSubProcessos(item.Id);                

                processosArea.Add(processoDetalhado);
            }


            return Ok(processosArea);
        }

        private List<ProcessoDetailDTO> GetSubProcessos(int id)
        {
            var subProcessos = _dbContext.Processo.Where(p => p.IdPai == id).ToList();


            return subProcessos.Select(item => new ProcessoDetailDTO
            {
                Id = item.Id,
                IdArea = item.IdArea,
                IdPai = item.IdPai,
                Nome = item.Nome,
                Descricao = item.Descricao,
                Ferramentas = item.Ferramentas,
                Responsaveis = item.Responsaveis,
                Documentacoes = item.Documentacoes,
                IsSistemico = item.IsSistemico,
                Status = item.Status,
                SubProcessos = GetSubProcessos(item.Id)
            }).ToList();
        }

        [HttpPost("/api/CreateProcess")]
        public async Task<ActionResult<Processo>> CreateProcess(ProcessoCreateDTO atributes)
        {
            if (atributes == null)
            {
                return BadRequest(new { message = "Falha ao criar processo." });
            }

            var area = await _dbContext.Area.FindAsync(atributes.IdArea);
            if (area == null)
            {
                return BadRequest(new { message = "Falha ao criar processo. Área não encontrada." });
            }

            if (String.IsNullOrEmpty(atributes.Nome) || String.IsNullOrEmpty(atributes.Status))
            {
                return BadRequest(new { message = $"Falha ao criar processo. Revise os campos obrigatórios." });
            }

            var novoProcesso = new Processo
            {
                IdArea = atributes.IdArea,
                IdPai = atributes.IdPai,
                Nome = atributes.Nome,
                Descricao = atributes.Descricao,
                Ferramentas = atributes.Ferramentas,
                Responsaveis = atributes.Responsaveis,
                Documentacoes = atributes.Documentacoes,
                IsSistemico = atributes.IsSistemico,
                Status = atributes.Status,
                DataCriacao = DateTime.Now
            };

            _dbContext.Processo.Add(novoProcesso);
            await _dbContext.SaveChangesAsync();

            return Ok(new { message = "Processo cadastrado com sucesso!" });
        }

        [HttpPut("/api/UpdateProcess")]
        public async Task<ActionResult<Processo>> UpdateProcess(int Id, ProcessoUpdateDTO atributes)
        {
            if (atributes == null)
            {
                return BadRequest(new { message = "Falha ao criar processo." });
            }

            var area = await _dbContext.Area.FindAsync(atributes.IdArea);
            if (area == null)
            {
                return BadRequest(new { message = "Falha ao atualizar processo. Área não encontrada." });
            }

            var processo = await _dbContext.Processo.FindAsync(Id);
            if (processo == null) { return NotFound("Falha ao atualizar processo."); }

            if (!string.IsNullOrEmpty(atributes.Nome)) processo.Nome = atributes.Nome;
            if (!string.IsNullOrEmpty(atributes.Descricao)) processo.Descricao = atributes.Descricao;
            if (!string.IsNullOrEmpty(atributes.Ferramentas)) processo.Ferramentas = atributes.Ferramentas;
            if (!string.IsNullOrEmpty(atributes.Responsaveis)) processo.Responsaveis = atributes.Responsaveis;
            if (!string.IsNullOrEmpty(atributes.Documentacoes)) processo.Documentacoes = atributes.Documentacoes;            
            if (!string.IsNullOrEmpty(atributes.Status)) processo.Status = atributes.Status;
            processo.IsSistemico = atributes.IsSistemico;
            processo.DataAlteracao = DateTime.Now;

            await _dbContext.SaveChangesAsync();

            return Ok(new { message = "Processo cadastrado com sucesso!" });
        }

        [HttpDelete("/api/ProcessoById")]
        public async Task<IActionResult> DeleteProcess(int Id)
        {
            var processo = await _dbContext.Processo.FindAsync(Id);

            if (processo == null) return NotFound(new { message = "Processo não encontrado." });

            _dbContext.Processo.Remove(processo);
            await _dbContext.SaveChangesAsync();

            return Ok(new { message = $"Processo removido com sucesso!" });
        }
    }

}
