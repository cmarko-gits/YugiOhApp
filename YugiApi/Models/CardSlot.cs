namespace YugiApi.Models
{
    public class CardSlot
    {
            public Card? Card { get; set; }      // karta koja se nalazi u slotu
    public string? Position { get; set; } // "Attack", "Defense", null za Spell/Trap
    public bool IsFaceUp { get; set; } = true; // da li je karta okrenuta licem
    }
}