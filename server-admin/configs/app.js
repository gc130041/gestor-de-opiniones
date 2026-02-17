import express from 'express';
import { config } from 'dotenv';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import { dbConnection } from './db.js';
import accountRoutes from '../src/accounts/account.routes.js';
import postRoutes from '../src/posts/post.routes.js';
import commentRoutes from '../src/comments/comment.routes.js';
import authRoutes from '../src/auth/auth.routes.js';

config();

const app = express();
const port = process.env.PORT || 3000;

app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Rutas
app.use('/gestorOpiniones/v1/account', accountRoutes);
app.use('/gestorOpiniones/v1/post', postRoutes);
app.use('/gestorOpiniones/v1/comment', commentRoutes);
app.use('/gestorOpiniones/v1/auth', authRoutes);

export const initServer = async () => {
    try {
        await dbConnection();
        app.listen(port, () => {
            console.log(`Server running on port ${port}`);
        });
    } catch (error) {
        console.error('Error al iniciar el servidor:', error);
    }
}

// initServer();  <--- ¡ESTA LÍNEA SE ELIMINA! (Causaba el doble inicio)