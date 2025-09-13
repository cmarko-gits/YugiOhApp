using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using System.Linq;
using System.Threading.Tasks;
using YugiApi.Services;

namespace YugiApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class GameController : ControllerBase
    {
        private readonly GameService _gameService;

        public GameController(GameService gameService)
        {
            _gameService = gameService;
        }

        [Authorize]
        [HttpPost("start")]
        public async Task<ActionResult> StartGame()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null) return Unauthorized();

            var game = await _gameService.StartGameAsync(userId);
            if (game == null)
                return BadRequest("Korisnik nema deck. Molimo dodajte karte u deck pre starta igre.");

            return Ok(new
            {
                Hand = game.Hand.Select(c => new { c.Id, c.Name , c.ImageUrl}),
                DeckCount = game.Deck.Cards.Count,
                MonsterZone = game.MonsterZone,
                SpellTrapZone = game.SpellTrapZone
            });
        }

        [Authorize]
        [HttpPost("draw")]
        public async Task<ActionResult> DrawCard()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null) return Unauthorized();

            var card = await _gameService.DrawCardAsync(userId);
            var game = await _gameService.GetActiveGameAsync(userId);
            if (card == null || game == null)
                return BadRequest("Nema više karata u špilu ili igra nije pokrenuta.");

            return Ok(new
            {
                Hand = game.Hand.Select(c => new { c.Id, c.Name , c.ImageUrl }),
                DeckCount = game.Deck.Cards.Count
            });
        }

        [Authorize]
        [HttpGet("active")]
        public async Task<ActionResult> GetActiveGame()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null) return Unauthorized();

            var game = await _gameService.GetActiveGameAsync(userId);
            if (game == null) return BadRequest("Igra nije pokrenuta.");

            return Ok(new
            {
                Hand = game.Hand.Select(c => new { c.Id, c.Name }),
                DeckCount = game.Deck.Cards.Count,
                MonsterZone = game.MonsterZone,
                SpellTrapZone = game.SpellTrapZone,
                Graveyard = game.Graveyard.Select(c => new { c.Id, c.Name }),
                Banished = game.Banished.Select(c => new { c.Id, c.Name })
            });
        }
    }
}
