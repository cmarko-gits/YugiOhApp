using YugiApi.Models;
using System.Threading.Tasks;

namespace YugiApi.Services.Interfaces
{
    public interface IGameService
    {
        Task<Game?> StartGameAsync(string userId);
        Task<Game?> GetActiveGameAsync(string userId);
        Task<Card?> DrawCardAsync(string userId);
        Task<(bool Success, string ErrorMessage)> SummonMonsterAsync(string userId, int cardId, bool inAttackMode);
Task<(bool Success, string ErrorMessage)> PlaceSpellTrapAsync(string userId, int cardId);
    }
}
