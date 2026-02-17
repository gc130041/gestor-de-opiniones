import Comment from './comment.model.js';

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

export const deleteComment = async (req, res) => {
    try {
        const { id } = req.params;
        const comment = await Comment.findByIdAndDelete(id);

        if (!comment) {
            return res.status(404).json({
                success: false,
                message: 'Comentario no encontrado'
            });
        }

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