using YugiApi.Models;

namespace YugiApi.Services.Interfaces
{
    public interface IGameService
    {
                Task<Game?> StartGameAsync(string userId);
        Task<Game?> GetActiveGameAsync(string userId);
        Task<Card?> DrawCardAsync(string userId);
    }
}