import express from 'express'
import * as postController from '../controllers/postController'
import verifyToken from '../middleware/verifyToken'

const router = express.Router()
router.get('/getAll', postController.getPosts)
router.get('/getById', postController.getPostById)
router.get('/getLimit', postController.getLimitPosts)
router.get('/getNewPost', postController.getNewPosts)

router.use(verifyToken)
router.post('/createNewPost', postController.createNewPost)
router.get('/limitAdmin', postController.getAdminLimitPosts)
router.put('/updatePost', postController.updatePost)
router.delete('/deletePost', postController.deletePost)

export default router