const { Client } = require("pg");

const client = new Client({
  connectionString: process.env.DATABASE_URL || "postgresql://proyecto_tutorias_user:d48zezC3paNLeh6ddyMnjtHWsRvYu6Wt@dpg-d3fui72dbo4c73eakbm0-a.oregon-postgres.render.com/proyecto_tutorias",
  ssl: {
    rejectUnauthorized: false
  }
});

client.connect()
  .then(() => console.log("✅ Conectado a PostgreSQL en Render"))
  .catch(err => console.error("❌ Error de conexión:", err));

module.exports = client;
