<template>
  <div class="container">
    <h1>Series Populares</h1>

    <div class="grid">
      <MovieCard
        v-for="serie in series"
        :key="serie.id"
        :title="serie.name"
        :poster="serie.poster_path"
        :rating="serie.vote_average"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { getPopularSeries } from "../services/api";
import MovieCard from "../components/MovieCard.vue";

const series = ref([]);

onMounted(async () => {
  series.value = await getPopularSeries();
});
</script>

<style scoped>
.container {
  padding: 120px 20px 40px 20px;
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