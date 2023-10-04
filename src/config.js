// config.js
// config.js

module.exports = {
  databaseConfig: {
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD ||'munnipammi',
    database: process.env.DB_DATABASE || 'health_check',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
  },
};
