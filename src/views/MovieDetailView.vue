<template>
  <div class="detail-page">
    <div v-if="loading" class="detail-loading">
      <div class="spinner"></div>
      <p>Cargando película...</p>
    </div>

    <div v-else-if="movie" class="detail-content">
      <!-- Backdrop -->
      <div class="backdrop" :style="backdropStyle"></div>

      <div class="container">
        <button @click="$router.back()" class="back-btn">← Volver</button>

        <div class="detail-layout">
          <div class="detail-poster">
            <img v-if="movie.poster_path" :src="movie.poster_path" :alt="movie.title" />
            <div v-else class="poster-fallback">🎬</div>

            <button
              @click="store.toggleFavorite(movie)"
              class="fav-action-btn"
              :class="{ active: store.isFavorite(movie.id) }"
            >
              <span>{{ store.isFavorite(movie.id) ? '♥' : '♡' }}</span>
              {{ store.isFavorite(movie.id) ? 'En favoritos' : 'Agregar a favoritos' }}
            </button>
          </div>

          <div class="detail-info">
            <div class="detail-badges">
              <span class="badge-year">{{ movie.release_date?.slice(0,4) }}</span>
              <span class="badge-score">⭐ {{ movie.vote_average?.toFixed(1) }}</span>
              <span v-if="movie.runtime" class="badge-runtime">{{ formatRuntime(movie.runtime) }}</span>
            </div>

            <h1 class="detail-title">{{ movie.title }}</h1>

            <div v-if="movie.genres?.length" class="detail-genres">
              <span v-for="g in movie.genres" :key="g.id" class="genre-tag">{{ g.name }}</span>
            </div>

            <p v-if="movie.tagline" class="detail-tagline">"{{ movie.tagline }}"</p>
            <p class="detail-overview">{{ movie.overview }}</p>

            <div v-if="movie.credits?.cast?.length" class="detail-section">
              <h3 class="detail-section-title">Reparto principal</h3>
              <div class="cast-list">
                <div v-for="actor in movie.credits.cast.slice(0,6)" :key="actor.id" class="cast-item">
                  <div class="cast-avatar">
                    <img v-if="actor.profile_path" :src="`https://image.tmdb.org/t/p/w185${actor.profile_path}`" :alt="actor.name" />
                    <span v-else>👤</span>
                  </div>
                  <div>
                    <div class="cast-name">{{ actor.name }}</div>
                    <div class="cast-char">{{ actor.character }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="detail-loading">
      <p>Película no encontrada.</p>
      <router-link to="/" class="back-link">Volver al inicio</router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useMovieStore } from '../stores/movieStore'

const route = useRoute()
const store = useMovieStore()
const movie = ref(null)
const loading = ref(true)

const TMDB_KEY = import.meta.env.VITE_TMDB_API_KEY || ''

function buildImg(path, size = 'w500') {
  if (!path) return null
  if (path.startsWith('http')) return path  // ya tiene URL base, no doblar
  return `https://image.tmdb.org/t/p/${size}${path}`
}

