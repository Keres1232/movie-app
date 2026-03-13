<template>
  <div class="home">
    <section class="hero">
      <div class="hero-bg"></div>
      <div class="hero-content">
        <p class="hero-eyebrow">Tu cinemateca personal</p>
        <h1 class="hero-title">CINEVAULT</h1>
        <p class="hero-subtitle">Descubre, filtra y guarda las películas que marcan tu vida.</p>
      </div>
    </section>

    <div class="container">
      <div class="section-header">
        <h2 class="section-title">
          <span v-if="store.searchQuery">
            Resultados para <em>"{{ store.searchQuery }}"</em>
          </span>
          <span v-else>Explorar películas</span>
        </h2>
        <span v-if="!store.loading" class="result-count">
          {{ store.movies.length }} películas
        </span>
      </div>

      <FilterBar />
      <MovieGrid />
    </div>
  </div>
</template>

<script setup>
import FilterBar from '../components/FilterBar.vue'
import MovieGrid from '../components/MovieGrid.vue'
import { useMovieStore } from '../stores/movieStore'

const store = useMovieStore()
</script>

<style scoped>
.home { padding-bottom: 60px; }

.hero {
  position: relative;
  overflow: hidden;
  padding: 80px 24px 60px;
  text-align: center;
}

.hero-bg {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse 80% 50% at 50% 0%, rgba(232,168,56,0.08) 0%, transparent 60%),
    radial-gradient(ellipse 50% 60% at 80% 50%, rgba(100, 80, 200, 0.06) 0%, transparent 60%);
}

.hero-content { position: relative; z-index: 1; }

.hero-eyebrow {
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--accent);
  margin-bottom: 12px;
}

.hero-title {
  font-family: var(--font-display);
  font-size: clamp(56px, 10vw, 110px);
  color: var(--text);
  line-height: 0.9;
  letter-spacing: 4px;
  margin-bottom: 20px;
  background: linear-gradient(135deg, var(--text) 60%, var(--accent));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-subtitle {
  font-size: 16px;
  color: var(--text2);
  max-width: 400px;
  margin: 0 auto;
  font-weight: 300;
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 24px;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 4px;
  flex-wrap: wrap;
  gap: 8px;
}

.section-title {
  font-size: 20px;
  font-weight: 500;
  color: var(--text);
}

.section-title em {
  color: var(--accent);
  font-style: normal;
}

.result-count {
  font-size: 13px;
  color: var(--text3);
  background: var(--surface);
  padding: 4px 12px;
  border-radius: 20px;
  border: 1px solid var(--border);
}
</style>
