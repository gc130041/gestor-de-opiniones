import bcryptjs from 'bcryptjs';
import Account from '../accounts/account.model.js';
import { generateJWT } from '../helpers/generate-jwt.js';

export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const account = await Account.findOne({ email });

        if (!account) {
            return res.status(400).json({
                success: false,
                message: 'Credenciales incorrectas',
                error: 'El correo no existe en la base de datos'
            });
        }

        if (!account.isActive) {
            return res.status(400).json({
                success: false,
                message: 'La cuenta está desactivada'
            });
        }

        const validPassword = bcryptjs.compareSync(password, account.password);

        if (!validPassword) {
            return res.status(400).json({
                success: false,
                message: 'Credenciales incorrectas',
                error: 'Contraseña incorrecta'
            });
        }

        const token = await generateJWT(account.id);

        res.status(200).json({
            success: true,
            message: 'Login exitoso',
            userDetails: {
                token,
                profile: account.profile, 
                uid: account.id
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error en el servidor',
            error: error.message
        });
    }
};