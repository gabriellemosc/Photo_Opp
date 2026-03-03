const pool = require('../database/connection') // conexão PostgreSQL
const uploadToS3 = require('../services/s3') // serviço S3

// função do endpoint
const createPhoto = async (req, res) => {
  try {

    if (!req.file) {
      return res.status(400).json({ error: 'Imagem obrigatória' }) // valida se enviou arquivo
    }

    const promoterId = req.user.id // pega id do usuário autenticado (RBAC)

    // envia para S3
    const s3Url = await uploadToS3(req.file)

    // salva no banco
    const query = `
      INSERT INTO photos (s3_url, promoter_id)
      VALUES ($1, $2)
      RETURNING *;
    `

    const values = [s3Url, promoterId]

    const result = await pool.query(query, values) // executa query

    return res.status(201).json(result.rows[0]) // retorna registro criado

  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: 'Erro ao salvar foto' })
  }
}

module.exports = { createPhoto }