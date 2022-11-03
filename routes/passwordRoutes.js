import express from 'express'
const router = express.Router()
import passwordsController from '../controllers/dataController.js'
import getUser from '../middleware/getUser.js'

router.post('/add', getUser, passwordsController.savePassword)
router.post('/get', getUser, passwordsController.getPassword)
router.delete('/delete', getUser, passwordsController.deletePassword)

export default router