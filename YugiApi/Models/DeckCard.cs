namespace YugiApi.Models
{
    public class DeckCard
    {
        public int DeckId { get; set; }
        public Deck Deck { get; set; }
        public int CardId { get; set; }
        public Card Card { get; set; }

    }
}