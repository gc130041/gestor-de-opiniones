import Post from './post.model.js';

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

export const deletePost = async (req, res) => {
    try {
        const { id } = req.params;
        const post = await Post.findByIdAndDelete(id);

        if (!post) {
            return res.status(404).json({
                success: false,
                message: 'Publicación no encontrada'
            });
        }

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