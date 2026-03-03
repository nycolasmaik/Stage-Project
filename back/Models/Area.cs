using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Stage_API.Models
{
    [Table("Areas")]
    public class Area
    {
        [Key]
        public int Id { get; set; }
        public string Nome { get; set; } = string.Empty;
        public DateTime? DataCriacao { get; set; }        
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