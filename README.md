# 📝 Gestor de Opiniones - Documentación del Proyecto

Aplicación web full-stack para la gestión de publicaciones y comentarios. Permite a los usuarios registrarse, iniciar sesión, crear publicaciones y comentar en las publicaciones de otros usuarios. Incluye un backend en Node.js/Express y un frontend en Vanilla JS con Bootstrap.

---

## 🚀 Requisitos Previos

Asegúrate de tener instalado lo siguiente en tu entorno local:

*   [Node.js](https://nodejs.org/) (v16 o superior recomendado)
*   [MongoDB](https://www.mongodb.com/) (Servicio local o conexión a Atlas)
*   Un gestor de paquetes como `npm` (incluido con Node.js) o `yarn`.

---

## 🛠️ Instalación y Configuración

### 1. Clonar el proyecto e instalar dependencias

Abre una terminal en la carpeta del proyecto y ejecuta:

```bash
npm install
```

### 2. Configuración de Variables de Entorno

Crea un archivo llamado `.env` en la raíz del proyecto (al mismo nivel que `package.json`). Copia y pega la siguiente configuración:

```env
PORT=3000
URI_MONGODB=mongodb://127.0.0.1:27017/GestorOpiniones
JWT_SECRET=TuFraseSecretaParaTokens2024
```

> **Nota:** Cambia `URI_MONGODB` si utilizas MongoDB Atlas.

### 3. Ejecutar el Servidor

Para iniciar el backend en modo desarrollo:

```bash
npm run dev / node --use-env-proxy index.js
```
*Si no tienes script `dev`, usa `node app.js` o `nodemon app.js`.*

El servidor iniciará en: `http://localhost:3000`

---

## 💻 Frontend

El frontend se encuentra en los archivos raíz:
*   **`index.html`**: Estructura principal con Bootstrap 5.
*   **`main.js`**: Lógica de interacción con la API (Fetch), manejo del DOM y autenticación.

Para usarlo, simplemente abre el archivo `index.html` en tu navegador o sírvelo con una extensión como *Live Server*.

### Funcionalidades del Frontend:
1.  **Autenticación:** Login y Registro con almacenamiento de Token (JWT) en `localStorage`.
2.  **Dashboard:** Visualización de posts en tiempo real.
3.  **Gestión de Posts:** Crear, Editar y **Eliminar** (solo visible para el dueño del post).
4.  **Comentarios:** Ver y agregar comentarios dinámicamente.

---

## 📡 API Endpoints (Backend)

Todas las rutas tienen el prefijo base: `/gestorOpiniones/v1`

### 🔐 Autenticación (`/auth` & `/account`)

| Método | Ruta | Descripción | Body Requerido |
| :--- | :--- | :--- | :--- |
| **POST** | `/auth/login` | Iniciar sesión | `{ email, password }` |
| **POST** | `/account/register` | Registrar usuario | `{ name, username, email, password }` |
| **PUT** | `/account/:id` | Actualizar perfil | `{ name, password, ... }` |

### 📝 Publicaciones (`/post`)

Requieren Header: `x-token` (excepto GET)

| Método | Ruta | Descripción | Body Requerido |
| :--- | :--- | :--- | :--- |
| **GET** | `/` | Obtener todas las publicaciones | N/A |
| **POST** | `/` | Crear publicación | `{ title, category, content }` |
| **PUT** | `/:id` | Editar publicación (solo dueño) | `{ title, content }` |
| **DELETE**| `/:id` | Eliminar publicación | N/A |

> **Nota sobre DELETE:** Al eliminar una publicación, el sistema realiza una **eliminación en cascada**, borrando también todos los comentarios asociados a dicha publicación en la base de datos.

### 💬 Comentarios (`/comment`)

Requieren Header: `x-token` (excepto GET)

| Método | Ruta | Descripción | Body Requerido |
| :--- | :--- | :--- | :--- |
| **POST** | `/` | Crear comentario | `{ content, postId }` |
| **GET** | `/post/:postId` | Ver comentarios de un post | N/A |
| **DELETE**| `/:id` | Eliminar comentario (solo dueño) | N/A |
| **PUT** | `/:id` | Editar comentario (solo dueño) | `{ content }` |

---

## 📂 Estructura del Proyecto

```text
/
├── src/
│   ├── accounts/       # Controladores, modelos y rutas de usuarios
│   ├── auth/           # Login y generación de tokens
│   ├── comments/       # Lógica de comentarios
│   ├── posts/          # Lógica de publicaciones
│   ├── middlewares/    # Validaciones (JWT, campos vacíos)
│   ├── helpers/        # Generador de JWT, DB connection
│   └── ...
├── node_modules/
├── .env                # Variables de entorno (NO subir a git)
├── .gitignore
├── app.js              # Punto de entrada del servidor Express
├── db.js               # Conexión a MongoDB
├── index.html          # Interfaz de usuario
├── main.js             # Lógica del cliente (Frontend)
└── package.json        # Dependencias
```

---

## 🛡️ Seguridad Implementada

1.  **JWT (JSON Web Tokens):** Las rutas protegidas requieren un token válido en el header `x-token`.
2.  **Validaciones:** Uso de `express-validator` para asegurar que los datos enviados (email, contraseña, IDs de Mongo) sean correctos.
3.  **Encriptación:** Las contraseñas se almacenan hasheadas utilizando `bcryptjs`.
4.  **Helmet:** Configuración de cabeceras HTTP seguras.
5.  **Validación de Roles/Dueño:**
    *   Un usuario solo puede editar/eliminar sus propios posts y comentarios.
    *   El rol `ADMIN_ROLE` tiene permisos superiores (si se configura).

---