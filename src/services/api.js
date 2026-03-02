const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = import.meta.env.VITE_TMDB_BASE_URL;

export async function getPopularMovies() {
  const response = await fetch(
    `${BASE_URL}/movie/popular?api_key=${API_KEY}&language=es-ES`
  );
  const data = await response.json();
  return data.results;
}

export async function getPopularSeries() {
  const response = await fetch(
    `${BASE_URL}/tv/popular?api_key=${API_KEY}&language=es-ES`
  );
  const data = await response.json();
  return data.results;
}