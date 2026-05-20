namespace MotionActive.Domain.Entities;

public class StepLog
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public int Steps { get; set; }
    public int PointsEarned { get; set; }
    public DateTime LoggedAt { get; set; } = DateTime.UtcNow;

    // Navigation property
    public User User { get; set; } = null!;
}
