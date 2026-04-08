const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Leaderboard = sequelize.define('Leaderboard', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  matchId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  roundNumber: DataTypes.INTEGER,
  entries: {
    type: DataTypes.JSON,
    defaultValue: [],
  },
  prizeDistribution: {
    type: DataTypes.JSON,
    defaultValue: {},
  },
  totalPrizePool: DataTypes.INTEGER,
  platformFee: DataTypes.INTEGER,
  generatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  timestamps: true,
});

module.exports = Leaderboard;

