import { body, param } from 'express-validator';
import { checkValidators } from "./check-validators.js";
import Account from '../src/accounts/account.model.js';

export const validateRegister = [
    body('name', 'El nombre es obligatorio').not().isEmpty(),
    body('username', 'El nombre de usuario es obligatorio').not().isEmpty(),
    body('username').custom(async (username) => {
        const exists = await Account.findOne({ username });
        if (exists) throw new Error('El nombre de usuario ya está en uso');
    }),
    body('email', 'El correo no es válido').isEmail(),
    body('email').custom(async (email) => {
        const exists = await Account.findOne({ email });
        if (exists) throw new Error('El correo ya está registrado');
    }),
    body('password', 'La contraseña debe tener al menos 6 caracteres').isLength({ min: 6 }),
    checkValidators
];

export const validateUpdate = [
    param('id', 'No es un ID válido').isMongoId(),
    param('id').custom(async (id) => {
        const exists = await Account.findById(id);
        if (!exists) throw new Error('El usuario no existe');
    }),
    body('role').optional().isIn(['ADMIN_ROLE', 'USER_ROLE']).withMessage('Rol no válido'),
    checkValidators
];