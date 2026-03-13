<template>
  <div class="filter-bar">
    <div class="filter-group">
      <label class="filter-label">Género</label>
      <select v-model="localGenre" @change="store.setGenre(localGenre)" class="filter-select">
        <option value="">Todos</option>
        <option v-for="g in store.genres" :key="g.id" :value="String(g.id)">{{ g.name }}</option>
      </select>
    </div>

    <div class="filter-group">
      <label class="filter-label">Año</label>
      <select v-model="localYear" @change="store.setYear(localYear)" class="filter-select">
        <option value="">Todos</option>
        <option v-for="y in years" :key="y" :value="String(y)">{{ y }}</option>
      </select>
    </div>

    <div class="filter-group">
      <label class="filter-label">Ordenar por</label>
      <select v-model="localSort" @change="store.setSort(localSort)" class="filter-select">
        <option value="popularity.desc">Popularidad ↓</option>
        <option value="popularity.asc">Popularidad ↑</option>
        <option value="vote_average.desc">Calificación ↓</option>
        <option value="vote_average.asc">Calificación ↑</option>
        <option value="release_date.desc">Más recientes</option>
        <option value="release_date.asc">Más antiguas</option>
        <option value="title.asc">Título A-Z</option>
        <option value="title.desc">Título Z-A</option>
      </select>
    </div>

    <button
      v-if="hasFilters"
      @click="clearFilters"
      class="clear-filters-btn"
      title="Limpiar filtros"
    >
      ✕ Limpiar
    </button>

    <button
      @click="savePrefs"
      class="save-prefs-btn"
      :class="{ saved }"
      title="Guardar preferencias actuales"
    >
      {{ saved ? '✓ Guardado' : '⚙ Guardar preferencias' }}
    </button>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useMovieStore } from '../stores/movieStore'

const store = useMovieStore()

const localGenre = ref(store.selectedGenre)
const localYear = ref(store.selectedYear)
const localSort = ref(store.sortBy)
const saved = ref(false)

const years = computed(() => {
  const currentYear = new Date().getFullYear()
  return Array.from({ length: 40 }, (_, i) => currentYear - i)
})

const hasFilters = computed(() =>
  localGenre.value || localYear.value || localSort.value !== 'popularity.desc'
)

function clearFilters() {
  localGenre.value = ''
  localYear.value = ''
  localSort.value = 'popularity.desc'
  store.setGenre('')
  store.setYear('')
  store.setSort('popularity.desc')
}

function savePrefs() {
  store.savePreferences()
  saved.value = true
  setTimeout(() => { saved.value = false }, 2000)
}
</script>

<style scoped>
.filter-bar {
  display: flex;
  align-items: flex-end;
  gap: 12px;
  flex-wrap: wrap;
  padding: 16px 0;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.filter-label {
  font-size: 11px;
  font-weight: 500;
  color: var(--text3);
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.filter-select {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  padding: 9px 32px 9px 12px;
  color: var(--text);
  font-size: 13px;
  cursor: pointer;
  outline: none;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' fill='none'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23556070' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 10px center;
  transition: border-color var(--transition);
  min-width: 140px;
}

.filter-select:focus { border-color: var(--accent); }

.clear-filters-btn {
  background: rgba(232, 80, 80, 0.12);
  border: 1px solid rgba(232, 80, 80, 0.25);
  color: var(--danger);
  border-radius: var(--radius-sm);
  padding: 9px 14px;
  font-size: 13px;
  transition: all var(--transition);
  align-self: flex-end;
}
.clear-filters-btn:hover { background: rgba(232, 80, 80, 0.22); }

.save-prefs-btn {
  background: var(--surface);
  border: 1px solid var(--border);
  color: var(--text2);
  border-radius: var(--radius-sm);
  padding: 9px 14px;
  font-size: 13px;
  transition: all var(--transition);
  align-self: flex-end;
  margin-left: auto;
}
.save-prefs-btn:hover { border-color: var(--accent); color: var(--accent); }
.save-prefs-btn.saved { border-color: var(--success); color: var(--success); }

@media (max-width: 640px) {
  .filter-bar { gap: 8px; }
  .filter-select { min-width: 120px; }
  .save-prefs-btn { margin-left: 0; }
}
</style>
