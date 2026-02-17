import Account from '../src/accounts/account.model.js';
import bcryptjs from 'bcryptjs';

export const createAdminSeed = async () => {
    try {
        const adminExists = await Account.findOne({ role: 'ADMIN_ROLE' });

        if (!adminExists) {
            const salt = bcryptjs.genSaltSync();
            const encryptedPassword = bcryptjs.hashSync('12345678', salt);

            const admin = new Account({
                name: 'Admin Principal',
                username: 'admin',
                email: 'admin@kinal.edu.gt',
                password: encryptedPassword,
                role: 'ADMIN_ROLE',
                isActive: true
            });

            await admin.save();
            console.log('MongoDB | Admin predeterminado creado exitosamente');
        } else {
            console.log('MongoDB | El admin ya existe, no es necesario crearlo');
        }
    } catch (error) {
        console.error('Error al crear el admin seed:', error);
    }
};