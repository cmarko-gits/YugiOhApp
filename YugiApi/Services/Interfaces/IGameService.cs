using YugiApi.Models;
using System.Threading.Tasks;

namespace YugiApi.Services.Interfaces
{
    public interface IGameService
    {
        Task<Game?> StartGameAsync(string userId);
        Task<Game?> GetActiveGameAsync(string userId);
        Task<Card?> DrawCardAsync(string userId);

        // univerzalna metoda za prizivanje (običan summon ili tribute summon)
        Task<(bool Success, string Message)> SummonAsync(
            string userId,
            int cardId,
            bool inAttackMode,
            int[] tributeIds
        );

        Task<(bool Success, string ErrorMessage)> PlaceSpellTrapAsync(string userId, int cardId);
    }
}
