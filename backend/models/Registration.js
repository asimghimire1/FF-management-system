const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Registration = sequelize.define('Registration', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  teamId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  matchId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  paymentId: {
    type: DataTypes.UUID,
  },
  slotNumber: DataTypes.INTEGER,
  status: {
    type: DataTypes.ENUM('pending', 'approved', 'rejected'),
    defaultValue: 'pending',
  },
  roundNumber: DataTypes.INTEGER,
}, {
  timestamps: true,
});

module.exports = Registration;

