using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema; // <--- potrebno za [NotMapped]
using System.Linq;

namespace YugiApi.Models
{
    public class Deck
{
    public int Id { get; set; }
    public string UserId { get; set; }
    public virtual User User { get; set; }

    public List<Card> Cards { get; set; } = new List<Card>(); 
    public ICollection<Card> FusionDeck { get; set; } = new List<Card>();

    [NotMapped] 
    public IEnumerable<Card> AllCards => Cards.Concat(FusionDeck);
}

}
