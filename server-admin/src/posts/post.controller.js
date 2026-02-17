import Post from './post.model.js';
import Account from '../accounts/account.model.js';

export const createPost = async (req, res) => {
    try {
        const { title, category, content } = req.body;
        const author = req.user._id; 

        const post = new Post({ title, category, content, author });
        await post.save();

        res.status(201).json({
            success: true,
            message: 'Publicación creada',
            post
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al crear publicación',
            error: error.message
        });
    }
};

export const getPosts = async (req, res) => {
    try {
        const posts = await Post.find().populate('author', 'username email');
        res.status(200).json({
            success: true,
            posts
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener publicaciones',
            error: error.message
        });
    }
};

// FUNCIÓN AGREGADA: Actualizar Post
export const updatePost = async (req, res) => {
    try {
        const { id } = req.params;
        const { _id, author, ...data } = req.body;
        
        const post = await Post.findById(id);

        if (!post) {
            return res.status(404).json({
                success: false,
                message: 'Publicación no encontrada'
            });
        }

        // Validar que el usuario que actualiza sea el dueño
        if (post.author.toString() !== req.user._id.toString()) {
            return res.status(401).json({
                success: false,
                message: 'No tienes permiso para editar esta publicación'
            });
        }

        const updatedPost = await Post.findByIdAndUpdate(id, data, { new: true });

        res.status(200).json({
            success: true,
            message: 'Publicación actualizada',
            post: updatedPost
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al actualizar publicación',
            error: error.message
        });
    }
};

export const deletePost = async (req, res) => {
    try {
        const { id } = req.params;
        
        const post = await Post.findById(id);

        if (!post) {
            return res.status(404).json({
                success: false,
                message: 'Publicación no encontrada'
            });
        }

        // Validar que el usuario sea el dueño o sea ADMIN
        // Nota: req.user viene del validate-jwt
        if (post.author.toString() !== req.user._id.toString() && req.user.role !== 'ADMIN_ROLE') {
            return res.status(401).json({
                success: false,
                message: 'No tienes permiso para eliminar esta publicación'
            });
        }

        await Post.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: 'Publicación eliminada'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al eliminar publicación',
            error: error.message
        });
    }
};