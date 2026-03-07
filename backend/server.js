const express = require('express') // importa express
const cors = require('cors') // importa middleware CORS
require('dotenv').config() // carrega variáveis do .env

const app = express() // cria aplicação

// Adicione isso para testar:
app.get('/', (req, res) => {
  res.send('Backend rodando com sucesso!');
});

// ---------- MIDDLEWARES GLOBAIS ----------

app.use(cors()) // permite requisições vindas do frontend
app.use(express.json()) // permite receber JSON no body

// ---------- ROTAS ----------

const photoRoutes = require('./src/routes/photoRoutes') // rotas de fotos
app.use('/photos', photoRoutes)

const authRoutes = require('./src/routes/authRoutes') // rotas de login
app.use('/auth', authRoutes)

const activationRoutes = require('./src/routes/activationRoutes') // rotas da ativação
app.use('/activation', activationRoutes)

const adminRoutes = require('./src/routes/adminRoutes')
app.use('/admin', adminRoutes) // registra rotas admin

module.exports = app; // Adicione isso aqui!