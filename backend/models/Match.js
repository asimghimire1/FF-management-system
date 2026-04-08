const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Match = sequelize.define('Match', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  type: {
    type: DataTypes.ENUM('scrim', 'tournament'),
    allowNull: false,
  },
  entryFee: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  maxTeams: {
    type: DataTypes.INTEGER,
    defaultValue: 12,
  },
  status: {
    type: DataTypes.ENUM('registration_open', 'registration_closed', 'ongoing', 'completed'),
    defaultValue: 'registration_open',
  },
  rounds: {
    type: DataTypes.JSON,
    defaultValue: [],
  },
  registrations: {
    type: DataTypes.JSON,
    defaultValue: [],
  },
  leaderboards: {
    type: DataTypes.JSON,
    defaultValue: [],
  },
  startDate: DataTypes.DATE,
  endDate: DataTypes.DATE,
  createdBy: {
    type: DataTypes.UUID,
  },
}, {
  timestamps: true,
});

module.exports = Match;

