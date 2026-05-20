using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MotionActive.Application.DTOs;
using MotionActive.Infrastructure.Data;

namespace MotionActive.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class LeaderboardController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public LeaderboardController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet("global")]
    public async Task<ActionResult<List<LeaderboardEntry>>> GetGlobalLeaderboard()
    {
        var users = await _context.Users
            .OrderByDescending(u => u.TotalPoints)
            .Take(100)
            .ToListAsync();

        var totalSteps = await _context.StepLogs
            .GroupBy(s => s.UserId)
            .Select(g => new { UserId = g.Key, Total = g.Sum(s => s.Steps) })
            .ToListAsync();

        var stepDict = totalSteps.ToDictionary(x => x.UserId, x => x.Total);

        var leaderboard = users.Select((user, index) => new LeaderboardEntry
        {
            Rank = index + 1,
            DisplayName = user.DisplayName,
            TotalPoints = user.TotalPoints,
            TotalSteps = stepDict.ContainsKey(user.Id) ? stepDict[user.Id] : 0
        }).ToList();

        return Ok(leaderboard);
    }
}