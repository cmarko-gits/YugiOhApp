using System.Text.Json.Serialization;
using YugiApi.Models;

namespace YugiApi.Dtos
{
    public class CardDto
    {
        [JsonPropertyName("id")]
    public int Id { get; set; }

    [JsonPropertyName("name")]
    public string Name { get; set; }

    [JsonPropertyName("type")]
    public string Type { get; set; }

    [JsonPropertyName("desc")]
    public string Desc { get; set; }

    [JsonPropertyName("race")]
    public string Race { get; set; }

    [JsonPropertyName("atk")]
    public int? Atk { get; set; }

    [JsonPropertyName("def")]
    public int? Def { get; set; }
      [JsonPropertyName("level")]
    public int? Level { get; set; }

    [JsonPropertyName("card_images")]
    public List<ApiCardImage> CardImages { get; set; }
}
    }

