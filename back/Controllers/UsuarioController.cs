using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Stage_API.Data;
using Stage_API.Models;

namespace Stage_API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsuarioController : ControllerBase
    {
        private readonly AppDb _dbContext;

        public UsuarioController(AppDb context)
        {
            _dbContext = context;
        }

        [HttpGet("/api/AllUsers")]
        public async Task<ActionResult<Usuario>> GetAllUsers()
        {
            var usuarios = await _dbContext.Usuario.ToListAsync();

            if (usuarios == null || usuarios.Count == 0) { return NotFound(new { message = "Usuários não encontrados na base." }); }

            return Ok(usuarios);
        }

        [HttpGet("/api/UserById")]
        public async Task<ActionResult<Usuario>> GetUserById(int Id)
        {
            var usuario = await _dbContext.Usuario.FindAsync(Id);

            if (usuario == null) { return NotFound( new { message = "Usuário não encontrado na base de dados." }); }

            return Ok(usuario);
        }

        [HttpPost("/api/CreateUser")]
        public async Task<ActionResult<Usuario>> CreateUser(UsuarioCreateDTO atributes)
        {
            if (String.IsNullOrWhiteSpace(atributes.Nome) || String.IsNullOrWhiteSpace(atributes.User) || String.IsNullOrWhiteSpace(atributes.Senha))
            {
                return BadRequest(new { message = "Falha ao criar usuário.<br>Revise os campos obrigátórios para criar um novo usuário" });
            }

            var novoUsuario = new Usuario
            {
                Nome = atributes.Nome,
                User = atributes.User,
                Senha = atributes.Senha,
                Ativo = true,
                Data_criacao = atributes.Data_criacao,
                Id_usuario_criacao = atributes.Id_usuario_criacao

            };

            _dbContext.Usuario.Add(novoUsuario);
            await _dbContext.SaveChangesAsync();

            return Ok(new { message = "Usuário criado com sucesso!" });
        }

        [HttpPut("/api/UpdateUser")]
        public async Task<ActionResult<Usuario>> UpdateUser(int Id, UsuarioUpdateDTO atributes)
        {
            var usuario = await _dbContext.Usuario.FindAsync(Id);

            if (usuario == null) { return NotFound(new { message = "Usuário não encontrado na base de dados." }); }

            if (!string.IsNullOrEmpty(atributes.Nome)) usuario.Nome = atributes.Nome;
            if (!string.IsNullOrEmpty(atributes.User)) usuario.User = atributes.User;
            if (!string.IsNullOrEmpty(atributes.Senha)) usuario.Senha = atributes.Senha;            
            if (atributes.Ativo != null) usuario.Ativo = atributes.Ativo;

            await _dbContext.SaveChangesAsync();

            return Ok(usuario);
        }

        [HttpDelete("/api/UserById")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var usuario = await _dbContext.Usuario.FindAsync(id);

            if (usuario == null) return NotFound(new { message = "Usuário não encontrado." });

            _dbContext.Usuario.Remove(usuario);
            await _dbContext.SaveChangesAsync();

            return Ok(new { message = $"Usuário removido com sucesso!" });
        }
    }

}
