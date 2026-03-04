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

const deletePhoto = async (req, res) => {
  try {

    const photoId = req.params.id // pega id da foto da URL
    const userId = req.user.id // id do usuário autenticado
    const userRole = req.user.role // role do usuário

    // 1️⃣ Verifica se a foto existe
    const photoResult = await pool.query(
      'SELECT * FROM photos WHERE id = $1',
      [photoId]
    )

    if (photoResult.rows.length === 0) {
      return res.status(404).json({ error: 'Foto não encontrada' })
    }

    const photo = photoResult.rows[0]

    // 2️⃣ Regra de autorização extra (segurança adicional)
    // ADMIN pode deletar qualquer foto
    // PROMOTOR só pode deletar as próprias fotos
    if (userRole !== 'ADMIN' && photo.promoter_id !== userId) {
      return res.status(403).json({ error: 'Acesso negado' })
    }

    // 3️⃣ Deleta registro do banco
    await pool.query(
      'DELETE FROM photos WHERE id = $1',
      [photoId]
    )

    return res.status(200).json({ message: 'Foto deletada com sucesso' })

  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: 'Erro ao deletar foto' })
  }
}

module.exports = { createPhoto, deletePhoto }