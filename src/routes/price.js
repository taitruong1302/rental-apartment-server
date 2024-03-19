import express from 'express'
import * as controller from '../controllers/priceController'

const router = express.Router()
router.get('/getAll', controller.getPrices)

export default router