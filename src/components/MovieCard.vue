<template>
  <div class="card">
    <img :src="imageUrl" :alt="title" />

    <div class="info">
      <h3>{{ title }}</h3>
      <p>⭐ {{ rating }}</p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
const props = defineProps({
  title: String,
  poster: String,
  rating: Number
})

const imageUrl = computed(() =>
  props.poster
    ? `https://image.tmdb.org/t/p/w500${props.poster}`
    : "https://via.placeholder.com/500x750"
)
</script>

<style scoped>
.card {
  background: #1f1f1f;
  border-radius: 10px;
  overflow: hidden;
  transition: transform 0.3s ease;
  cursor: pointer;
}

.card:hover {
  transform: scale(1.05);
}

img {
  width: 100%;
  display: block;
}

.info {
  padding: 10px;
  color: white;
}

.info h3 {
  font-size: 14px;
  margin: 0 0 5px 0;
}
</style>