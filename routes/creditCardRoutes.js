import express from 'express'
import creditCardController from '../controllers/dataController.js'
import getUser from '../middleware/getUser.js'
const router = express.Router()

router.post('/add',getUser, creditCardController.saveCreditCard)
router.post('/get',getUser, creditCardController.getCreditCards)
router.delete('/delete', creditCardController.deleteCreditCard)

export default router