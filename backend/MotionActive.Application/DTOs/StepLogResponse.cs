namespace MotionActive.Application.DTOs;

public class StepLogResponse
{
    public Guid Id { get; set; }
    public int Steps { get; set; }
    public int PointsEarned { get; set; }
    public int TotalPoints { get; set; }
    public DateTime LoggedAt { get; set; }
}