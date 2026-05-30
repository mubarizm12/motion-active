using Microsoft.EntityFrameworkCore;
using MotionActive.Application.DTOs;
using MotionActive.Application.Interfaces;
using MotionActive.Domain.Entities;
using MotionActive.Infrastructure.Data;

namespace MotionActive.Infrastructure.Repositories;

public class RewardRepository : IRewardRepository
{
    private readonly ApplicationDbContext _context;

    public RewardRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Reward>> GetAllActiveAsync()
    {
        return await _context.Rewards
            .Where(r => r.IsActive)
            .OrderBy(r => r.PointsCost)
            .ToListAsync();
    }

    public async Task<Reward?> GetByIdAsync(Guid id)
    {
        return await _context.Rewards.FindAsync(id);
    }

    public async Task AddAsync(Reward reward)
    {
        await _context.Rewards.AddAsync(reward);
        await _context.SaveChangesAsync();
    }

    public async Task UpdateAsync(Reward reward)
    {
        _context.Rewards.Update(reward);
        await _context.SaveChangesAsync();
    }
}

public class RedemptionRepository : IRedemptionRepository
{
    private readonly ApplicationDbContext _context;

    public RedemptionRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task AddAsync(Redemption redemption)
    {
        await _context.Redemptions.AddAsync(redemption);
        await _context.SaveChangesAsync();
    }

    public async Task<IEnumerable<RedemptionResponse>> GetByUserIdAsync(Guid userId)
    {
        return await _context.Redemptions
            .Where(r => r.UserId == userId)
            .Include(r => r.Reward)
            .OrderByDescending(r => r.RedeemedAt)
            .Select(r => new RedemptionResponse(
                r.Id,
                r.RewardId,
                r.Reward.Name,
                r.PointsSpent,
                r.RedeemedAt
            ))
            .ToListAsync();
    }
}