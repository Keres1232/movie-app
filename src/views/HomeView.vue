<template>
  <div class="container">
    <h1>Películas Populares</h1>

    <div class="grid">
      <MovieCard
        v-for="movie in movies"
        :key="movie.id"
        :title="movie.title"
        :poster="movie.poster_path"
        :rating="movie.vote_average"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { getPopularMovies } from "../services/api";
import MovieCard from "../components/MovieCard.vue";

const movies = ref([]);

onMounted(async () => {
  movies.value = await getPopularMovies();
});
</script>

<style scoped>
.container {
  padding: 120px 20px 40px 20px; /* espacio por navbar */
  max-width: 1200px;
  margin: 0 auto;
  color: white;
}

.grid {
  display: grid;
  gap: 20px;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
}
</style>