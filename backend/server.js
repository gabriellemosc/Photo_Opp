const express = require('express') // importa express
const app = express() // cria app
require('dotenv').config() // carrega .env

app.use(express.json()) // permite JSON no body

const photoRoutes = require('./src/routes/photoRoutes') // importa rotas

app.use('/photos', photoRoutes) // registra rota

app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000')
})

const authRoutes = require('./src/routes/authRoutes')

app.use('/auth', authRoutes)