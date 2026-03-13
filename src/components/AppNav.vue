<template>
  <nav class="nav">
    <div class="nav-inner">
      <router-link to="/" class="logo">
        <svg class="logo-icon" width="32" height="32" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
          <path d="M917.333333 832V512h-85.333333v320c0 106.666667 85.333333 192 192 192v-85.333333c-59.733333 0-106.666667-46.933333-106.666667-106.666667z" fill="#f0c060"/>
          <path d="M512 512m-405.333333 0a405.333333 405.333333 0 1 0 810.666666 0 405.333333 405.333333 0 1 0-810.666666 0Z" fill="#262626"/>
          <path d="M512 512m-42.666667 0a42.666667 42.666667 0 1 0 85.333334 0 42.666667 42.666667 0 1 0-85.333334 0Z" fill="#787878"/>
          <path d="M512 298.666667m-106.666667 0a106.666667 106.666667 0 1 0 213.333334 0 106.666667 106.666667 0 1 0-213.333334 0Z" fill="#e8a838"/>
          <path d="M512 725.333333m-106.666667 0a106.666667 106.666667 0 1 0 213.333334 0 106.666667 106.666667 0 1 0-213.333334 0Z" fill="#e8a838"/>
          <path d="M725.333333 512m-106.666666 0a106.666667 106.666667 0 1 0 213.333333 0 106.666667 106.666667 0 1 0-213.333333 0Z" fill="#e8a838"/>
          <path d="M298.666667 512m-106.666667 0a106.666667 106.666667 0 1 0 213.333333 0 106.666667 106.666667 0 1 0-213.333333 0Z" fill="#e8a838"/>
        </svg>
        <span class="logo-text">CineVault</span>
      </router-link>

      <div class="search-wrap">
        <span class="search-icon">⌕</span>
        <input
          v-model="localSearch"
          @input="handleSearch"
          class="search-input"
          placeholder="Buscar películas..."
          type="search"
          aria-label="Buscar películas"
        />
        <button v-if="localSearch" @click="clearSearch" class="clear-btn">✕</button>
      </div>

      <div class="nav-links">
        <router-link to="/" class="nav-link" :class="{ active: $route.path === '/' }">
          Explorar
        </router-link>
        <router-link to="/favorites" class="nav-link fav-link" :class="{ active: $route.path === '/favorites' }">
          <span class="fav-icon">♥</span>
          Favoritos
          <span v-if="store.favorites.length" class="badge">{{ store.favorites.length }}</span>
        </router-link>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref } from 'vue'
import { useMovieStore } from '../stores/movieStore'

const store = useMovieStore()
const localSearch = ref(store.searchQuery)
let searchTimeout = null

function handleSearch() {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    store.setSearch(localSearch.value)
  }, 400)
}

function clearSearch() {
  localSearch.value = ''
  store.setSearch('')
}
</script>

<style scoped>
.nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background: rgba(8, 12, 20, 0.92);
  backdrop-filter: blur(16px);
  border-bottom: 1px solid var(--border);
  height: 72px;
}

.nav-inner {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 24px;
  height: 100%;
  display: flex;
  align-items: center;
  gap: 24px;
}

.logo {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
  text-decoration: none;
}

.logo-icon { display: block; flex-shrink: 0; }

.logo-text {
  font-family: var(--font-display);
  font-size: 26px;
  color: var(--accent);
  letter-spacing: 1px;
}

.search-wrap {
  flex: 1;
  max-width: 480px;
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 14px;
  font-size: 20px;
  color: var(--text3);
  pointer-events: none;
}

.search-input {
  width: 100%;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 40px;
  padding: 10px 42px 10px 44px;
  color: var(--text);
  font-size: 14px;
  transition: border-color var(--transition), box-shadow var(--transition);
  outline: none;
  appearance: none;
}

.search-input::placeholder { color: var(--text3); }

.search-input:focus {
  border-color: var(--accent);
  box-shadow: 0 0 0 3px var(--accent-glow);
}

.search-input::-webkit-search-cancel-button { display: none; }

.clear-btn {
  position: absolute;
  right: 12px;
  background: none;
  border: none;
  color: var(--text3);
  font-size: 13px;
  padding: 4px;
  line-height: 1;
  transition: color var(--transition);
}
.clear-btn:hover { color: var(--text); }

.nav-links {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
  margin-left: auto;
}

.nav-link {
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  color: var(--text2);
  transition: all var(--transition);
  position: relative;
}

.nav-link:hover { color: var(--text); background: var(--surface); }
.nav-link.active { color: var(--accent); }

.fav-link { display: flex; align-items: center; gap: 6px; }
.fav-icon { font-size: 13px; }

.badge {
  background: var(--accent);
  color: #000;
  font-size: 11px;
  font-weight: 700;
  padding: 1px 7px;
  border-radius: 20px;
  line-height: 1.5;
}

@media (max-width: 640px) {
  .nav-inner { gap: 12px; padding: 0 16px; }
  .logo-text { display: none; }
  .search-wrap { max-width: unset; }
}
</style>
