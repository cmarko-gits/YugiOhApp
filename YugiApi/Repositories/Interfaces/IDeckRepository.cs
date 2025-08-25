using YugiApi.Models;
using System.Threading.Tasks;

namespace YugiApi.Repositories.Interfaces
{
    public interface IDeckRepository
    {
        Task<Deck> GetDeckByUserIdAsync(string userId);
        Task AddCardToDeckAsync(string userId, int cardId);
        Task RemoveCardFromDeckAsync(string userId, int cardId);
    }
}
