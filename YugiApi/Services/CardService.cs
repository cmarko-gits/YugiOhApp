using System.Net.Http;
using System.Text.Json;
using YugiApi.Models;
using YugiApi.Repositories.Interfaces;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using YugiApi.Dtos;

namespace YugiApi.Services
{
    public class CardService
    {
        private readonly HttpClient _httpClient;
        private readonly ICardRepository _cardRepository;

        public CardService(HttpClient httpClient, ICardRepository cardRepository)
        {
            _httpClient = httpClient;
            _cardRepository = cardRepository;
        }

        public async Task<(List<Card> Cards, int TotalCount)> GetCardsAsync(
    string name = null,
    string type = null,
    string race = null,
    int? minAtk = null,
    int? maxAtk = null,
    int? level = null,
    int page = 1,
    int pageSize = 50)
{
    var query = _cardRepository.GetFilters();

    // Normalizuj type parametar
    if (!string.IsNullOrWhiteSpace(type))
    {
        type = type.Trim().ToLower();
        if (type == "monster") type = "Monster";
        else if (type == "spell") type = "Spell Card";
        else if (type == "trap") type = "Trap Card";
    }

    // Filtriranje
    if (!string.IsNullOrWhiteSpace(name))
        query = query.Where(c => EF.Functions.Like(c.Name.ToLower(), $"%{name.Trim().ToLower()}%"));

    if (!string.IsNullOrWhiteSpace(type))
        query = query.Where(c => EF.Functions.Like(c.Type.ToLower(), $"%{type}%"));

    if (!string.IsNullOrWhiteSpace(race))
        query = query.Where(c => EF.Functions.Like(c.Race.ToLower(), $"%{race.Trim().ToLower()}%"));

    if (minAtk.HasValue)
        query = query.Where(c => c.Attack >= minAtk.Value);

    if (maxAtk.HasValue)
        query = query.Where(c => c.Attack <= maxAtk.Value);

    if (level.HasValue)
        query = query.Where(c => c.Level == level.Value);

    int totalCount = await query.CountAsync();

    var cards = await query
        .OrderBy(c => c.Id)
        .Skip((page - 1) * pageSize)
        .Take(pageSize)
        .ToListAsync();

    // Ako baza nema karte, povuci sa API-ja
    if (!cards.Any() && !await _cardRepository.AnyAsync(c => true))
    {
        string apiUrl = "https://db.ygoprodeck.com/api/v7/cardinfo.php";
        var response = await _httpClient.GetAsync(apiUrl);
        response.EnsureSuccessStatusCode();
        var jsonString = await response.Content.ReadAsStringAsync();

        var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
        var apiResponse = JsonSerializer.Deserialize<YgoApiResponse>(jsonString, options);

        var allCards = apiResponse.Data.Select(c =>
        {
            var firstImage = c.CardImages?.FirstOrDefault();
            return new Card
            {
                Id = c.Id,
                Name = c.Name,
                Type = c.Type,
                Desc = c.Desc,
                Race = c.Race,
                Level = c.Level,
                Attack = c.Atk,
                Defense = c.Def,
                ImageUrl = firstImage?.ImageUrl
            };
        }).ToList();

        await _cardRepository.AddRangeAsync(allCards);

        // Ponovo primeni filter
        query = _cardRepository.GetFilters();

        if (!string.IsNullOrWhiteSpace(name))
            query = query.Where(c => EF.Functions.Like(c.Name.ToLower(), $"%{name.Trim().ToLower()}%"));
        if (!string.IsNullOrWhiteSpace(type))
            query = query.Where(c => EF.Functions.Like(c.Type.ToLower(), $"%{type}%"));
        if (!string.IsNullOrWhiteSpace(race))
            query = query.Where(c => EF.Functions.Like(c.Race.ToLower(), $"%{race.Trim().ToLower()}%"));
        if (minAtk.HasValue)
            query = query.Where(c => c.Attack >= minAtk.Value);
        if (maxAtk.HasValue)
            query = query.Where(c => c.Attack <= maxAtk.Value);
        if (level.HasValue)
            query = query.Where(c => c.Level == level.Value);

        totalCount = await query.CountAsync();

        cards = await query
            .OrderBy(c => c.Id)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();
    }

    return (cards, totalCount);
}


        public async Task<Card> GetByIdAsync(int id)
        {
            return await _cardRepository.GetByIdAsync(id);
        }
    }
}
