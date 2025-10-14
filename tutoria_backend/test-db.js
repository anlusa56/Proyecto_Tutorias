const client = require("./db");

async function test() {
  const res = await client.query("SELECT NOW()");
  console.log("Hora en la DB:", res.rows[0]);
  process.exit();
}

test();
