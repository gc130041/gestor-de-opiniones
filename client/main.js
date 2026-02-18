const API_URL = 'http://localhost:3000/gestorOpiniones/v1';

// Referencias del DOM
const authSection = document.getElementById('auth-section');
const dashboardSection = document.getElementById('dashboard-section');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const btnLogout = document.getElementById('btnLogout');
const createPostForm = document.getElementById('createPostForm');
const postsContainer = document.getElementById('posts-container');

// Estado
let token = localStorage.getItem('token');
let currentUser = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;

// === INICIALIZACIÓN ===
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
});

function checkAuth() {
    if (token) {
        authSection.classList.add('hidden');
        dashboardSection.classList.remove('hidden');
        btnLogout.classList.remove('hidden');
        loadPosts();
    } else {
        authSection.classList.remove('hidden');
        dashboardSection.classList.add('hidden');
        btnLogout.classList.add('hidden');
    }
}

// === AUTHENTICATION ===

// Login
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    try {
        const res = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const data = await res.json();

        if (data.success) {
            token = data.userDetails.token;
            currentUser = { uid: data.userDetails.uid };
            
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(currentUser));
            
            checkAuth();
            loginForm.reset();
        } else {
            alert(data.message || 'Error al iniciar sesión');
        }
    } catch (error) {
        console.error(error);
        alert('Error de conexión');
    }
});

