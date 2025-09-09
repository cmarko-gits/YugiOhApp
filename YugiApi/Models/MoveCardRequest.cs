namespace YugiApi.Models
{
    public class MoveCardRequest
    {
            public int PlayerId { get; set; }
    public int CardId { get; set; }
    public string FromZone { get; set; } // "Hand", "Monster", "SpellTrap"
    public string ToZone { get; set; } 
    }
}