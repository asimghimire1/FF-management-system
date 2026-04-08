// Prize calculation based on total pool and team count
const calculatePrizes = (totalAmount, distribution = null) => {
  const platformFee = totalAmount * 0.166; // 16.6% platform fee
  const prizePool = totalAmount - platformFee;

  // Default distribution if not provided
  const defaultDistribution = {
    1: 0.5,    // 50% for 1st
    2: 0.35,   // 35% for 2nd
    3: 0.15,   // 15% for 3rd
  };

  const dist = distribution || defaultDistribution;

  return {
    prizePool: Math.round(prizePool),
    platformFee: Math.round(platformFee),
    prizes: {
      1: Math.round(prizePool * dist[1]),
      2: Math.round(prizePool * dist[2]),
      3: Math.round(prizePool * dist[3]),
    },
  };
};

// Calculate placement points (higher placement = higher points)
const getPlacementPoints = (placement, totalTeams) => {
  return Math.max(100 - (placement - 1) * (80 / totalTeams), 10);
};

// Calculate total points (kills + placement bonus)
const calculateTotalPoints = (kills, placement, totalTeams) => {
  const placementBonus = getPlacementPoints(placement, totalTeams);
  return kills + placementBonus;
};

module.exports = {
  calculatePrizes,
  getPlacementPoints,
  calculateTotalPoints,
};
