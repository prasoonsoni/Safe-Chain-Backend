import express from 'express'
import getUser from '../middleware/getUser.js'
const router = express.Router()
import imageController from'../controllers/imageController.js'

router.post('/upload', getUser, imageController.addImages)
router.get('/all', getUser, imageController.getImages)

export default router