using YugiApi.Models;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace YugiApi.Repositories.Interfaces
{
    public interface ICardRepository
    {
        Task<List<Card>> GetAllAsync(int page = 1, int pageSize = 50);
        Task<Card> GetByIdAsync(int id);
        Task<bool> ExistsByNameAsync(string name);
        Task AddAsync(Card card);
        Task SaveChangesAsync();
        IQueryable<Card> GetFilters();
        Task AddRangeAsync(List<Card> allCards);
        Task<bool> AnyAsync(Expression<Func<Card, bool>> predicate);

    }
}
