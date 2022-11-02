import express from 'express'
const router = express.Router()
import userController from'../controllers/userController.js'

router.post('/create', userController.createUser)
router.post('/login', userController.loginUser)

export default router