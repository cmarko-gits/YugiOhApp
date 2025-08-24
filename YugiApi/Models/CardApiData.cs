namespace YugiApi.Models
{
        public class CardApiData
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string Type { get; set; }
        public string Desc { get; set; }
        public string Race { get; set; }
        public string Attribute { get; set; }
        public int? Level { get; set; }
        public int? Attack { get; set; }
        public int? Defense { get; set; }
        public List<CardImage> CardImages { get; set; }
    }
}