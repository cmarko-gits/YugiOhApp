using System.Collections.Generic;

namespace YugiApi.Models
{
   public class Game
{
    public string UserId { get; set; } = null!;
    public Deck Deck { get; set; } = null!;
    public List<Card> Hand { get; set; } = new();
    public List<CardSlot?> MonsterZone { get; set; } = Enumerable.Repeat<CardSlot?>(null, 5).ToList();
    public List<CardSlot?> SpellTrapZone { get; set; } = Enumerable.Repeat<CardSlot?>(null, 5).ToList();
    public List<Card> Graveyard { get; set; } = new();
    public List<Card> Banished { get; set; } = new();

    private Queue<Card> _deckQueue = null!;

    public void Initialize()
    {
        _deckQueue = new Queue<Card>(Deck.Cards.OrderBy(_ => new Random().Next()));
    }

    public Card? DeckQueueDequeue()
    {
        if (_deckQueue == null || _deckQueue.Count == 0)
            return null;
        return _deckQueue.Dequeue();
    }
}

    
}
