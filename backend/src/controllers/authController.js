const pool = require('../database/connection') // conexão PostgreSQL
const bcrypt = require('bcrypt') // criptografia
const jwt = require('jsonwebtoken') // geração de token
require('dotenv').config()

const login = async (req, res) => {
  try {
    const { email, password } = req.body // pega dados enviados

    // busca usuário pelo email
    const query = 'SELECT * FROM users WHERE email = $1'
    const result = await pool.query(query, [email])

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Credenciais inválidas' })
    }

    const user = result.rows[0]

    // compara senha enviada com hash salvo
    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
      return res.status(401).json({ error: 'Credenciais inválidas' })
    }

    // gera token JWT
    const token = jwt.sign(
      {
        id: user.id,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    )

    return res.json({ token })

  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: 'Erro no login' })
  }
}

module.exports = { login }