using YugiApi.Models;
using Microsoft.EntityFrameworkCore;

namespace YugiApi.Repositories.Interfaces
{
    public interface ICardRepository
    {
        Task<List<Card>> GetAllAsync(int page = 1, int pageSize = 50);
        Task<Card> GetByIdAsync(int id);
        Task<bool> ExistsByNameAsync(string name);
        Task AddAsync(Card card);
        Task SaveChangesAsync();
        Task<List<Card>> SearchByNameAsync(string name);
        IQueryable<Card> GetFilters();

    }
}
