using System.Threading.Tasks;
using YugiApi.Models;

namespace YugiApi.Repositories.Interfaces
{
    public interface IGameRepository
    {
    Task<Game?> GetActiveGameAsync(string userId);
        Task SaveGameAsync(Game game);
        Task RemoveGameAsync(string userId);
    }
}
