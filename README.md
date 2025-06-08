# GGPost 🎮📝

**GGPost** (God Game Post) es una plataforma social para amantes de los videojuegos. Los usuarios pueden publicar contenido, comentar, reaccionar y descubrir los títulos más valorados en diferentes consolas.

---

# 🌐 Despliegue

- Frontend desplegado en Vercel

- Backend desplegado en Render

---

## 🧩 Descripción del Proyecto

GGPost nace con la idea de ofrecer un espacio donde los gamers puedan:

- Publicar opiniones, noticias o comentarios sobre videojuegos.
- Interactuar con otros usuarios mediante likes y comentarios.
- Descubrir los juegos más valorados por consola.
- Gestionar su perfil personal y sus publicaciones.

---

## 🚀 Funcionalidades Principales

### 🔐 Autenticación

- **Registro** con validación de nombre de usuario y correo electrónico únicos.
- Envío de un correo de bienvenida tras el registro.
- **Login** con verificación contra la base de datos.
- Generación de un **token JWT** guardado en cookies (`httpOnly`, `secure`, `sameSite: 'none'`).
- Las rutas protegidas requieren un token válido, si expira redirige automáticamente al login.

---

### 🏠 Página Principal (Post)

- Visualización de todos los post subidos por los usuarios.
- Cada post muestra:
  - Imagen
  - Título
  - Descripción
  - Categorías
- Al hacer clic se abre un **modal** con:
  - Visitas (cada visita se guarda si no es del propio usuario)
  - Likes
  - Comentarios
- **Buscador** para filtrar por categoría.
- Likes y comentarios se guardan en la base de datos para mantener la interacción.

---

### 🎮 Juegos Mejor Valorados

- Información extraída desde la **API de RAWG**.
- Filtro por consola para facilitar la búsqueda.
- Interfaz moderna y visualmente atractiva.

---

### 👤 Perfil de Usuario

- Visualización de los **datos del usuario** (nombre y correo) – no modificables.
- Subida y edición del **icono de usuario** (almacenado en **Cloudinary**).
- Secciones dentro del perfil:
  - **Mis Post**:
    - Búsqueda por categoría
    - Edición (título, descripción, categoría)
    - Eliminación de post
    - Like y comentarios
  - **Crear Post**:
    - Subida de imagen, título y descripción
  - **Cerrar Sesión**

---

### 🛠️ Funciones Administrativas

- Un usuario **admin** tiene la capacidad de:
  - Eliminar cualquier post
  - Editar cualquier post desde la vista general

---

## 🧪 Tecnologías Usadas

### ⚙️ Frontend
- **React.js** (estructura basada en componentes)
- **CSS** puro para estilos
- Dos Layouts principales
- Rutas definidas y gestionadas desde `App.jsx`

### 🔧 Backend
- **Node.js** + **Express.js**
- **MongoDB** como base de datos principal
- **Mongoose** para los modelos
- **Multer + Cloudinary** para gestión de imágenes
- **jsonwebtoken** para autenticación
- Rutas protegidas por middleware que valida el token
- Cada ruta está asociada a funciones con sus respectivas validaciones

