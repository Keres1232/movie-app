<template>
  <div class="movie-grid-wrap">
    <!-- Loading skeleton -->
    <div v-if="store.loading" class="movie-grid">
      <div v-for="n in 12" :key="n" class="skeleton-card">
        <div class="skeleton-poster shimmer"></div>
        <div class="skeleton-body">
          <div class="skeleton-line shimmer" style="width: 80%"></div>
          <div class="skeleton-line shimmer" style="width: 50%"></div>
        </div>
      </div>
    </div>

    <!-- Error state -->
    <div v-else-if="store.error && !store.movies.length" class="state-panel error-panel">
      <div class="state-icon">⚠️</div>
      <h2 class="state-title">Algo salió mal</h2>
      <p class="state-desc">{{ store.error }}</p>
      <button @click="store.fetchMovies()" class="retry-btn">Reintentar</button>
    </div>

    <!-- Empty state -->
    <div v-else-if="!store.movies.length" class="state-panel empty-panel">
      <div class="state-icon">🔍</div>
      <h2 class="state-title">Sin resultados</h2>
      <p class="state-desc">
        No encontramos películas para
        <strong>{{ store.searchQuery ? `"${store.searchQuery}"` : 'estos filtros' }}</strong>.
      </p>
      <button @click="resetAll" class="retry-btn">Ver todas las películas</button>
    </div>

    <!-- Movie grid -->
    <div v-else class="movie-grid">
      <MovieCard
        v-for="(movie, i) in store.sortedMovies"
        :key="movie.id"
        :movie="movie"
        :style="{ animationDelay: `${Math.min(i * 40, 400)}ms` }"
      />
    </div>

    <!-- Pagination -->
    <div v-if="!store.loading && store.movies.length && store.totalPages > 1" class="pagination">
      <button
        @click="store.fetchMovies(store.currentPage - 1)"
        :disabled="store.currentPage <= 1"
        class="page-btn"
      >← Anterior</button>

      <div class="page-nums">
        <button
          v-for="p in visiblePages"
          :key="p"
          @click="store.fetchMovies(p)"
          class="page-btn page-num"
          :class="{ active: p === store.currentPage }"
        >{{ p }}</button>
      </div>

      <button
        @click="store.fetchMovies(store.currentPage + 1)"
        :disabled="store.currentPage >= store.totalPages"
        class="page-btn"
      >Siguiente →</button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import MovieCard from './MovieCard.vue'
import { useMovieStore } from '../stores/movieStore'

const store = useMovieStore()

const visiblePages = computed(() => {
  const current = store.currentPage
  const total = store.totalPages
  const pages = []
  const range = 2
  for (let i = Math.max(1, current - range); i <= Math.min(total, current + range); i++) {
    pages.push(i)
  }
  return pages
})

function resetAll() {
  store.setSearch('')
  store.setGenre('')
  store.setYear('')
  store.setSort('popularity.desc')
}
</script>

<style scoped>
.movie-grid-wrap { width: 100%; }

.movie-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 20px;
}

/* Skeleton */
.skeleton-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  overflow: hidden;
}
.skeleton-poster {
  aspect-ratio: 2/3;
  width: 100%;
}
.skeleton-body { padding: 12px 14px 14px; display: flex; flex-direction: column; gap: 8px; }
.skeleton-line { height: 12px; border-radius: 4px; }

.shimmer {
  background: linear-gradient(90deg, var(--surface2) 25%, var(--surface) 50%, var(--surface2) 75%);
  background-size: 200% 100%;
  animation: shimmer 1.4s infinite;
}

/* State panels */
.state-panel {
  text-align: center;
  padding: 80px 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  animation: fadeIn 0.3s ease;
}
.state-icon { font-size: 56px; }
.state-title { font-family: var(--font-display); font-size: 28px; letter-spacing: 1px; }
.state-desc { color: var(--text2); max-width: 380px; line-height: 1.6; }
.retry-btn {
  margin-top: 8px;
  background: var(--accent);
  color: #000;
  border: none;
  border-radius: 8px;
  padding: 12px 24px;
  font-size: 14px;
  font-weight: 600;
  transition: opacity var(--transition);
}
.retry-btn:hover { opacity: 0.85; }

/* Pagination */
.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 40px 0 20px;
  flex-wrap: wrap;
}

.page-btn {
  background: var(--surface);
  border: 1px solid var(--border);
  color: var(--text2);
  border-radius: 8px;
  padding: 8px 14px;
  font-size: 13px;
  transition: all var(--transition);
}
.page-btn:hover:not(:disabled) { border-color: var(--accent); color: var(--accent); }
.page-btn:disabled { opacity: 0.3; cursor: not-allowed; }
.page-btn.active { background: var(--accent); border-color: var(--accent); color: #000; font-weight: 700; }

.page-nums { display: flex; gap: 6px; }

@media (max-width: 640px) {
  .movie-grid { grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 12px; }
}
</style>
