// connection.js
const { Pool } = require("pg");

let pool;

// Evita criar múltiplas pools em serverless (Vercel)
if (!global.ACTIVACAO_POOL) {
  pool = new Pool({
    host: process.env.ACTIVACAO_DB_HOST,
    user: process.env.ACTIVACAO_DB_USER,
    password: process.env.ACTIVACAO_DB_PASSWORD,
    database: process.env.ACTIVACAO_DB_NAME,
    port: process.env.ACTIVACAO_DB_PORT
  });
  global.ACTIVACAO_POOL = pool;
} else {
  pool = global.ACTIVACAO_POOL;
}

module.exports = pool;