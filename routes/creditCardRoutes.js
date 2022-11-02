import express from 'express'
import creditCardController from '../controllers/creditCardController.js'
const router = express.Router()

router.post('/add', creditCardController.saveCreditCard)
router.post('/get', creditCardController.getCreditCards)
router.delete('/delete', creditCardController.deleteCreditCard)

export default router