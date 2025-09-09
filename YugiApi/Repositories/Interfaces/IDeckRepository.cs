using System.Threading.Tasks;
using YugiApi.Models;

namespace YugiApi.Repositories.Interfaces
{
    public interface IDeckRepository
    {
        Task<Deck?> GetDeckByUserIdAsync(string userId);
        Task<Deck> GetOrCreateDeckByUserIdAsync(string userId); // <--- dodaj ovo

        Task AddCardToDeckAsync(string userId, int cardId);
        Task RemoveCardFromDeckAsync(string userId, int cardId);

        Task AddCardToFusionDeckAsync(string userId, int cardId);
        Task RemoveCardFromFusionDeckAsync(string userId, int cardId);
    }
}
