using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using System.Linq;
using System.Threading.Tasks;
using YugiApi.Repositories;
using YugiApi.Repositories.Interfaces;

namespace YugiApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DeckController : ControllerBase
    {
        private readonly IDeckRepository _deckRepo;

        public DeckController(IDeckRepository deckRepo)
        {
            _deckRepo = deckRepo;
        }

        [Authorize]
        [HttpGet]
        public async Task<ActionResult> GetDeck()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null) return Unauthorized();

            var deck = await _deckRepo.GetDeckByUserIdAsync(userId);
            if (deck == null) return NotFound("Deck za ovog korisnika nije pronađen");

            return Ok(new
            {
                Cards = deck.Cards.Select(c => new { c.Id, c.Name }),
                Graveyard = deck.Graveyard.Select(c => new { c.Id, c.Name }),
                Banished = deck.Banished.Select(c => new { c.Id, c.Name })
            });
        }

        [Authorize]
        [HttpPost("{cardId}")]
        public async Task<ActionResult> CreateDeck(int cardId)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null) return Unauthorized("Korisnik nije ulogovan");

            try
            {
                await _deckRepo.AddCardToDeckAsync(userId, cardId);
                return Ok("Karta dodata u deck");
            }
            catch (System.Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [Authorize]
        [HttpDelete("{cardId}")]
        public async Task<ActionResult> RemoveCard(int cardId)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null) return Unauthorized();

            try
            {
                await _deckRepo.RemoveCardFromDeckAsync(userId, cardId);
                return Ok("Karta je uklonjena iz decka");
            }
            catch (System.Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
