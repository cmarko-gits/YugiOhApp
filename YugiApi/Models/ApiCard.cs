namespace YugiApi.Models
{
    public class ApiCard
    {
            public int Id { get; set; }
    public string Name { get; set; }
    public string Type { get; set; }
    public string Desc { get; set; }
    public string Race { get; set; }
    public List<ApiCardImage> CardImages { get; set; }
    }
}