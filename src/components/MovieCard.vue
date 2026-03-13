<template>
  <article class="movie-card" @click="$router.push(`/movie/${movie.id}`)">
    <div class="card-poster">
      <img
        v-if="movie.poster_path"
        :src="movie.poster_path"
        :alt="movie.title"
        class="poster-img"
        loading="lazy"
        @error="imgError = true"
      />
      <div v-else class="poster-placeholder">
        <span class="placeholder-icon">🎬</span>
        <span class="placeholder-title">{{ movie.title }}</span>
      </div>

      <div class="card-overlay">
        <button
          class="fav-btn"
          :class="{ active: store.isFavorite(movie.id) }"
          @click.stop="store.toggleFavorite(movie)"
          :aria-label="store.isFavorite(movie.id) ? 'Quitar de favoritos' : 'Agregar a favoritos'"
        >
          {{ store.isFavorite(movie.id) ? '♥' : '♡' }}
        </button>

        <div class="score-badge" :class="scoreClass">
          <span class="score-num">{{ movie.vote_average?.toFixed(1) }}</span>
        </div>
      </div>
    </div>

    <div class="card-info">
      <h3 class="card-title">{{ movie.title }}</h3>
      <div class="card-meta">
        <span class="card-year">{{ movie.release_date?.slice(0, 4) || '—' }}</span>
        <span class="card-genres">{{ genreNames }}</span>
      </div>
    </div>
  </article>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useMovieStore } from '../stores/movieStore'

const props = defineProps({ movie: { type: Object, required: true } })
const store = useMovieStore()
const imgError = ref(false)

const genreNames = computed(() => {
  if (!props.movie.genre_ids?.length) return ''
  return props.movie.genre_ids
    .slice(0, 2)
    .map(id => store.genres.find(g => g.id === id)?.name)
    .filter(Boolean)
    .join(' · ')
})

const scoreClass = computed(() => {
  const v = props.movie.vote_average
  if (v >= 8) return 'score-great'
  if (v >= 6.5) return 'score-good'
  if (v >= 5) return 'score-avg'
  return 'score-low'
})
</script>

<style scoped>
.movie-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  overflow: hidden;
  cursor: pointer;
  transition: transform var(--transition), box-shadow var(--transition), border-color var(--transition);
  animation: fadeUp 0.4s ease both;
}

.movie-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 20px 40px rgba(0,0,0,0.4), 0 0 0 1px var(--accent);
  border-color: var(--accent);
}

.card-poster {
  position: relative;
  aspect-ratio: 2/3;
  overflow: hidden;
  background: var(--bg3);
}

.poster-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}

.movie-card:hover .poster-img { transform: scale(1.04); }

.poster-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 20px;
  background: linear-gradient(135deg, var(--bg3), var(--surface2));
}

.placeholder-icon { font-size: 40px; opacity: 0.4; }
.placeholder-title {
  font-family: var(--font-display);
  font-size: 18px;
  text-align: center;
  color: var(--text2);
  letter-spacing: 1px;
  line-height: 1.2;
}

.card-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 50%);
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 10px;
  opacity: 0;
  transition: opacity var(--transition);
}

.movie-card:hover .card-overlay { opacity: 1; }

.fav-btn {
  background: rgba(0,0,0,0.6);
  border: 1px solid rgba(255,255,255,0.15);
  color: var(--text2);
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  transition: all var(--transition);
  backdrop-filter: blur(4px);
}

.fav-btn.active { color: var(--danger); border-color: var(--danger); background: rgba(232,80,80,0.2); }
.fav-btn:hover:not(.active) { color: var(--accent); border-color: var(--accent); }

.score-badge {
  padding: 4px 9px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 700;
  backdrop-filter: blur(4px);
}
.score-great { background: rgba(76, 175, 125, 0.85); color: #fff; }
.score-good { background: rgba(232, 168, 56, 0.85); color: #000; }
.score-avg { background: rgba(180, 130, 40, 0.85); color: #000; }
.score-low { background: rgba(180, 60, 60, 0.85); color: #fff; }

.card-info {
  padding: 12px 14px 14px;
}

.card-title {
  font-size: 14px;
  font-weight: 500;
  color: var(--text);
  line-height: 1.3;
  margin-bottom: 6px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.card-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: var(--text3);
}

.card-year { flex-shrink: 0; }
.card-genres {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
