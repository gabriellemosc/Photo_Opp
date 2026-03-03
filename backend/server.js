const express = require('express')

const cors = require('cors')

require('dotenv').config()

const app = express()

const PORT = process.env.PORT || 3001

app.use(cors())

app.use(express.json())

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'Server is running' }) // retorna status simples
})

// global middlewware
app.use((err, req, res, next) => {
  console.error(err) // loga erro no console

  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error'
  })
})

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
})