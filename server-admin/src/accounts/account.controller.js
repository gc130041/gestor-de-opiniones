import bcryptjs from 'bcryptjs';
import Account from './account.model.js';

export const register = async (req, res) => {
    try {
        const { name, username, email, password } = req.body;
        const account = new Account({ name, username, email, password });

        const salt = bcryptjs.genSaltSync();
        account.password = bcryptjs.hashSync(password, salt);

        await account.save();

        res.status(201).json({
            success: true,
            message: 'Usuario registrado exitosamente',
            account
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al registrar usuario',
            error: error.message
        });
    }
};

export const updateAccount = async (req, res) => {
    try {
        const { id } = req.params;
        const { _id, password, email, ...data } = req.body;

        if (password) {
            const salt = bcryptjs.genSaltSync();
            data.password = bcryptjs.hashSync(password, salt);
        }

        const account = await Account.findByIdAndUpdate(id, data, { new: true });

        res.status(200).json({
            success: true,
            message: 'Usuario actualizado',
            account
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al actualizar',
            error: error.message
        });
    }
};