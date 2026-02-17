import Comment from './comment.model.js';
import Post from '../posts/post.model.js'; // Importación necesaria si validamos algo del post

export const createComment = async (req, res) => {
    try {
        const { content, postId } = req.body;
        const author = req.user._id;

        const comment = new Comment({ content, post: postId, author });
        await comment.save();

        res.status(201).json({
            success: true,
            message: 'Comentario agregado',
            comment
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al comentar',
            error: error.message
        });
    }
};

export const getCommentsByPost = async (req, res) => {
    try {
        const { postId } = req.params;
        const comments = await Comment.find({ post: postId }).populate('author', 'username');

        res.status(200).json({
            success: true,
            comments
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener comentarios',
            error: error.message
        });
    }
};

// FUNCIÓN AGREGADA: Actualizar Comentario
export const updateComment = async (req, res) => {
    try {
        const { id } = req.params;
        const { content } = req.body;

        const comment = await Comment.findById(id);

        if (!comment) {
            return res.status(404).json({
                success: false,
                message: 'Comentario no encontrado'
            });
        }

        // Validar propiedad
        if (comment.author.toString() !== req.user._id.toString()) {
            return res.status(401).json({
                success: false,
                message: 'No puedes editar un comentario que no es tuyo'
            });
        }

        comment.content = content;
        await comment.save();

        res.status(200).json({
            success: true,
            message: 'Comentario actualizado',
            comment
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al actualizar comentario',
            error: error.message
        });
    }
};

export const deleteComment = async (req, res) => {
    try {
        const { id } = req.params;
        const comment = await Comment.findById(id);

        if (!comment) {
            return res.status(404).json({
                success: false,
                message: 'Comentario no encontrado'
            });
        }

        if (comment.author.toString() !== req.user._id.toString() && req.user.role !== 'ADMIN_ROLE') {
            return res.status(401).json({
                success: false,
                message: 'No tienes permiso para eliminar este comentario'
            });
        }

        await Comment.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: 'Comentario eliminado'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al eliminar comentario',
            error: error.message
        });
    }
};