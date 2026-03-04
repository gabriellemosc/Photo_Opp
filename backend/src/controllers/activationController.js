const pool = require('../database/connection')
const uploadToS3 = require('../services/s3')


const uploadActivation = async (req, res) => {
    try {
  
      if (!req.file) {
        return res.status(400).json({ error: 'Image Mandatory' })
      }
  
      const promoterId = req.user.id
  
      const s3Url = await uploadToS3(req.file)
  
      const query = `
        INSERT INTO photos (s3_url, promoter_id)
        VALUES ($1, $2)
        RETURNING id, s3_url;
      `
  
      const result = await pool.query(query, [s3Url, promoterId])
  
      return res.status(201).json(result.rows[0])
  
    } catch (error) {
      console.error(error)
      return res.status(500).json({ error: 'Error to Save Image' })
    }
  }
  
  module.exports = { uploadActivation }