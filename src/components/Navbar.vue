<template>
  <nav class="navbar">
    <div class="container">
      
      <div class="logo">
        <span>App</span>
        <strong>movie</strong>
      </div>

      <div class="links">
        <RouterLink to="/">Films</RouterLink>
        <RouterLink to="/series">Series</RouterLink>
        <a href="#">Members</a>
        <a href="#">Journal</a>
      </div>

      <div class="search">
        <input type="text" placeholder="Find a film..." />
      </div>

    </div>
  </nav>
</template>

<style scoped>
.navbar {
  position: fixed;
  top: 0;
  width: 100%;
  height: 80px;
  background-color: #0f172a;
  display: flex;
  align-items: center;
  z-index: 1000;
}

.container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  gap: 20px;
}

.logo {
  color: white;
  font-size: 18px;
}

.logo strong {
  color: #2ee3a7;
}

.links {
  display: flex;
  gap: 20px;
}

.links a {
  color: #ccc;
  font-size: 14px;
}

.links a:hover {
  color: white;
}

.search {
  flex: 1;
  display: flex;
  justify-content: flex-end;
}

.search input {
  width: 100%;
  max-width: 250px;
  padding: 8px 12px;
  border-radius: 6px;
  border: none;
  background-color: #2a2a2a;
  color: white;
}

/* TABLET */
@media (max-width: 1024px) {
  .links {
    display: none;
  }

  .search input {
    max-width: 180px;
  }
}

/* MOBILE */
@media (max-width: 600px) {
  .search input {
    max-width: 120px;
  }
}
</style>