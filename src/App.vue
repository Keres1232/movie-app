<script setup>
import Navbar from './components/Navbar.vue'
</script>

<template>
  <div id="app">
    <Navbar />
    
    <main class="main-content">
      <router-view />
    </main>
  </div>
</template>

<style>
/* Reset básico */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  background-color: #141414;
  font-family: Arial, Helvetica, sans-serif;
}

/* Contenedor principal */
#app {
  min-height: 100vh;
}

/* Espacio para que el navbar fijo no tape contenido */
.main-content {
  padding-top: 80px;
}
</style>