<template>
  <div class="app-shell">
    <AppNav />
    <main class="main-content">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
  </div>
</template>

<script setup>
import AppNav from './components/AppNav.vue'
import { useMovieStore } from './stores/movieStore'
import { onMounted } from 'vue'

const store = useMovieStore()
onMounted(() => {
  store.fetchGenres()
  store.fetchMovies()
})
</script>

<style scoped>
.app-shell {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
.main-content {
  flex: 1;
  padding-top: 72px;
}
</style>
