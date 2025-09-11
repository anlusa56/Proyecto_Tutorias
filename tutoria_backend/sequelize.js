const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("tutorias", "postgres", "perritogoloso56", {
    host: "localhost",
    dialect: "postgres",
});

module.exports = sequelize;