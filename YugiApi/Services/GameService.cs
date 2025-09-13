using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using YugiApi.Models;
using YugiApi.Repositories.Interfaces;

namespace YugiApi.Services
{
    public class GameService
    {
        private readonly IDeckRepository _deckRepo;
        private readonly IGameRepository _gameRepo;

        public GameService(IDeckRepository deckRepo, IGameRepository gameRepo)
        {
            _deckRepo = deckRepo;
            _gameRepo = gameRepo;
        }

        // Pokretanje nove igre
        public async Task<Game?> StartGameAsync(string userId)
        {
            var deck = await _deckRepo.GetOrCreateDeckByUserIdAsync(userId);
            if (deck.Cards.Count == 0) return null;

            var game = new Game
            {
                UserId = userId,
                Deck = deck,
                Hand = new List<Card>(),
                MonsterZone = Enumerable.Repeat<Card?>(null, 5).ToList(),
                SpellTrapZone = Enumerable.Repeat<Card?>(null, 5).ToList(),
                Graveyard = new List<Card>(),
                Banished = new List<Card>()
            };

            // Shuffle deck
            ShuffleDeck(deck.Cards);

            // Izvuci prvih 5 karata u ruku
            for (int i = 0; i < 5 && deck.Cards.Count > 0; i++)
            {
                var card = deck.Cards[0];
                deck.Cards.RemoveAt(0);
                game.Hand.Add(card);
            }

            await _gameRepo.SaveGameAsync(game);
            return game;
        }

        // Dobij aktivnu igru
        public async Task<Game?> GetActiveGameAsync(string userId)
        {
            return await _gameRepo.GetActiveGameAsync(userId);
        }

        // Vuci kartu iz deck-a u ruku
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

        // Privatna metoda za shuffle karata
        private void ShuffleDeck(List<Card> cards)
        {
               cards = cards.OrderBy(c => Guid.NewGuid()).ToList();

        }
    }
}
