namespace MotionActive.Domain.Entities;

public class Redemption
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public Guid RewardId { get; set; }
    public int PointsSpent { get; set; }
    public DateTime RedeemedAt { get; set; } = DateTime.UtcNow;

    public User User { get; set; } = null!;
    public Reward Reward { get; set; } = null!;
}