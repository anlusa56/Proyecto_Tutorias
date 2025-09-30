const { Sequelize } = require("sequelize");
const dotenv = require("dotenv");

// Configuración silenciosa de dotenv
dotenv.config({
  silent: true,
  override: true,
  debug: false,
  path: '.env'
});

const sequelize = new Sequelize({
  database: process.env.DB_NAME || "postgres",
  username: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "perritogoloso56",
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT || 5432,
  dialect: "postgres",
  logging: false,
  define: {
    timestamps: true,
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

module.exports = sequelize;