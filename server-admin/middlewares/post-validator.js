import { body, param } from 'express-validator';
import { checkValidators } from "./check-validators.js";

export const validateCreatePost = [
    body('title', 'El título es obligatorio').not().isEmpty(),
    body('category', 'La categoría es obligatoria').not().isEmpty(),
    body('content', 'El contenido es obligatorio').not().isEmpty(),
    checkValidators
];

export const validatePostId = [
    param('id', 'ID de publicación no válido').isMongoId(),
    checkValidators
];