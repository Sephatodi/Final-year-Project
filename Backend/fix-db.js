const { sequelize } = require('./src/config/database');
sequelize.query('TRUNCATE TABLE "users" CASCADE;')
  .then(() => {
    console.log("Table 'users' truncated successfully to allow schema sync.");
    process.exit(0);
  })
  .catch((err) => {
    console.error("Error truncating table:", err);
    process.exit(1);
  });
