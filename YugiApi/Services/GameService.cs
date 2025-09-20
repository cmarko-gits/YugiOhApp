using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using YugiApi.Models;
using YugiApi.Repositories.Interfaces;
using YugiApi.Services.Interfaces;

namespace YugiApi.Services
{
    public class GameService : IGameService
    {
        private readonly IDeckRepository _deckRepo;
        private readonly IGameRepository _gameRepo;

        public GameService(IDeckRepository deckRepo, IGameRepository gameRepo)
        {
            _deckRepo = deckRepo;
            _gameRepo = gameRepo;
        }

        public async Task<Game?> StartGameAsync(string userId)
        {
            var deck = await _deckRepo.GetOrCreateDeckByUserIdAsync(userId);
            if (deck == null || deck.Cards.Count == 0) return null;

            var game = new Game
            {
                UserId = userId,
                Deck = deck,
                Hand = new List<Card>(),
                MonsterZone = Enumerable.Repeat<CardSlot?>(null, 5).ToList(),
                SpellTrapZone = Enumerable.Repeat<CardSlot?>(null, 5).ToList(),
                Graveyard = new List<Card>(),
                Banished = new List<Card>()
            };

            ShuffleDeck(deck.Cards);

            for (int i = 0; i < 5 && deck.Cards.Count > 0; i++)
            {
                var card = deck.Cards[0];
                deck.Cards.RemoveAt(0);
                game.Hand.Add(card);
            }

            await _gameRepo.SaveGameAsync(game);
            return game;
        }

        public async Task<Game?> GetActiveGameAsync(string userId)
        {
            return await _gameRepo.GetActiveGameAsync(userId);
        }

        public async Task<Card?> DrawCardAsync(string userId)
        {
            var game = await _gameRepo.GetActiveGameAsync(userId);
            if (game == null || game.Deck.Cards.Count == 0) return null;

            var card = game.Deck.Cards[0];
            game.Deck.Cards.RemoveAt(0);
            game.Hand.Add(card);

            await _gameRepo.SaveGameAsync(game);
            return card;
        }
public async Task<(bool Success, string ErrorMessage)> SummonMonsterAsync(
    string userId,
    int cardId,
    List<int> tributeIds,
    bool inAttackMode)
{
    var game = await _gameRepo.GetActiveGameAsync(userId);
    if (game == null) return (false, "Igra nije pokrenuta.");

    var card = game.Hand.FirstOrDefault(c => c.Id == cardId);
    if (card == null) return (false, "Karta nije u ruci.");
    if (!card.Type.Contains("Monster")) return (false, "Ova karta nije čudovište.");

    // Normal summon: Level ≤ 4
    if (card.Level <= 4)
    {
        var summonIndex = game.MonsterZone.FindIndex(slot => slot == null);
        if (summonIndex == -1)
            return (false, "Monster zona je puna. Nije moguće prizvati ovu kartu.");

        // Normal summon ignoriše tributeIds
        game.Hand.Remove(card);
        game.MonsterZone[summonIndex] = new CardSlot
        {
            Card = card,
            IsFaceUp = true,
            Position = inAttackMode ? "Attack" : "Defense"
        };

        await _gameRepo.SaveGameAsync(game);
        return (true, $"Karta {card.Name} uspešno prizvana.");
    }

    // Tribute summon: Level > 4
    int requiredTributes = card.Level > 6 ? 2 : 1;
    if (tributeIds == null || tributeIds.Count != requiredTributes)
        return (false, $"Ova karta zahteva {requiredTributes} tribute karte.");

    var tributeCards = game.MonsterZone
        .Where(slot => slot != null && tributeIds.Contains(slot.Card.Id))
        .Select(slot => slot.Card)
        .ToList();

    if (tributeCards.Count != tributeIds.Count)
        return (false, "Neki od tribute karata nisu u zoni ili ne postoje.");

    // Ukloni tribute karte iz MonsterZone i prebaci u Graveyard
    foreach (var tribute in tributeCards)
    {
        var tributeIndex = game.MonsterZone.FindIndex(slot => slot?.Card.Id == tribute.Id);
        game.MonsterZone[tributeIndex] = null;
        game.Graveyard.Add(tribute);
    }

    var summonIndex2 = game.MonsterZone.FindIndex(slot => slot == null);
    if (summonIndex2 == -1) return (false, "Nema slobodnog mesta u Monster zoni.");

    game.Hand.Remove(card);
    game.MonsterZone[summonIndex2] = new CardSlot
    {
        Card = card,
        IsFaceUp = true,
        Position = inAttackMode ? "Attack" : "Defense"
    };

    await _gameRepo.SaveGameAsync(game);
    return (true, $"Karta {card.Name} uspešno prizvana uz tribute.");
}


       public async Task<(bool Success, string ErrorMessage)> PlaceSpellTrapAsync(string userId, int cardId)
{
    var game = await _gameRepo.GetActiveGameAsync(userId);
    if (game == null) return (false, "Igra nije pokrenuta.");

    var card = game.Hand.FirstOrDefault(c => c.Id == cardId);
    if (card == null) return (false, "Karta nije u ruci.");
    if (card.Type != "Spell Card" && card.Type != "Trap Card") return (false, "Karta nije Spell/Trap.");

    var index = game.SpellTrapZone.FindIndex(c => c == null);
    if (index == -1) return (false, "Nema mesta u Spell/Trap zoni.");

    game.Hand.Remove(card);
    game.SpellTrapZone[index] = new CardSlot
    {
        Card = card,
        IsFaceUp = false
    };

    await _gameRepo.SaveGameAsync(game);
    return (true, "");
}


        private void ShuffleDeck(List<Card> cards)
        {
            var rng = new Random();
            var shuffled = cards.OrderBy(_ => rng.Next()).ToList();
            cards.Clear();
            cards.AddRange(shuffled);
        }

  

    }
}