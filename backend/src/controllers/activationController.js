const pool = require('../database/connection')
const uploadToS3 = require('../services/s3')


const uploadActivation = async (req, res) => {
    try {
  
      if (!req.file) {
        return res.status(400).json({ error: 'Image Mandatory' })
      }

      
  
      const promoterId = req.user.id
      console.log("Iniciando upload para o S3...");
      const s3Url = await uploadToS3(req.file)
      console.log("Upload S3 concluído. URL:", s3Url);
  
      const query = `
        INSERT INTO photos (s3_url, promoter_id)
        VALUES ($1, $2)
        RETURNING id, s3_url;
      `
  
      const result = await pool.query(query, [s3Url, promoterId])
  
      return res.status(201).json(result.rows[0])
  
    } catch (error) {
      // AQUI ESTÁ A MUDANÇA: Retorna o erro real
      console.error("ERRO DETALHADO:", error);
      return res.status(500).json({ 
        error: 'Error to Save Image', 
        details: error.message, // Isso mostrará o erro real no navegador
        stack: error.stack 
      })
    }
  }
  
  module.exports = { uploadActivation }