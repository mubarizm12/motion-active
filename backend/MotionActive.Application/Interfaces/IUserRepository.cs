using MotionActive.Domain.Entities;

namespace MotionActive.Application.Interfaces;

public interface IUserRepository
{
    Task<User?> GetByIdAsync(Guid id);
    Task UpdateAsync(User user);
}