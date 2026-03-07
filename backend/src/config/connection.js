const { Pool } = require("pg");

// Criamos uma pool única que lê exatamente os nomes que você cadastrou na Vercel
const pool = new Pool({
  host: process.env.ACTIVACAO_DB_HOST,
  user: process.env.ACTIVACAO_DB_USER,
  password: process.env.ACTIVACAO_DB_PASSWORD,
  database: process.env.ACTIVACAO_DB_NAME,
  port: parseInt(process.env.ACTIVACAO_DB_PORT) || 5432,
  ssl: {
    rejectUnauthorized: false
  }
});

module.exports = pool;