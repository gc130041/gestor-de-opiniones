import { Router } from 'express';
import { register, updateAccount } from './account.controller.js';
import { validateRegister, validateUpdate } from '../../middlewares/account.validator.js';
import { validateJWT } from '../../middlewares/validate-jwt.js';

const router = Router();

router.post('/register', validateRegister, register);
router.put('/:id', validateJWT, validateUpdate, updateAccount);

export default router;