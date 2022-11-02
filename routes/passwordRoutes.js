import express from 'express'
const router = express.Router()
import passwordsController from'../controllers/passwordsController.js'

router.post('/add', passwordsController.savePassword)
router.post('/get', passwordsController.getPassword)
router.delete('/delete', passwordsController.deletePassword)

export default router