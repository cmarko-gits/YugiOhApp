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

        public async Task<(bool Success, string Message)> SummonAsync(
            string userId,
            int cardId,
            bool inAttackMode,
            int[] tributeIds
        )
        {
            var game = await _gameRepo.GetActiveGameAsync(userId);
            if (game == null) return (false, "Igra nije pokrenuta.");

            var card = game.Hand.FirstOrDefault(c => c.Id == cardId);
            if (card == null) return (false, "Karta nije u ruci.");
            if (string.IsNullOrWhiteSpace(card.Type) || !card.Type.ToLower().Contains("monster"))
                return (false, "Ova karta nije čudovište.");

            if (card.Level <= 4)
            {
                // normal summon
                var index = game.MonsterZone.FindIndex(c => c == null);
                if (index == -1) return (false, "Nema slobodnog mesta u Monster zoni.");

                game.Hand.Remove(card);
                game.MonsterZone[index] = new CardSlot
                {
                    Card = card,
                    IsFaceUp = true,
                    Position = inAttackMode ? "Attack" : "Defense"
                };

                await _gameRepo.SaveGameAsync(game);
                return (true, $"Karta {card.Name} uspešno prizvana u {(inAttackMode ? "Attack" : "Defense")} modu.");
            }
            else
            {
                // tribute summon
                int requiredTributes = card.Level >= 7 ? 2 : 1;
                if (tributeIds == null || tributeIds.Length != requiredTributes)
                    return (false, $"Ovaj monstrum zahtijeva {requiredTributes} tribute(a).");

                var playerZone = game.MonsterZone;
                var tributeIndexes = new List<int>();

                foreach (var tId in tributeIds)
                {
                    var idx = playerZone.FindIndex(slot => slot?.Card?.Id == tId);
                    if (idx == -1) return (false, $"Tribute karta sa ID {tId} nije pronađena u Monster zoni.");
                    tributeIndexes.Add(idx);
                }

                if (tributeIndexes.Distinct().Count() != tributeIndexes.Count)
                    return (false, "Ne možete koristiti istu kartu više puta kao tribute.");

                foreach (var idx in tributeIndexes)
                {
                    var slot = playerZone[idx];
                    if (slot?.Card == null || !slot.Card.Type.ToLower().Contains("monster"))
                        return (false, $"Karta u monster slotu {idx} nije čudovište i ne može biti tribute.");
                }

                var orderedIndexes = tributeIndexes.OrderByDescending(i => i).ToList();
                foreach (var idx in orderedIndexes)
                {
                    var sacrificed = playerZone[idx]?.Card;
                    if (sacrificed != null)
                    {
                        game.Graveyard.Add(sacrificed);
                        game.MonsterZone[idx] = null;
                    }
                }

                var freeIndex = game.MonsterZone.FindIndex(s => s == null);
                if (freeIndex == -1) return (false, "Nema slobodnog mesta u Monster zoni za prizivanje.");

                game.Hand.Remove(card);
                game.MonsterZone[freeIndex] = new CardSlot
                {
                    Card = card,
                    IsFaceUp = true,
                    Position = inAttackMode ? "Attack" : "Defense"
                };

                await _gameRepo.SaveGameAsync(game);
                return (true, $"Karta {card.Name} uspešno prizvana uz {requiredTributes} tribute(a) u {(inAttackMode ? "Attack" : "Defense")} modu.");
            }
        }

        private void ShuffleDeck(List<Card> cards)
        {
            var rng = new Random();
            var shuffled = cards.OrderBy(_ => rng.Next()).ToList();
            cards.Clear();
            cards.AddRange(shuffled);
        }

        public async Task<(bool Success, string ErrorMessage)> PlaceSpellTrapAsync(string userId, int cardId)
        {
            var game = await _gameRepo.GetActiveGameAsync(userId);
            if (game == null) return (false, "Igra nije pokrenuta.");

            var card = game.Hand.FirstOrDefault(c => c.Id == cardId);
            if (card == null) return (false, "Karta nije u ruci.");
            if (string.IsNullOrWhiteSpace(card.Type) || (!card.Type.ToLower().Contains("spell") && !card.Type.ToLower().Contains("trap")))
                return (false, "Ova karta nije Spell ili Trap.");

            var index = game.SpellTrapZone.FindIndex(c => c == null);
            if (index == -1) return (false, "Nema slobodnog mesta u Spell/Trap zoni.");

            game.Hand.Remove(card);
            game.SpellTrapZone[index] = new CardSlot
            {
                Card = card,
                IsFaceUp = false,
                Position = "Set"
            };

            await _gameRepo.SaveGameAsync(game);
            return (true, "Karta uspešno postavljena.");
        }
    }
}
