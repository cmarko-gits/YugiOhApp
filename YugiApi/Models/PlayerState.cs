namespace YugiApi.Models
{
    public class PlayerState
    {
        public string PlayerId { get; set; } = null!;
        public Deck Deck { get; set; } = null!;
        public List<Card> Hand { get; set; } = new();
        public List<Card?> MonsterZone { get; set; } = new();
        public List<Card?> SpellTrapZone { get; set; } = new();
        public List<Card> Graveyard { get; set; } = new();
        public List<Card> Banished { get; set; } = new();
    }
}