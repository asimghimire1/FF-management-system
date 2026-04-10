const { Sequelize } = require('sequelize');
const path = require('path');

// Initialize SQLite database
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, '../database.sqlite'),
  logging: false, // Disable logging; set to console.log to see SQL queries
});

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('✓ SQLite database connected');

    // Sync all models - force: true recreates tables if necessary
    await sequelize.sync({ force: false, alter: false });
    console.log('✓ Database tables synced');
  } catch (error) {
    console.error('✗ Database connection failed:', error.message);
    console.error('Full error:', error);
    // Try one more time with force sync
    try {
      console.log('Attempting force sync...');
      await sequelize.sync({ force: true });
      console.log('✓ Database force synced');
    } catch (forceError) {
      console.error('✗ Force sync also failed:', forceError.message);
      process.exit(1);
    }
  }
};

module.exports = { sequelize, connectDB };

