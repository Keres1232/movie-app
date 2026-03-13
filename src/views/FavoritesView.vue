<template>
  <div class="favorites-page">
    <div class="container">
      <div class="page-header">
        <div>
          <h1 class="page-title">♥ Mis Favoritos</h1>
          <p class="page-subtitle">{{ store.favorites.length }} película{{ store.favorites.length !== 1 ? 's' : '' }} guardada{{ store.favorites.length !== 1 ? 's' : '' }}</p>
        </div>
        <button v-if="store.favorites.length" @click="confirmClear = true" class="clear-all-btn">
          Limpiar todo
        </button>
      </div>

      <!-- Confirm modal -->
      <div v-if="confirmClear" class="modal-overlay" @click.self="confirmClear = false">
        <div class="modal">
          <h3>¿Eliminar todos los favoritos?</h3>
          <p>Esta acción no se puede deshacer.</p>
          <div class="modal-actions">
            <button @click="confirmClear = false" class="modal-btn cancel">Cancelar</button>
            <button @click="clearAll" class="modal-btn danger">Sí, eliminar</button>
          </div>
        </div>
      </div>

      <!-- Empty -->
      <div v-if="!store.favorites.length" class="empty-state">
        <div class="empty-icon">♡</div>
        <h2>Aún no tienes favoritos</h2>
        <p>Explora películas y presiona el corazón para guardarlas aquí.</p>
        <router-link to="/" class="explore-btn">Explorar películas</router-link>
      </div>

      <!-- Grid -->
      <div v-else class="fav-grid">
        <article
          v-for="(movie, i) in store.favorites"
          :key="movie.id"
          class="fav-card"
          :style="{ animationDelay: `${i * 50}ms` }"
          @click="$router.push(`/movie/${movie.id}`)"
        >
          <div class="fav-poster">
            <img v-if="movie.poster_path" :src="movie.poster_path" :alt="movie.title" class="fav-img" />
            <div v-else class="fav-placeholder">🎬</div>
          </div>
          <div class="fav-info">
            <h3 class="fav-title">{{ movie.title }}</h3>
            <div class="fav-meta">
              <span class="fav-year">{{ movie.release_date?.slice(0,4) }}</span>
              <span class="fav-score">⭐ {{ movie.vote_average?.toFixed(1) }}</span>
            </div>
            <p class="fav-overview">{{ movie.overview }}</p>
            <button
              @click.stop="store.toggleFavorite(movie)"
              class="remove-fav-btn"
            >Quitar de favoritos</button>
          </div>
        </article>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useMovieStore } from '../stores/movieStore'

const store = useMovieStore()
const confirmClear = ref(false)

function clearAll() {
  store.favorites.splice(0)
  confirmClear.value = false
}
</script>

<style scoped>
.favorites-page { padding: 40px 0 80px; }

.container { max-width: 1000px; margin: 0 auto; padding: 0 24px; }

.page-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 32px;
  gap: 16px;
}

.page-title {
  font-family: var(--font-display);
  font-size: 40px;
  letter-spacing: 2px;
  color: var(--accent);
  margin-bottom: 4px;
}

.page-subtitle { font-size: 14px; color: var(--text3); }

.clear-all-btn {
  background: rgba(232,80,80,0.1);
  border: 1px solid rgba(232,80,80,0.25);
  color: var(--danger);
  border-radius: 8px;
  padding: 8px 16px;
  font-size: 13px;
  transition: all var(--transition);
  flex-shrink: 0;
}
.clear-all-btn:hover { background: rgba(232,80,80,0.2); }

/* Empty */
.empty-state {
  text-align: center;
  padding: 100px 24px;
}
.empty-icon {
  font-size: 80px;
  color: var(--text3);
  line-height: 1;
  margin-bottom: 24px;
}
.empty-state h2 {
  font-family: var(--font-display);
  font-size: 28px;
  letter-spacing: 1px;
  margin-bottom: 8px;
}
.empty-state p { color: var(--text2); margin-bottom: 24px; }
.explore-btn {
  display: inline-block;
  background: var(--accent);
  color: #000;
  border-radius: 8px;
  padding: 12px 24px;
  font-size: 14px;
  font-weight: 600;
  transition: opacity var(--transition);
}
.explore-btn:hover { opacity: 0.85; }

/* Grid */
.fav-grid { display: flex; flex-direction: column; gap: 16px; }

.fav-card {
  display: flex;
  gap: 20px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  overflow: hidden;
  cursor: pointer;
  transition: border-color var(--transition), transform var(--transition);
  animation: fadeUp 0.4s ease both;
}
.fav-card:hover { border-color: var(--accent); transform: translateX(4px); }

.fav-poster { width: 90px; flex-shrink: 0; background: var(--bg3); }
.fav-img { width: 100%; height: 100%; object-fit: cover; display: block; }
.fav-placeholder { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; font-size: 28px; min-height: 120px; }

.fav-info { flex: 1; padding: 16px 16px 16px 0; display: flex; flex-direction: column; gap: 6px; min-width: 0; }

.fav-title { font-size: 16px; font-weight: 600; color: var(--text); }
.fav-meta { display: flex; gap: 12px; font-size: 13px; color: var(--text3); }
.fav-overview {
  font-size: 13px;
  color: var(--text2);
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  flex: 1;
}

.remove-fav-btn {
  background: none;
  border: 1px solid var(--border);
  color: var(--text3);
  border-radius: 6px;
  padding: 6px 12px;
  font-size: 12px;
  transition: all var(--transition);
  align-self: flex-start;
}
.remove-fav-btn:hover { border-color: var(--danger); color: var(--danger); }

/* Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.7);
  backdrop-filter: blur(4px);
  z-index: 200;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: fadeIn 0.2s ease;
}
.modal {
  background: var(--surface2);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 32px;
  max-width: 400px;
  width: 90%;
  text-align: center;
}
.modal h3 { font-size: 18px; margin-bottom: 8px; }
.modal p { color: var(--text2); font-size: 14px; margin-bottom: 24px; }
.modal-actions { display: flex; gap: 12px; justify-content: center; }
.modal-btn {
  padding: 10px 24px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  border: none;
  transition: opacity var(--transition);
}
.modal-btn.cancel { background: var(--surface); color: var(--text2); border: 1px solid var(--border); }
.modal-btn.danger { background: var(--danger); color: #fff; }
.modal-btn:hover { opacity: 0.85; }
</style>
