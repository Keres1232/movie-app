# 🎬 CineVault — Movie App

Aplicación web para descubrir, filtrar y guardar películas favoritas. Desarrollada con Vue 3, Pinia y Vue Router, consumiendo la API de TMDB.

---

## 🚀 Demo

[Ver en Vercel](https://movie-app-keres1232.vercel.app)

---

## ✨ Funcionalidades

- 🔍 **Búsqueda dinámica** con debounce para no saturar la API
- 🎛️ **Filtros** por género, año y ordenamiento (8 criterios)
- ♥ **Favoritos** persistidos en localStorage
- ⚙️ **Preferencias del usuario** guardadas localmente
- 💀 **Skeleton loading** mientras cargan las películas
- ⚠️ **Manejo de errores** con mensajes y botón de reintento
- 📄 **Paginación** de resultados
- 📱 **Diseño responsive** para móvil y escritorio

---

## 🛠️ Tecnologías

| Tecnología | Versión | Uso |
|---|---|---|
| Vue 3 | ^3.5.29 | Framework principal |
| Pinia | ^2.1.7 | Estado global |
| Vue Router | ^4.3.0 | Navegación entre páginas |
| Vite | ^7.3.1 | Bundler y servidor de desarrollo |
| TMDB API | v3 | Fuente de datos de películas |

---

## 📁 Estructura del proyecto

```
movie-app/
├── public/
│   └── logo.svg              # Favicon
├── src/
│   ├── assets/
│   │   └── main.css          # Estilos globales y variables de tema
│   ├── components/
│   │   ├── AppNav.vue        # Barra de navegación y búsqueda
│   │   ├── FilterBar.vue     # Filtros y ordenamiento
│   │   ├── MovieCard.vue     # Tarjeta individual de película
│   │   └── MovieGrid.vue     # Grilla con estados de loading/error/vacío
│   ├── stores/
│   │   └── movieStore.js     # Estado global con Pinia
│   ├── views/
│   │   ├── HomeView.vue      # Página principal
│   │   ├── FavoritesView.vue # Página de favoritos
│   │   └── MovieDetailView.vue # Detalle de película
│   ├── router/
│   │   └── index.js          # Definición de rutas
│   ├── App.vue               # Componente raíz
│   └── main.js               # Punto de entrada
├── .env                      # Variables de entorno (no subir a git)
├── vercel.json               # Configuración de deploy
├── index.html                # HTML raíz
└── package.json
```

---

## ⚙️ Instalación y uso

### 1. Clonar el repositorio

```bash
git clone https://github.com/Keres1232/movie-app.git
cd movie-app
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Crea un archivo `.env` en la raíz del proyecto:

```
VITE_TMDB_API_KEY=tu_api_key_aqui
```

> Obtén tu API key gratis en [themoviedb.org/settings/api](https://www.themoviedb.org/settings/api)
>
> Sin API key la app funciona con datos de ejemplo (sin imágenes).

### 4. Correr en desarrollo

```bash
npm run dev
```

### 5. Build para producción

```bash
npm run build
```

---

## 🌐 Deploy en Vercel

El proyecto está configurado con `vercel.json` para deploy automático.

Cada `git push` a `master` dispara un nuevo deploy en Vercel.

**Variables de entorno requeridas en Vercel:**

| Variable | Descripción |
|---|---|
| `VITE_TMDB_API_KEY` | API key de TMDB |

---

## 📐 Arquitectura

```
main.js
  └── App.vue
        ├── AppNav.vue         ← búsqueda
        └── router-view
              ├── HomeView
              │     ├── FilterBar.vue
              │     └── MovieGrid.vue
              │           └── MovieCard.vue (x N)
              ├── FavoritesView
              └── MovieDetailView

movieStore.js (Pinia)
  ├── state: movies, loading, error, filters
  ├── favorites → localStorage
  └── preferences → localStorage
```

---

## 👨‍💻 Autor

Desarrollado por **Keres1232**  
Universidad de San Buenaventura — Bogotá  
Optativa 3 — Aplicación Web con Vue y APIs