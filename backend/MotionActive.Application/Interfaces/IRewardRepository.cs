using MotionActive.Application.DTOs;
using MotionActive.Domain.Entities;

namespace MotionActive.Application.Interfaces;

public interface IRewardRepository
{
    Task<IEnumerable<Reward>> GetAllActiveAsync();
    Task<Reward?> GetByIdAsync(Guid id);
    Task AddAsync(Reward reward);
    Task UpdateAsync(Reward reward);
}

public interface IRedemptionRepository
{
    Task AddAsync(Redemption redemption);
    Task<IEnumerable<RedemptionResponse>> GetByUserIdAsync(Guid userId);
}