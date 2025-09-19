using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using System.Linq;
using System.Threading.Tasks;
using YugiApi.Services.Interfaces;
using YugiApi.Dtos;

namespace YugiApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class GameController : ControllerBase
    {
        private readonly IGameService _gameService;

        public GameController(IGameService gameService)
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
                Hand = game.Hand.Select(c => new { c.Id, c.Name, c.ImageUrl, c.Type }),
                DeckCount = game.Deck.Cards.Count,
                FusionCount = game.Deck.FusionDeck.Count,
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
                Hand = game.Hand.Select(c => new { c.Id, c.Name, c.ImageUrl, c.Type }),
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
                Hand = game.Hand.Select(c => new { c.Id, c.Name, c.ImageUrl, c.Type }),
                DeckCount = game.Deck.Cards.Count,
                MonsterZone = game.MonsterZone,
                SpellTrapZone = game.SpellTrapZone,
                Graveyard = game.Graveyard.Select(c => new { c.Id, c.Name }),
                Banished = game.Banished.Select(c => new { c.Id, c.Name })
            });
        }

        [Authorize]
        [HttpPost("summon")]
        public async Task<ActionResult> Summon([FromBody] TributeSummonRequest req)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null) return Unauthorized();

            var result = await _gameService.SummonAsync(userId, req.CardId, req.InAttackMode, req.TributeIds);
            if (!result.Success) return BadRequest(new { message = result.Message });

            var game = await _gameService.GetActiveGameAsync(userId);
            return Ok(new
            {
                result.Message,
                Hand = game.Hand.Select(c => new { c.Id, c.Name, c.ImageUrl, c.Type, c.Level }),
                DeckCount = game.Deck.Cards.Count,
                MonsterZone = game.MonsterZone,
                SpellTrapZone = game.SpellTrapZone,
                Graveyard = game.Graveyard.Select(c => new { c.Id, c.Name }),
            });
        }

        [Authorize]
        [HttpPost("trapOrSpell")]
        public async Task<ActionResult> PlaceSpellTrap(int cardId)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null) return Unauthorized();

            var result = await _gameService.PlaceSpellTrapAsync(userId, cardId);
            if (!result.Success) return BadRequest(new { message = result.ErrorMessage });

            return Ok(new { message = result.ErrorMessage });
        }
    }
}
