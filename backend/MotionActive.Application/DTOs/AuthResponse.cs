namespace MotionActive.Application.DTOs;

public class AuthResponse
{
    public string Token { get; set; } = string.Empty;
    public string DisplayName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public int TotalPoints { get; set; }
}