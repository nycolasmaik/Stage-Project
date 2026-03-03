using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Stage_API.Models
{
    [Table("usuario")]
    public class Usuario
    {
        [Key]
        public int Id { get; set; }
        public string Nome { get; set; } = string.Empty;
        public string User { get; set; } = string.Empty;
        public string Senha { get; set; } = string.Empty;
        public bool? Ativo { get; set; } = true;
        public DateTime Data_criacao { get; set; }
        public int Id_usuario_criacao { get; set; }

    }

    public class UsuarioCreateDTO
    {
        public required string Nome { get; set; }
        public required string User { get; set; }
        public required string Senha { get; set; }
        public int Id_usuario_criacao { get; set; }
        [JsonIgnore]
        public DateTime Data_criacao { get; set; } = DateTime.Now;
    }

    public class UsuarioUpdateDTO
    {
        public string? Nome { get; set; }
        public string? User { get; set; }
        public string? Senha { get; set; }
        public bool? Ativo { get; set; }
    }
}
