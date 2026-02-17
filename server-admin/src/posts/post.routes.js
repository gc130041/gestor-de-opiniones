import { Router } from 'express';
import { createPost, getPosts, deletePost, updatePost } from './post.controller.js';
import { validateCreatePost, validatePostId } from '../../middlewares/post-validator.js';
import { validateJWT } from '../../middlewares/validate-jwt.js';

const router = Router();

router.post('/', validateJWT, validateCreatePost, createPost);
router.get('/', getPosts);
router.put('/:id', validateJWT, validatePostId, updatePost);
router.delete('/:id', validateJWT, validatePostId, deletePost);

export default router;