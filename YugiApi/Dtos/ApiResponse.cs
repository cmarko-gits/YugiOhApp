using YugiApi.Models;

namespace YugiApi.Dtos
{
    public class ApiResponse<T>
    {
        public List<ApiCard> Data { get; set; }
    }
}
