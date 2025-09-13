using System;
using System.Collections.Concurrent;
using System.Threading.Tasks;
using YugiApi.Models;
using YugiApi.Repositories.Interfaces;

namespace YugiApi.Repositories
{
    public class GameRepository : IGameRepository
    {
        // Thread-safe dictionary za čuvanje aktivnih igara
        private static readonly ConcurrentDictionary<string, Game> _games = new();

        public Task<Game?> GetActiveGameAsync(string userId)
        {
            _games.TryGetValue(userId, out var game);
            return Task.FromResult(game);
        }

        public Task SaveGameAsync(Game game)
        {
            if (game == null) throw new ArgumentNullException(nameof(game));
            _games[game.UserId] = game;
            return Task.CompletedTask;
        }

        public Task RemoveGameAsync(string userId)
        {
            _games.TryRemove(userId, out _);
            return Task.CompletedTask;
        }
    }
}
