const pool = require('../database/connection') 
const bcrypt = require('bcrypt') 
const jwt = require('jsonwebtoken') 

const login = async (req, res) => {
  try {
    const { email, password } = req.body 

    const query = 'SELECT * FROM users WHERE email = $1'
    const result = await pool.query(query, [email])

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Credenciais inválidas' })
    }

    const user = result.rows[0]

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
      return res.status(401).json({ error: 'Credenciais inválidas' })
    }

    const token = jwt.sign(
      {
        id: user.id,
        role: user.role
      },
      process.env.ACTIVACAO_JWT_SECRET,
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
    console.error("ERRO DETALHADO:", error)
    return res.status(500).json({ 
      error: 'Erro no login', 
      details: error.message 
    })
  } // <--- Esta chave fecha o bloco try/catch
} // <--- Esta chave fecha a função login

module.exports = { login }