import express from "express";
import * as insertController from '../controllers/insertController'

const router = express.Router()
router.post('/', insertController.insert)

export default router