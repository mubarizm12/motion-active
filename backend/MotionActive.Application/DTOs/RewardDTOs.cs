namespace MotionActive.Application.DTOs;

public record RewardResponse(
    Guid Id,
    string Name,
    string Description,
    int PointsCost,
    int StockQuantity,
    bool IsActive
);

public record RedeemRewardRequest(
    Guid RewardId
);

public record RedemptionResponse(
    Guid Id,
    Guid RewardId,
    string RewardName,
    int PointsSpent,
    DateTime RedeemedAt
);