const express = require('express')
const router = express.Router()
const getUser = require('../middleware/getUser')
const imageController = require('../controllers/imageController')

router.post('/upload',getUser,  imageController.addImages)

module.exports = router