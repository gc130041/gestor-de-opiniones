import jwt from 'jsonwebtoken';
import Account from '../src/accounts/account.model.js';

export const validateJWT = async (req, res, next) => {
const token = req.header('x-token');
if (!token) {
    return res.status(401).json({
        success: false,
        message: 'No hay token en la petición'
    });
}

try {
    const { uid } = jwt.verify(token, process.env.JWT_SECRET);

    const account = await Account.findById(uid);

    if (!account) {
        return res.status(401).json({
            success: false,
            message: 'Token no válido - usuario no existe en DB'
        });
    }

    if (!account.isActive) {
        return res.status(401).json({
            success: false,
            message: 'Token no válido - usuario con estado: false'
        });
    }

    req.user = account;
    next();

} catch (error) {
    console.log(error);
    res.status(401).json({
        success: false,
        message: 'Token no válido'
    });
}
};