// Registro
registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('regName').value;
    const username = document.getElementById('regUsername').value;
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;

    try {
        const res = await fetch(`${API_URL}/account/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, username, email, password })
        });
        const data = await res.json();

        if (data.success) {
            alert('Registro exitoso. Por favor inicia sesión.');
            document.getElementById('login-tab').click(); 
            registerForm.reset();
        } else {
            const msg = Array.isArray(data.errors) ? data.errors[0].msg : data.message;
            alert(msg || 'Error en el registro');
        }
    } catch (error) {
        console.error(error);
        alert('Error de conexión');
    }
});

// Logout
btnLogout.addEventListener('click', () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    token = null;
    currentUser = null;
    checkAuth();
});

// === POSTS ===

// Cargar Publicaciones
async function loadPosts() {
    try {
        const res = await fetch(`${API_URL}/post`);
        const data = await res.json();

        if (data.success) {
            renderPosts(data.posts);
        }
    } catch (error) {
        console.error('Error cargando posts:', error);
    }
}

// Renderizar Posts en HTML
function renderPosts(posts) {
    const postsContainer = document.getElementById('posts-container');
    postsContainer.innerHTML = '';
    
    console.log("Usuario actual:", currentUser); // Para depurar en consola

    posts.forEach(post => {
        
        const authorId = post.author.uid || post.author._id || post.author;
        const currentUserId = currentUser ? currentUser.uid : null;
        
        const isOwner = currentUserId && (String(authorId) === String(currentUserId));
        
        console.log(`Post: ${post.title} | Autor ID: ${authorId} | Mi ID: ${currentUserId} | Es dueño: ${isOwner}`);

        const card = document.createElement('div');
        card.className = 'card mb-3 shadow-sm';
        
        card.innerHTML = `
            <div class="card-body">
                <div class="d-flex justify-content-between align-items-start">
                    <div>
                        <h5 class="card-title text-primary mb-0">${post.title}</h5>
                        <small class="text-muted">${post.category}</small>
                    </div>
                    
                    <!-- BOTONES DE ACCIÓN (Solo visibles si es dueño) -->
                    ${isOwner ? `
                        <div class="btn-group">
                            <button class="btn btn-sm btn-outline-danger" onclick="deletePost('${post._id}')">
                                Eliminar
                            </button>
                            <button class="btn btn-sm btn-outline-secondary" onclick="editPost('${post._id}', '${post.title}', '${post.content}')">
                                Editar
                            </button>
                        </div>
                    ` : ''}
                </div>

                <h6 class="card-subtitle my-2 text-muted">Por: ${post.author.username || 'Desconocido'}</h6>
                <p class="card-text mt-3">${post.content}</p>
                
                <hr>
                
                <button class="btn btn-sm btn-primary" onclick="toggleComments('${post._id}')">
                    Ver Comentarios
                </button>

                <!-- Sección de Comentarios -->
                <div id="comments-${post._id}" class="comment-section p-3 rounded mt-2 hidden">
                    <div id="comments-list-${post._id}" class="mb-2">
                        <small>Cargando comentarios...</small>
                    </div>
                    <form onsubmit="postComment(event, '${post._id}')" class="d-flex gap-2">
                        <input type="text" class="form-control form-control-sm" placeholder="Escribe un comentario..." required>
                        <button type="submit" class="btn btn-sm btn-dark">Enviar</button>
                    </form>
                </div>
            </div>
        `;
        postsContainer.appendChild(card);
    });
}

// Crear Post
createPostForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = document.getElementById('postTitle').value;
    const category = document.getElementById('postCategory').value;
    const content = document.getElementById('postContent').value;

    try {
        const res = await fetch(`${API_URL}/post`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-token': token
            },
            body: JSON.stringify({ title, category, content })
        });
        const data = await res.json();

        if (data.success) {
            createPostForm.reset();
            loadPosts();
        } else {
            alert(data.message);
        }
    } catch (error) {
        console.error(error);
    }
});

// Eliminar Post
window.deletePost = async (id) => {

    if(!confirm('¿Estás seguro de que deseas eliminar esta publicación permanentemente?')) return;

    try {
        
        const res = await fetch(`${API_URL}/post/${id}`, {
            method: 'DELETE',
            headers: { 
                'x-token': token, 
                'Content-Type': 'application/json'
            }
        });

        const data = await res.json();

        if (data.success) {
            alert('Publicación eliminada correctamente');
            loadPosts(); 
        } else {
            alert(data.message || 'Error al eliminar');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error de conexión con el servidor');
    }
};

// Editar Post
window.editPost = async (id, currentTitle, currentContent) => {
    const newTitle = prompt("Nuevo título:", currentTitle);
    const newContent = prompt("Nuevo contenido:", currentContent);

    if (newTitle && newContent) {
        try {
            const res = await fetch(`${API_URL}/post/${id}`, {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json',
                    'x-token': token 
                },
                body: JSON.stringify({ title: newTitle, content: newContent })
            });
            const data = await res.json();
            if(data.success) loadPosts();
            else alert(data.message);
        } catch (error) {
            console.error(error);
        }
    }
};

// === COMMENTS ===

// Mostrar/Ocultar y Cargar Comentarios
window.toggleComments = async (postId) => {
    const container = document.getElementById(`comments-${postId}`);
    const list = document.getElementById(`comments-list-${postId}`);
    
    if (container.classList.contains('hidden')) {
        container.classList.remove('hidden');
        // Cargar comentarios
        try {
            const res = await fetch(`${API_URL}/comment/post/${postId}`);
            const data = await res.json();
            
            if (data.success) {
                list.innerHTML = data.comments.length ? '' : '<small class="text-muted">No hay comentarios aún.</small>';
                
                data.comments.forEach(c => {
                    const isAuthor = currentUser && c.author._id === currentUser.uid;
                    list.innerHTML += `
                        <div class="bg-white p-2 mb-1 rounded border">
                            <strong class="text-dark small">${c.author.username}:</strong> 
                            <span class="small">${c.content}</span>
                            ${isAuthor ? `<a href="#" class="text-danger small ms-2" onclick="deleteComment('${c._id}', '${postId}')">x</a>` : ''}
                        </div>
                    `;
                });
            }
        } catch (error) {
            console.error(error);
        }
    } else {
        container.classList.add('hidden');
    }
};

// Publicar Comentario
window.postComment = async (e, postId) => {
    e.preventDefault();
    const input = e.target.querySelector('input');
    const content = input.value;

    try {
        const res = await fetch(`${API_URL}/comment`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-token': token
            },
            body: JSON.stringify({ content, postId })
        });
        const data = await res.json();

        if (data.success) {
            input.value = '';
            // Recargar comentarios cerrando y abriendo
            document.getElementById(`comments-${postId}`).classList.add('hidden');
            toggleComments(postId);
        } else {
            alert(data.message);
        }
    } catch (error) {
        console.error(error);
    }
};

// Eliminar Comentario
window.deleteComment = async (commentId, postId) => {
    if(!confirm('¿Borrar comentario?')) return;

    try {
        const res = await fetch(`${API_URL}/comment/${commentId}`, {
            method: 'DELETE',
            headers: { 'x-token': token }
        });
        const data = await res.json();
        if(data.success) {
            // Recargar comentarios
            document.getElementById(`comments-${postId}`).classList.add('hidden');
            toggleComments(postId);
        }
    } catch (error) {
        console.error(error);
    }
};