const express = require('express')
const router = express.Router()
const upload = require('../middlewares/upload') // multer
const { createPhoto } = require('../controllers/photoController')


const authMiddleware = require('../middlewares/authMiddleware')

// POST /photos
router.post(
  '/',
  authMiddleware,
  upload.single('image'), // espera campo "image"
  createPhoto
)

module.exports = router