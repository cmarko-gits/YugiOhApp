using Microsoft.EntityFrameworkCore;
using YugiApi.Data;
using YugiApi.Models;
using System.Linq;
using System.Threading.Tasks;
using YugiApi.Repositories.Interfaces;

namespace YugiApi.Repositories
{
    public class DeckRepository : IDeckRepository
    {
        private readonly AppDbContext _context;

        public DeckRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<Deck> GetDeckByUserIdAsync(string userId)
        {
            return await _context.Decks
                .Include(d => d.Cards)
                .Include(d => d.FusionDeck)
                .FirstOrDefaultAsync(d => d.UserId == userId);
        }

        public async Task AddCardToDeckAsync(string userId, int cardId)
        {
            var deck = await GetDeckByUserIdAsync(userId);
            if (deck == null)
            {
                deck = new Deck { UserId = userId };
                _context.Decks.Add(deck);
            }

            if (deck.Cards.Any(c => c.Id == cardId))
                throw new System.Exception("Karta je vec postavljena u deck");

            var card = await _context.Cards.FindAsync(cardId);
            if (card == null)
                throw new System.Exception("Karta nije pronađena.");

            if (card.Type != null && card.Type.Contains("Fusion"))
                throw new System.Exception("Fusion Monsters cannot be added to the main deck");

            deck.Cards.Add(card);
            await _context.SaveChangesAsync();
        }

        public async Task RemoveCardFromDeckAsync(string userId, int cardId)
        {
            var deck = await GetDeckByUserIdAsync(userId);
            if (deck == null)
                throw new System.Exception("Deck nije pronađen");

            var card = deck.Cards.FirstOrDefault(c => c.Id == cardId);
            if (card == null)
                throw new System.Exception("Karta nije pronađena u decku");

            deck.Cards.Remove(card);
            await _context.SaveChangesAsync();
        }

        public async Task AddCardToFusionDeckAsync(string userId, int cardId)
        {
            var deck = await GetDeckByUserIdAsync(userId);
            if (deck == null)
            {
                deck = new Deck { UserId = userId };
                _context.Decks.Add(deck);
            }

            if (deck.FusionDeck.Any(c => c.Id == cardId))
                throw new System.Exception("Karta je već u Fusion Deck-u");

            var card = await _context.Cards.FindAsync(cardId);
            if (card == null)
                throw new System.Exception("Karta nije pronađena.");

            if (card.Type == null || !card.Type.Contains("Fusion"))
                throw new System.Exception("Samo Fusion Monster karte mogu u Fusion Deck!");

            deck.FusionDeck.Add(card);
            await _context.SaveChangesAsync();
        }

        public async Task RemoveCardFromFusionDeckAsync(string userId, int cardId)
        {
            var deck = await GetDeckByUserIdAsync(userId);
            if (deck == null)
                throw new System.Exception("Deck nije pronađen");

            var card = deck.FusionDeck.FirstOrDefault(c => c.Id == cardId);
            if (card == null)
                throw new System.Exception("Karta nije pronađena u Fusion Deck-u");

            deck.FusionDeck.Remove(card);
            await _context.SaveChangesAsync();
        }

        public async Task<Deck> GetOrCreateDeckByUserIdAsync(string userId)
        {
            var deck = await _context.Decks
                .Include(d => d.Cards)
                .Include(d => d.FusionDeck)
                .FirstOrDefaultAsync(d => d.UserId == userId);

            if (deck == null)
            {
                deck = new Deck
                {
                    UserId = userId,
                    Cards = new List<Card>(),
                    FusionDeck = new List<Card>()
                };
                _context.Decks.Add(deck);
                await _context.SaveChangesAsync();
            }

            return deck;
        }

       

    }
}
