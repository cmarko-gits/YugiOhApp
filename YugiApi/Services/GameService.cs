using System;
using System.Linq;
using System.Collections.Generic;
using System.Threading.Tasks;
using YugiApi.Models;
using YugiApi.Repositories.Interfaces;

namespace YugiApi.Services
{
    public class GameService
    {
        private readonly IDeckRepository _deckRepo;
        private static readonly Dictionary<string, Game> _activeGames = new(); // statički da pamti sve igre

        public GameService(IDeckRepository deckRepo)
        {
            _deckRepo = deckRepo;
        }

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

            var rng = new Random();
            int n = deck.Cards.Count;
            while (n > 1)
            {
                n--;
                int k = rng.Next(n + 1);
                var temp = deck.Cards[k];
                deck.Cards[k] = deck.Cards[n];
                deck.Cards[n] = temp;
            }


            // izvuci 5 karata u ruku
            for (int i = 0; i < 5; i++)
            {
                if (deck.Cards.Count == 0) break;
                var card = deck.Cards[0];
                deck.Cards.RemoveAt(0);
                game.Hand.Add(card);
            }

            _activeGames[userId] = game;
            return game;
        }

        public async Task<Game?> GetActiveGameAsync(string userId)
        {
            _activeGames.TryGetValue(userId, out var game);
            return game;
        }

        public async Task<Card?> DrawCardAsync(string userId)
        {
            if (!_activeGames.TryGetValue(userId, out var game)) return null;
            if (game.Deck.Cards.Count == 0) return null;

            var card = game.Deck.Cards[0];
            game.Deck.Cards.RemoveAt(0);
            game.Hand.Add(card);
            return card;
        }
     
    }
}
