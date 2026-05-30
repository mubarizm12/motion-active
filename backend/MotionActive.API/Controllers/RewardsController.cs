using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MotionActive.Application.DTOs;
using MotionActive.Application.Interfaces;
using MotionActive.Domain.Entities;
using System.Security.Claims;

namespace MotionActive.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class RewardsController : ControllerBase
{
    private readonly IRewardRepository _rewardRepository;
    private readonly IRedemptionRepository _redemptionRepository;
    private readonly IUserRepository _userRepository;

    public RewardsController(
        IRewardRepository rewardRepository,
        IRedemptionRepository redemptionRepository,
        IUserRepository userRepository)
    {
        _rewardRepository = rewardRepository;
        _redemptionRepository = redemptionRepository;
        _userRepository = userRepository;
    }

    // GET api/rewards
    [HttpGet]
    public async Task<IActionResult> GetRewards()
    {
        var rewards = await _rewardRepository.GetAllActiveAsync();
        var response = rewards.Select(r => new RewardResponse(
            r.Id,
            r.Name,
            r.Description,
            r.PointsCost,
            r.StockQuantity,
            r.IsActive
        ));
        return Ok(response);
    }

    // POST api/rewards/redeem
    [HttpPost("redeem")]
    public async Task<IActionResult> RedeemReward([FromBody] RedeemRewardRequest request)
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        var user = await _userRepository.GetByIdAsync(userId);
        if (user is null) return NotFound("User not found.");

        var reward = await _rewardRepository.GetByIdAsync(request.RewardId);
        if (reward is null) return NotFound("Reward not found.");
        if (!reward.IsActive) return BadRequest("This reward is no longer available.");
        if (reward.StockQuantity <= 0) return BadRequest("This reward is out of stock.");
        if (user.TotalPoints < reward.PointsCost) return BadRequest("Not enough points.");

        user.TotalPoints -= reward.PointsCost;
        reward.StockQuantity -= 1;

        var redemption = new Redemption
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            RewardId = reward.Id,
            PointsSpent = reward.PointsCost,
            RedeemedAt = DateTime.UtcNow
        };

        await _redemptionRepository.AddAsync(redemption);
        await _userRepository.UpdateAsync(user);
        await _rewardRepository.UpdateAsync(reward);

        return Ok(new RedemptionResponse(
            redemption.Id,
            redemption.RewardId,
            reward.Name,
            redemption.PointsSpent,
            redemption.RedeemedAt
        ));
    }

    // GET api/rewards/my-redemptions
    [HttpGet("my-redemptions")]
    public async Task<IActionResult> GetMyRedemptions()
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var redemptions = await _redemptionRepository.GetByUserIdAsync(userId);
        return Ok(redemptions);
    }
}