namespace MotionActive.Application.DTOs;

public class LeaderboardEntry
{
    public int Rank { get; set; }
    public string DisplayName { get; set; } = string.Empty;
    public int TotalPoints { get; set; }
    public int TotalSteps { get; set; }
}