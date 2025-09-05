using Microsoft.AspNetCore.Mvc;
using YugiApi.Services;
using YugiApi.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace YugiApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CardController : ControllerBase
    {
        private readonly CardService _cardService;

        public CardController(CardService cardService)
        {
            _cardService = cardService;
        }

        // GET: api/card?name=Dragon&type=Monster&race=Dragon&minAtk=1000&page=1&pageSize=50
        [HttpGet]
        public async Task<ActionResult> GetCards(
            [FromQuery] string name = null,
            [FromQuery] string type = null,
            [FromQuery] string race = null,
            [FromQuery] int? minAtk = null,
            [FromQuery] int? maxAtk = null,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 50)
        {
            var (cards, totalCount) = await _cardService.GetCardsAsync(
                name, type, race, minAtk, maxAtk, page, pageSize
            );

            return Ok(new
            {
                TotalCount = totalCount,
                Page = page,
                PageSize = pageSize,
                Data = cards
            });
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Card>> GetCard(int id)
        {
            var card = await _cardService.GetByIdAsync(id);
            if (card == null)
                return NotFound(new { Message = $"Card with ID {id} not found" });

            return Ok(card);
        }

    }
}
