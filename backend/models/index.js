const { sequelize } = require('../config/db');
const User = require('./User');
const Team = require('./Team');
const Match = require('./Match');
const Registration = require('./Registration');
const Payment = require('./Payment');
const Leaderboard = require('./Leaderboard');

// Define associations
User.hasMany(Team, { foreignKey: 'createdBy' });
Team.belongsTo(User, { foreignKey: 'createdBy' });

User.hasMany(Match, { foreignKey: 'createdBy' });
Match.belongsTo(User, { foreignKey: 'createdBy' });

User.hasMany(Registration, { foreignKey: 'userId' });
Team.hasMany(Registration, { foreignKey: 'teamId' });
Match.hasMany(Registration, { foreignKey: 'matchId' });
Registration.belongsTo(User, { foreignKey: 'userId' });
Registration.belongsTo(Team, { foreignKey: 'teamId' });
Registration.belongsTo(Match, { foreignKey: 'matchId' });

User.hasMany(Payment, { foreignKey: 'userId' });
Payment.belongsTo(User, { foreignKey: 'userId' });
Payment.belongsTo(Registration, { foreignKey: 'registrationId' });

Match.hasMany(Leaderboard, { foreignKey: 'matchId' });
Leaderboard.belongsTo(Match, { foreignKey: 'matchId' });

module.exports = {
  sequelize,
  User,
  Team,
  Match,
  Registration,
  Payment,
  Leaderboard,
};
