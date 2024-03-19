import express from 'express'
import * as controller from '../controllers/areaController'

const router = express.Router()
router.get('/getAll', controller.getAreas)

export default router