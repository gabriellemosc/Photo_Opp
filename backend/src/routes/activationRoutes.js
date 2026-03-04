const express = require('express')
const router = express.Router()

const authMiddleware = require('../middlewares/authMiddleware')
const authorize = require('../middlewares/authorize')
const upload = require('../middlewares/upload') //multer


const { uploadActivation } = require('../controllers/activationController')

// rota principal do fluxo de ativação
router.post(
  '/upload',
  authMiddleware, // valida token
  authorize(['PROMOTOR']), // apenas promotor pode acessar fluxo
  upload.single('image'),
  uploadActivation
)

module.exports = router