namespace YugiApi.Dtos
{
   public class TributeSummonRequest
{
    public int CardId { get; set; }
    public int[] TributeIds { get; set; } = new int[0];
    public bool InAttackMode { get; set; } = true;
}

}