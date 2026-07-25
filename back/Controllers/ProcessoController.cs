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
                .Where(p => p.area_id == IdArea && p.processo_pai_id == null)
                .ToListAsync();

            if (processos == null || processos.Count == 0) { return NotFound(new { message = "Processos não encontrados na base." }); }

            var processosArea = new List<object>();


            foreach (Processo item in processos)
            {
                ProcessoDetailDTO processoDetalhado = new ProcessoDetailDTO();
                processoDetalhado.Id = item.id;
                processoDetalhado.IdArea = item.area_id;
                processoDetalhado.IdPai = item.processo_pai_id;
                processoDetalhado.Nome = item.nome;
                processoDetalhado.Descricao = item.descricao;
                processoDetalhado.Ferramentas = item.ferramentas;
                processoDetalhado.Responsaveis = item.responsaveis;
                processoDetalhado.Documentacoes = item.documentos;
                processoDetalhado.IsSistemico = item.is_sistemico;
                processoDetalhado.Status = item.status;
                processoDetalhado.SubProcessos = GetSubProcessos(item.id);                

                processosArea.Add(processoDetalhado);
            }


            return Ok(processosArea);
        }

        private List<ProcessoDetailDTO> GetSubProcessos(int id)
        {
            var subProcessos = _dbContext.Processo.Where(p => p.processo_pai_id == id).ToList();


            return subProcessos.Select(item => new ProcessoDetailDTO
            {
                Id = item.id,
                IdArea = item.area_id,
                IdPai = item.processo_pai_id,
                Nome = item.nome,
                Descricao = item.descricao,
                Ferramentas = item.ferramentas,
                Responsaveis = item.responsaveis,
                Documentacoes = item.documentos,
                IsSistemico = item.is_sistemico,
                Status = item.status,
                SubProcessos = GetSubProcessos(item.id)
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
                area_id = atributes.IdArea,
                processo_pai_id = atributes.IdPai,
                nome = atributes.Nome,
                descricao = atributes.Descricao,
                ferramentas = atributes.Ferramentas,
                responsaveis = atributes.Responsaveis,
                documentos = atributes.Documentacoes,
                is_sistemico = atributes.IsSistemico,
                status = atributes.Status,
                data_criacao = DateTime.Now
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

            if (!string.IsNullOrEmpty(atributes.Nome)) processo.nome = atributes.Nome;
            if (!string.IsNullOrEmpty(atributes.Descricao)) processo.descricao = atributes.Descricao;
            if (!string.IsNullOrEmpty(atributes.Ferramentas)) processo.ferramentas = atributes.Ferramentas;
            if (!string.IsNullOrEmpty(atributes.Responsaveis)) processo.responsaveis = atributes.Responsaveis;
            if (!string.IsNullOrEmpty(atributes.Documentacoes)) processo.documentos = atributes.Documentacoes;            
            if (!string.IsNullOrEmpty(atributes.Status)) processo.status = atributes.Status;
            processo.is_sistemico = atributes.IsSistemico;
            processo.data_alteracao = DateTime.Now;

            await _dbContext.SaveChangesAsync();

            return Ok(new { message = "Processo atualizado com sucesso!" });
        }

        [HttpDelete("/api/ProcessoById")]
        public async Task<IActionResult> DeleteProcess(int Id)
        {
            var subprocessos = _dbContext.Processo.Where(p => p.processo_pai_id == Id);
            _dbContext.Processo.RemoveRange(subprocessos);

            var processo = await _dbContext.Processo.FindAsync(Id);

            if (processo == null) return NotFound(new { message = "Processo não encontrado." });

            _dbContext.Processo.Remove(processo);
            await _dbContext.SaveChangesAsync();

            return Ok(new { message = $"Processo removido com sucesso!" });
        }
    }

}
