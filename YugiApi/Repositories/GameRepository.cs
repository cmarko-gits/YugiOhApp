using YugiApi.Models;
using System.Collections.Concurrent;
using System.Threading.Tasks;
using YugiApi.Repositories.Interfaces;

public class GameRepository : IGameRepository
{
    private readonly ConcurrentDictionary<string, Game> _games = new();

    public Task<Game> GetGameAsync(string userId)
    {
        if (!_games.TryGetValue(userId, out var game))
            throw new InvalidOperationException("Game not found");
        return Task.FromResult(game);
    }

    public Task SaveGameAsync(Game game)
    {
        _games[game.PlayerId] = game;
        return Task.CompletedTask;
    }

    public Task<bool> ExistsAsync(string userId)
    {
        return Task.FromResult(_games.ContainsKey(userId));
    }
}
