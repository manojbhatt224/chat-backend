import express from 'express'
import PostController from '../controllers/postController.js'
import checkUserAuth from '../middlewares/auth-middleware.js';
const router = express.Router()

//private routes
router.post('/', checkUserAuth, PostController.createPost)
router.get('/:id',checkUserAuth, PostController.getPost)
router.put('/:id', checkUserAuth, PostController.updatePost)
router.delete('/:id',checkUserAuth, PostController.deletePost)
router.put('/:id/like', checkUserAuth, PostController.likePost)
router.get('/:id/timeline', checkUserAuth, PostController.getTimelinePosts)

export default router