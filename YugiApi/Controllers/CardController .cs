using Microsoft.AspNetCore.Mvc;
using YugiApi.Models;
using YugiApi.Services;

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

        [HttpGet]
        public async Task<ActionResult<List<Card>>> GetAll(int page = 1, int pageSize = 50)
        {
            var cards = await _cardService.GetAllCardsAsync(page, pageSize);
            return Ok(cards);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Card>> GetById(int id)
        {
            var card = await _cardService.GetCardByIdAsync(id);

            if (card == null)
                return NotFound();

            return Ok(card);
        }

        [HttpGet("search")]
        public async Task<ActionResult<List<Card>>> Search([FromQuery] string name)
        {
            if (string.IsNullOrEmpty(name))
                return BadRequest("Search term cannot be empty.");

            var cards = await _cardService.SearchCardsByNameAsync(name);
            return Ok(cards);
        }
[HttpGet("filter")]
public async Task<ActionResult<List<Card>>> GetFiltered(
    [FromQuery] string name,
    [FromQuery] string type,
    [FromQuery] int page = 1,
    [FromQuery] int pageSize = 50)
{
    var cards = await _cardService.GetFilteredCardsAsync(name, type ,  page, pageSize);
    return Ok(cards);
}

    //
    }
}
