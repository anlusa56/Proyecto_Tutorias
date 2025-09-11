const Sequelize = require("./db");

(async () => {
    try {
        await Sequelize.authenticate();
        console.log("Conexion exitosa a pstgresSQL");
    } catch (error) {
        console.error("No se pudo conectar a la base de datos:", error.message);
    } finally {
        await Sequelize.close();
    }
})();