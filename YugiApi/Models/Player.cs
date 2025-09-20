namespace YugiApi.Models
{
    public class Player
    {
        
        public string UserId { get; set; } = null!;
        public Deck Deck { get; set; } = null!;
        public List<Card> Hand { get; set; } = new();
        public List<CardSlot?> MonsterZone { get; set; } = Enumerable.Repeat<CardSlot?>(null, 5).ToList();
        public List<CardSlot?> SpellTrapZone { get; set; } = Enumerable.Repeat<CardSlot?>(null, 5).ToList();
        public List<Card> Graveyard { get; set; } = new();
        public List<Card> Banished { get; set; } = new();
 
    }
}