using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Stage_API.Models
{
    [Table("processos")]
    public class Processo
    {
        [Key]

        public int id { get; set; }
        public int area_id { get; set; }
        public int? processo_pai_id { get; set; }
        public string nome { get; set; } = string.Empty;
        public string? descricao { get; set; }
        public string? ferramentas { get; set; }
        public string? responsaveis { get; set; }
        public string? documentos { get; set; }
        public bool is_sistemico { get; set; }
        public string? status { get; set; }
        public DateTime? data_criacao { get; set; }
        public DateTime? data_alteracao { get; set; }
    }

    public class ProcessoCreateDTO
    {   
        public int IdArea { get; set; }
        public int? IdPai { get; set; }
        public string Nome { get; set; } = string.Empty;
        public string? Descricao { get; set; }
        public string? Ferramentas { get; set; }
        public string? Responsaveis { get; set; }
        public string? Documentacoes { get; set; }
        public bool IsSistemico { get; set; }
        public string? Status { get; set; }
        [JsonIgnore]
        public DateTime? DataCriacao { get; set; }
        [JsonIgnore]
        public DateTime? DataAlteracao { get; set; }
    }

    public class ProcessoUpdateDTO
    {
        [JsonIgnore]
        public int Id { get; set; }
        public int IdArea { get; set; }
        public int? IdPai { get; set; }
        public string Nome { get; set; } = string.Empty;
        public string? Descricao { get; set; }
        public string? Ferramentas { get; set; }
        public string? Responsaveis { get; set; }
        public string? Documentacoes { get; set; }
        public bool IsSistemico { get; set; }
        public string? Status { get; set; }
        [JsonIgnore]
        public DateTime? DataCriacao { get; set; } = DateTime.Now;
        [JsonIgnore]
        public DateTime? DataAlteracao { get; set; } = DateTime.Now;
    }

    public class ProcessoDetailDTO { 
        public int Id { get; set; }
        public int IdArea { get; set; }
        public int? IdPai { get; set; }
        public string Nome { get; set; }
        public string Descricao { get; set; }
        public string Ferramentas { get; set; }
        public string Responsaveis { get; set; }
        public string Documentacoes { get; set; }
        public bool IsSistemico { get; set; }
        public string  Status { get; set; }

        public List<ProcessoDetailDTO> SubProcessos { get; set; } = new List<ProcessoDetailDTO>();
    }
}
