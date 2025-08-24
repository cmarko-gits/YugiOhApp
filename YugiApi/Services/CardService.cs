using System.Net.Http;
using System.Text.Json;
using YugiApi.Models;
using YugiApi.Dtos;
using YugiApi.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;
namespace YugiApi.Services
{
    public class CardService
    {
        private readonly ICardRepository _cardRepository;
        private readonly HttpClient _httpClient;
        private readonly string _apiUrl = "https://db.ygoprodeck.com/api/v7/cardinfo.php";

        public CardService(ICardRepository cardRepository, HttpClient httpClient)
        {
            _cardRepository = cardRepository;
            _httpClient = httpClient;
        }

        public async Task<List<Card>> GetAllCardsAsync(int page = 1, int pageSize = 50)
        {
            // Ako baza nema karata, automatski ih ubaci
            var firstPage = await _cardRepository.GetAllAsync(1, 1);
            if (!firstPage.Any())
            {
                await SyncCardsFromApiAsync();
            }

            return await _cardRepository.GetAllAsync(page, pageSize);
        }

        public async Task<Card> GetCardByIdAsync(int id)
        {
            return await _cardRepository.GetByIdAsync(id);
        }

        public async Task SyncCardsFromApiAsync()
        {
            var json = await _httpClient.GetStringAsync(_apiUrl);
            var root = JsonSerializer.Deserialize<YgoApiResponse>(json, new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            });

            if (root?.Data == null) return;

            foreach (var card in root.Data)
            {
                if (!await _cardRepository.ExistsByNameAsync(card.Name))
                {
                    await _cardRepository.AddAsync(card);
                }
            }

            await _cardRepository.SaveChangesAsync();
        }

        public async Task<List<Card>> SearchCardsByNameAsync(string searchTerm)
        {
            return await _cardRepository.SearchByNameAsync(searchTerm);
        }

         public async Task<List<Card>> GetFilteredCardsAsync(
            string name = null,
            string type = null,
            int page = 1,
            int pageSize = 50)
        {
            var query = _cardRepository.GetFilters(); 

            if (!string.IsNullOrEmpty(name))
                query = query.Where(c => c.Name.Contains(name));

            if (!string.IsNullOrEmpty(type))
                query = query.Where(c => c.Type == type);

            
            var result = await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync(); 

            return result;
        }
    }
}

