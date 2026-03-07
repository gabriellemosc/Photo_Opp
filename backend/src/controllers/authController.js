const pool = require('../database/connection') 
const bcrypt = require('bcrypt') 
const jwt = require('jsonwebtoken') 
require('dotenv').config()

const login = async (req, res) => {
  try {
    const { email, password } = req.body 

    // 1. Busca usuário (Aqui o pool usará as variáveis ACTIVACAO_DB...)
    const query = 'SELECT * FROM users WHERE email = $1'
    const result = await pool.query(query, [email])

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Credenciais inválidas' })
    }

    const user = result.rows[0]

    // 2. Compara senha
    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
      return res.status(401).json({ error: 'Credenciais inválidas' })
    }

    // 3. Gera token JWT (AJUSTADO PARA O NOME NA VERCEL)
    const token = jwt.sign(
      {
        id: user.id,
        role: user.role
      },
      process.env.ACTIVACAO_JWT_SECRET, // Mudança aqui!
      { expiresIn: '8h' }
    )

    return res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role
      }
    })

  } catch (error) {
    // Log detalhado para você ver na Vercel o que falhou
    console.error("ERRO NO LOGIN:", error.message)
    return res.status(500).json({ error: 'Erro interno no servidor' })
  }
}

module.exports = { login }