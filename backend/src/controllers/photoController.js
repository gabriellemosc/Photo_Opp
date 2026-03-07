const pool = require('../database/connection') // conexão PostgreSQL
const uploadToS3 = require('../services/s3') // serviço S3
const { S3Client, ListObjectsV2Command } = require("@aws-sdk/client-s3") // importa list

// instancia S3 (igual ao s3.js)
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY
  }
})

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

// Lista fotos do bucket S3
const getPhotos = async (req, res) => {
  try {
    // 📌 Recebe filtros e paginação do frontend
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    const offset = (page - 1) * limit
    const { startDate, endDate } = req.query

    // 📌 Monta query dinâmica com filtro por data
    let query = `SELECT * FROM photos WHERE 1=1`
    const values = []

    if (startDate) {
      values.push(startDate)
      query += ` AND created_at >= $${values.length}`
    }

    if (endDate) {
      values.push(endDate)
      query += ` AND created_at <= $${values.length}`
    }

    // 📌 Contagem total de fotos no BD
    const totalResult = await pool.query('SELECT COUNT(*) FROM photos')
    const total = parseInt(totalResult.rows[0].count)

    // 📌 Contagem filtrada
    const filteredResult = await pool.query(query, values)
    const filteredTotal = filteredResult.rows.length

    // 📌 Aplica paginação
    query += ` ORDER BY created_at DESC LIMIT $${values.length + 1} OFFSET $${values.length + 2}`
    values.push(limit, offset)
    const pagedResult = await pool.query(query, values)

    // 📌 Mapeia cada foto para URL S3 (pode gerar QRCode no frontend com essa URL)
    const photos = pagedResult.rows.map(photo => ({
      id: photo.id,
      s3_url: photo.s3_url,
      created_at: photo.created_at
    }))

    res.json({ total, filteredTotal, page, limit, photos })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erro ao listar fotos' })
  }
}





module.exports = { createPhoto, deletePhoto, getPhotos }