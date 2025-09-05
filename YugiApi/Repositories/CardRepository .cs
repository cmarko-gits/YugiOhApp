using Microsoft.EntityFrameworkCore;
using YugiApi.Data;
using YugiApi.Models;
using YugiApi.Repositories.Interfaces;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.Linq.Expressions;

namespace YugiApi.Repositories
{
    public class CardRepository : ICardRepository
    {
        private readonly AppDbContext _dbContext;

        public CardRepository(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<List<Card>> GetAllAsync(int page = 1, int pageSize = 50)
        {
            return await _dbContext.Cards
                .OrderBy(c => c.Id)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();
        }

        public IQueryable<Card> GetFilters()
        {
            return _dbContext.Cards.AsQueryable();
        }

        public async Task<Card> GetByIdAsync(int id)
        {
            return await _dbContext.Cards.FindAsync(id);
        }

        public async Task<bool> ExistsByNameAsync(string name)
        {
            return await _dbContext.Cards.AnyAsync(c => c.Name == name);
        }

        public async Task AddAsync(Card card)
        {
            await _dbContext.Cards.AddAsync(card);
            await _dbContext.SaveChangesAsync();
        }

        public async Task SaveChangesAsync()
        {
            await _dbContext.SaveChangesAsync();
        }

        public async Task AddRangeAsync(List<Card> allCards)
        {
            await _dbContext.Cards.AddRangeAsync(allCards);
            await _dbContext.SaveChangesAsync();
        }
    public async Task<bool> AnyAsync(Expression<Func<Card, bool>> predicate)
{
    return await _dbContext.Cards.AnyAsync(predicate);
}
    }
    


}
