using YugiApi.Models;
using System.Threading.Tasks;

namespace YugiApi.Repositories.Interfaces
{
    public interface IGameRepository
    {
        Task<Game> GetGameAsync(string userId);
        Task SaveGameAsync(Game game);
        Task<bool> ExistsAsync(string userId);
    }
}
