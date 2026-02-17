import { Router } from 'express';
import { login } from './auth.controller.js';
import { body } from 'express-validator';
import { checkValidators } from '../../middlewares/check-validators.js';

const router = Router();

router.post(
    '/login',
    [
        body('email', 'El correo es obligatorio').isEmail(),
        body('password', 'La contraseña es obligatoria').not().isEmpty(),
        checkValidators
    ],
    login
);

export default router;