const { Pool } = require("pg");

// Log para garantir que o código foi executado
console.log("DEBUG [connection.js]: Iniciando configuração do Pool...");

// Log para verificar se as variáveis estão chegando (sem expor a senha)
console.log("DEBUG: Variáveis detectadas:");
console.log("- Host:", process.env.ACTIVACAO_DB_HOST);
console.log("- User:", process.env.ACTIVACAO_DB_USER);
console.log("- Database:", process.env.ACTIVACAO_DB_NAME);
console.log("- Port:", process.env.ACTIVACAO_DB_PORT);
console.log("- Password presente?", !!process.env.ACTIVACAO_DB_PASSWORD);

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

// Adiciona um listener para erros na pool
pool.on('error', (err) => {
  console.error('DEBUG [pool.error]: Erro inesperado na pool:', err.message);
});

module.exports = pool;