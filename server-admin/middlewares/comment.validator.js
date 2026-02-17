import { body, param } from 'express-validator';
import { checkValidators } from "./check-validators.js";
import Post from '../src/posts/post.model.js';

export const validateCreateComment = [
    body('content', 'El contenido es obligatorio').not().isEmpty(),
    body('postId', 'El ID del post es obligatorio y debe ser válido').isMongoId(),
    body('postId').custom(async (postId) => {
        const post = await Post.findById(postId);
        if (!post) throw new Error('La publicación no existe');
    }),
    checkValidators
];

export const validateCommentId = [
    param('id', 'ID de comentario no válido').isMongoId(),
    checkValidators
];