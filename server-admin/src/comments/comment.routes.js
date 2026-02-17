import { Router } from 'express';
import { createComment, getCommentsByPost, deleteComment } from './comment.controller.js';
import { validateCreateComment, validateCommentId } from '../../middlewares/comment.validator.js';
import { validateJWT } from '../../middlewares/validate-jwt.js';

const router = Router();

router.post('/', validateJWT, validateCreateComment, createComment);
router.get('/post/:postId', getCommentsByPost);
router.delete('/:id', validateJWT, validateCommentId, deleteComment);

export default router;