using System.Collections.Generic;

namespace YugiApi.Models
{
    public class Deck
    {
        public int Id { get; set; }
        public string UserId { get; set; }
        public virtual User User { get; set; }
        public virtual ICollection<Card> Cards { get; set; } = new List<Card>();
        public virtual ICollection<Card> Graveyard { get; set; } = new List<Card>();
        public ICollection<Card> FusionDeck { get; set; } = new List<Card>();
        public virtual ICollection<Card> Banished { get; set; } = new List<Card>();
    }
}
