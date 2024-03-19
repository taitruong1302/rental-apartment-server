import express from 'express'
import * as controller from '../controllers/acreageController'

const router = express.Router()
router.get('/getAll', controller.getAcreage)

export default router