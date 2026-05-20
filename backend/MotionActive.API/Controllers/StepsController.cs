using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using MotionActive.Application.DTOs;
using MotionActive.Domain.Entities;
using MotionActive.Infrastructure.Data;

namespace MotionActive.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class StepsController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private const int PointsPerThousandSteps = 10;
    private const int DailyStepCap = 50000;

    public StepsController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpPost("log")]
    public async Task<ActionResult<StepLogResponse>> LogSteps(LogStepsRequest request)
    {
        if (request.Steps <= 0)
            return BadRequest("Steps must be greater than zero");

        if (request.Steps > DailyStepCap)
            return BadRequest($"Steps cannot exceed {DailyStepCap} per log");

        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        var user = await _context.Users.FindAsync(userId);
        if (user == null) return NotFound("User not found");

        // Calculate points — 1000 steps = 10 points
        var points = (request.Steps / 1000) * PointsPerThousandSteps;

        // Bonus points
        if (request.Steps >= 10000) points += 50;
        else if (request.Steps >= 5000) points += 25;

        var stepLog = new StepLog
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            Steps = request.Steps,
            PointsEarned = points,
            LoggedAt = DateTime.UtcNow
        };

        var transaction = new PointTransaction
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            Points = points,
            Reason = $"Logged {request.Steps:N0} steps",
            CreatedAt = DateTime.UtcNow
        };

        user.TotalPoints += points;

        _context.StepLogs.Add(stepLog);
        _context.PointTransactions.Add(transaction);
        await _context.SaveChangesAsync();

        return Ok(new StepLogResponse
        {
            Id = stepLog.Id,
            Steps = stepLog.Steps,
            PointsEarned = points,
            TotalPoints = user.TotalPoints,
            LoggedAt = stepLog.LoggedAt
        });
    }

    [HttpGet("history")]
    public async Task<ActionResult<List<StepLogResponse>>> GetHistory()
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        var logs = await _context.StepLogs
            .Where(s => s.UserId == userId)
            .OrderByDescending(s => s.LoggedAt)
            .Select(s => new StepLogResponse
            {
                Id = s.Id,
                Steps = s.Steps,
                PointsEarned = s.PointsEarned,
                TotalPoints = 0,
                LoggedAt = s.LoggedAt
            })
            .ToListAsync();

        return Ok(logs);
    }
}