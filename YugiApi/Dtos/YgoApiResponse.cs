using System.Text.Json.Serialization;
using YugiApi.Models;
namespace YugiApi.Dtos
{public class YgoApiResponse
{
    [JsonPropertyName("data")]
    public List<CardDto> Data { get; set; }
}
}