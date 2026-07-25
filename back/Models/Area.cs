using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Stage_API.Models
{
    [Table("areas")]
    public class Area
    {
        [Key]
        public int id { get; set; }
        public string nome { get; set; } = string.Empty;
        public DateTime? data_criacao { get; set; }        
    }
    public class AreaCreateDTO
    {
        public required string Nome { get; set; }
        
        [JsonIgnore]
        public DateTime? Datacriacao { get; set; } = DateTime.Now;
    }
    public class AreaUpdateDTO
    {
        public required string Nome { get; set; }

        [JsonIgnore]
        public DateTime? Datacriacao { get; set; } = DateTime.Now;
    }
}