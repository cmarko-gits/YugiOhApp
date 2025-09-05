

   using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using YugiApi.Dtos;

namespace YugiApi.Models
{
    [Table("Cards")]
    public class Card
{
    [Key]
    public int Id { get; set; }
    public string Name { get; set; }
    public string Type { get; set; }
    public string Desc { get; set; }
    public string Race { get; set; }
    public string ImageUrl { get; set; }
    public int? Attack {get; set; }
    public int? Defense { get; set; }
    }

}