onMounted(async () => {
  const id = route.params.id

  // Buscar en el store primero (ya tienen URLs completas)
  const found = store.movies.find(m => String(m.id) === String(id))
    || store.favorites.find(m => String(m.id) === String(id))

  if (found && !TMDB_KEY) {
    movie.value = found
    loading.value = false
    return
  }

  if (TMDB_KEY) {
    try {
      const res = await fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${TMDB_KEY}&language=es-ES&append_to_response=credits`)
      const data = await res.json()
      movie.value = {
        ...data,
        poster_path: buildImg(data.poster_path, 'w500'),
        backdrop_path: buildImg(data.backdrop_path, 'w1280'),
        credits: {
          ...data.credits,
          cast: (data.credits?.cast || []).map(a => ({
            ...a,
            profile_path: buildImg(a.profile_path, 'w185'),
          }))
        }
      }
    } catch {
      movie.value = found || null
    }
  } else {
    movie.value = found || null
  }
  loading.value = false
})

const backdropStyle = computed(() => {
  if (!movie.value?.backdrop_path) return {}
  return { backgroundImage: `url(${movie.value.backdrop_path})` }
})

function formatRuntime(mins) {
  const h = Math.floor(mins / 60)
  const m = mins % 60
  return h ? `${h}h ${m}m` : `${m}m`
}
</script>

<style scoped>
.detail-page { min-height: 80vh; padding-bottom: 80px; }

.detail-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  gap: 16px;
  color: var(--text2);
}

.spinner {
  width: 40px; height: 40px;
  border: 3px solid var(--border);
  border-top-color: var(--accent);
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

.detail-content { position: relative; }

.backdrop {
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 500px;
  background-size: cover;
  background-position: center top;
  mask-image: linear-gradient(to bottom, black 0%, transparent 100%);
  opacity: 0.15;
  pointer-events: none;
}

.container { max-width: 1200px; margin: 0 auto; padding: 32px 24px; position: relative; }

.back-btn {
  background: var(--surface);
  border: 1px solid var(--border);
  color: var(--text2);
  border-radius: 8px;
  padding: 8px 16px;
  font-size: 13px;
  margin-bottom: 32px;
  transition: all var(--transition);
}
.back-btn:hover { border-color: var(--accent); color: var(--accent); }

.detail-layout {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 48px;
  animation: fadeUp 0.4s ease;
}

.detail-poster img {
  width: 100%;
  border-radius: var(--radius);
  display: block;
  box-shadow: 0 30px 60px rgba(0,0,0,0.6);
}

.poster-fallback {
  width: 100%;
  aspect-ratio: 2/3;
  background: var(--surface2);
  border-radius: var(--radius);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 60px;
}

.fav-action-btn {
  width: 100%;
  margin-top: 12px;
  background: var(--surface);
  border: 1px solid var(--border);
  color: var(--text2);
  border-radius: 8px;
  padding: 12px;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all var(--transition);
}
.fav-action-btn:hover { border-color: var(--accent); color: var(--accent); }
.fav-action-btn.active { border-color: var(--danger); color: var(--danger); background: rgba(232,80,80,0.1); }

.detail-badges { display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 16px; }
.badge-year, .badge-score, .badge-runtime {
  background: var(--surface2);
  border: 1px solid var(--border);
  border-radius: 6px;
  padding: 4px 12px;
  font-size: 13px;
  color: var(--text2);
}

.detail-title {
  font-family: var(--font-display);
  font-size: clamp(32px, 5vw, 54px);
  line-height: 1;
  letter-spacing: 2px;
  color: var(--text);
  margin-bottom: 16px;
}

.detail-genres { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 20px; }
.genre-tag {
  background: var(--accent-glow);
  border: 1px solid rgba(232,168,56,0.3);
  color: var(--accent);
  border-radius: 6px;
  padding: 4px 12px;
  font-size: 12px;
  font-weight: 500;
}

.detail-tagline {
  font-size: 15px;
  color: var(--accent2);
  font-style: italic;
  margin-bottom: 16px;
}

.detail-overview {
  font-size: 15px;
  color: var(--text2);
  line-height: 1.8;
  max-width: 600px;
}

.detail-section { margin-top: 32px; }
.detail-section-title { font-size: 13px; font-weight: 500; color: var(--text3); text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 16px; }

.cast-list { display: flex; gap: 16px; flex-wrap: wrap; }
.cast-item { display: flex; align-items: center; gap: 10px; }
.cast-avatar {
  width: 44px; height: 44px;
  border-radius: 50%;
  overflow: hidden;
  background: var(--surface2);
  display: flex; align-items: center; justify-content: center;
  font-size: 20px;
  flex-shrink: 0;
}
.cast-avatar img { width: 100%; height: 100%; object-fit: cover; }
.cast-name { font-size: 13px; font-weight: 500; color: var(--text); }
.cast-char { font-size: 12px; color: var(--text3); }

.back-link {
  display: inline-block;
  margin-top: 16px;
  color: var(--accent);
  text-decoration: underline;
}

@media (max-width: 768px) {
  .detail-layout { grid-template-columns: 1fr; }
  .detail-poster { max-width: 240px; }
}
</style>
