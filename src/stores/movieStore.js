import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'

const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY || ''
const BASE_URL = 'https://api.themoviedb.org/3'
const IMG_BASE = 'https://image.tmdb.org/t/p/w500'
const IMG_ORIGINAL = 'https://image.tmdb.org/t/p/original'

function buildImgUrl(path, size = IMG_BASE) {
  if (!path) return null
  if (path.startsWith('http')) return path   // ya es URL completa, no tocar
  return size + path                          // path siempre empieza con "/"
}

export const useMovieStore = defineStore('movies', () => {
  // State
  const movies = ref([])
  const loading = ref(false)
  const error = ref(null)
  const searchQuery = ref('')
  const selectedGenre = ref('')
  const selectedYear = ref('')
  const sortBy = ref('popularity.desc')
  const sortDirection = ref('desc')
  const currentPage = ref(1)
  const totalPages = ref(1)
  const genres = ref([])

  // Favorites - persisted in localStorage
  const favorites = ref(JSON.parse(localStorage.getItem('movie-favorites') || '[]'))

  // User preferences - persisted in localStorage
  const preferences = ref(JSON.parse(localStorage.getItem('movie-preferences') || JSON.stringify({
    theme: 'dark',
    defaultSort: 'popularity.desc',
    defaultGenre: ''
  })))

  // Persist favorites
  watch(favorites, (val) => {
    localStorage.setItem('movie-favorites', JSON.stringify(val))
  }, { deep: true })

  // Persist preferences
  watch(preferences, (val) => {
    localStorage.setItem('movie-preferences', JSON.stringify(val))
  }, { deep: true })

  // Apply saved preferences
  sortBy.value = preferences.value.defaultSort
  selectedGenre.value = preferences.value.defaultGenre

  // Computed
  const isFavorite = computed(() => (id) => favorites.value.some(f => f.id === id))

  const sortedMovies = computed(() => {
    const list = [...movies.value]
    const [field, dir] = sortBy.value.split('.')
    list.sort((a, b) => {
      let aVal, bVal
      if (field === 'title') { aVal = a.title; bVal = b.title }
      else if (field === 'release_date') { aVal = a.release_date; bVal = b.release_date }
      else if (field === 'vote_average') { aVal = a.vote_average; bVal = b.vote_average }
      else { aVal = a.popularity; bVal = b.popularity }
      if (typeof aVal === 'string') {
        return dir === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal)
      }
      return dir === 'asc' ? aVal - bVal : bVal - aVal
    })
    return list
  })

  // Actions
  async function fetchGenres() {
    try {
      const url = TMDB_API_KEY
        ? `${BASE_URL}/genre/movie/list?api_key=${TMDB_API_KEY}&language=es-ES`
        : null
      if (!url) { genres.value = getMockGenres(); return }
      const res = await fetch(url)
      const data = await res.json()
      genres.value = data.genres
    } catch {
      genres.value = getMockGenres()
    }
  }

  async function fetchMovies(page = 1) {
    loading.value = true
    error.value = null
    currentPage.value = page

    try {
      let url
      if (searchQuery.value.trim()) {
        url = TMDB_API_KEY
          ? `${BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&language=es-ES&query=${encodeURIComponent(searchQuery.value)}&page=${page}`
          : null
      } else {
        const params = new URLSearchParams({
          language: 'es-ES',
          sort_by: sortBy.value,
          page,
          ...(selectedGenre.value && { with_genres: selectedGenre.value }),
          ...(selectedYear.value && { primary_release_year: selectedYear.value }),
        })
        url = TMDB_API_KEY
          ? `${BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&${params}`
          : null
      }

      if (!url) {
        // Use mock data
        await new Promise(r => setTimeout(r, 600))
        const mock = getMockMovies()
        movies.value = mock
        totalPages.value = 3
        return
      }

      const res = await fetch(url)
      if (!res.ok) throw new Error('Error al obtener películas')
      const data = await res.json()
      movies.value = data.results.map(m => ({
        ...m,
        poster_path: buildImgUrl(m.poster_path),
        backdrop_path: buildImgUrl(m.backdrop_path, IMG_ORIGINAL),
      }))
      totalPages.value = Math.min(data.total_pages, 20)
    } catch (e) {
      error.value = e.message || 'Error desconocido'
      movies.value = getMockMovies()
    } finally {
      loading.value = false
    }
  }

  function toggleFavorite(movie) {
    const idx = favorites.value.findIndex(f => f.id === movie.id)
    if (idx >= 0) favorites.value.splice(idx, 1)
    else favorites.value.push(movie)
  }

  function setSort(val) {
    sortBy.value = val
    currentPage.value = 1
    fetchMovies(1)
  }

  function setGenre(val) {
    selectedGenre.value = val
    currentPage.value = 1
    fetchMovies(1)
  }

  function setYear(val) {
    selectedYear.value = val
    currentPage.value = 1
    fetchMovies(1)
  }

  function setSearch(val) {
    searchQuery.value = val
    currentPage.value = 1
    fetchMovies(1)
  }

  function savePreferences() {
    preferences.value.defaultSort = sortBy.value
    preferences.value.defaultGenre = selectedGenre.value
  }

  function getMockGenres() {
    return [
      { id: 28, name: 'Acción' }, { id: 12, name: 'Aventura' },
      { id: 16, name: 'Animación' }, { id: 35, name: 'Comedia' },
      { id: 80, name: 'Crimen' }, { id: 99, name: 'Documental' },
      { id: 18, name: 'Drama' }, { id: 10751, name: 'Familia' },
      { id: 14, name: 'Fantasía' }, { id: 36, name: 'Historia' },
      { id: 27, name: 'Terror' }, { id: 10402, name: 'Música' },
      { id: 9648, name: 'Misterio' }, { id: 10749, name: 'Romance' },
      { id: 878, name: 'Ciencia ficción' }, { id: 53, name: 'Thriller' },
      { id: 10752, name: 'Bélica' },
    ]
  }

  function getMockMovies() {
    return [
      { id: 1, title: 'Inception', vote_average: 8.8, popularity: 95, release_date: '2010-07-16', genre_ids: [878, 28, 53], overview: 'Un ladrón que roba secretos corporativos a través del uso de la tecnología de compartir sueños.', poster_path: null },
      { id: 2, title: 'Interstellar', vote_average: 8.6, popularity: 90, release_date: '2014-11-07', genre_ids: [878, 12, 18], overview: 'Un equipo de exploradores viaja a través de un agujero de gusano en el espacio.', poster_path: null },
      { id: 3, title: 'The Dark Knight', vote_average: 9.0, popularity: 98, release_date: '2008-07-18', genre_ids: [28, 80, 18], overview: 'Batman se enfrenta al Joker, un criminal que siembra el caos en Gotham.', poster_path: null },
      { id: 4, title: 'Pulp Fiction', vote_average: 8.9, popularity: 88, release_date: '1994-09-10', genre_ids: [80, 18, 53], overview: 'Las vidas de dos sicarios, un boxeador y una esposa se entrelazan en Los Ángeles.', poster_path: null },
      { id: 5, title: 'The Matrix', vote_average: 8.7, popularity: 92, release_date: '1999-03-31', genre_ids: [878, 28], overview: 'Un hacker descubre que la realidad es una simulación controlada por máquinas.', poster_path: null },
      { id: 6, title: 'Avengers: Endgame', vote_average: 8.4, popularity: 99, release_date: '2019-04-26', genre_ids: [28, 878, 12], overview: 'Los Vengadores se unen para revertir los efectos del chasquido de Thanos.', poster_path: null },
      { id: 7, title: 'Parasite', vote_average: 8.5, popularity: 85, release_date: '2019-05-30', genre_ids: [53, 18, 80], overview: 'Una familia pobre infiltra sus miembros en la casa de una familia adinerada.', poster_path: null },
      { id: 8, title: 'Spirited Away', vote_average: 8.6, popularity: 82, release_date: '2001-07-20', genre_ids: [16, 12, 14], overview: 'Una niña queda atrapada en un mundo de espíritus y dioses japoneses.', poster_path: null },
      { id: 9, title: 'Dune: Part Two', vote_average: 8.2, popularity: 94, release_date: '2024-03-01', genre_ids: [878, 12, 18], overview: 'Paul Atreides se une a los Fremen para librar una guerra santa.', poster_path: null },
      { id: 10, title: 'Oppenheimer', vote_average: 8.3, popularity: 91, release_date: '2023-07-21', genre_ids: [18, 36, 10752], overview: 'La historia del físico que lideró el Proyecto Manhattan.', poster_path: null },
      { id: 11, title: 'Poor Things', vote_average: 7.8, popularity: 78, release_date: '2023-12-08', genre_ids: [35, 14, 18], overview: 'La increíble historia de Bella Baxter, una joven devuelta a la vida.', poster_path: null },
      { id: 12, title: 'Past Lives', vote_average: 7.9, popularity: 72, release_date: '2023-06-02', genre_ids: [18, 10749], overview: 'Dos amigos de infancia se reencuentran décadas después en Nueva York.', poster_path: null },
    ]
  }

  return {
    movies, loading, error, searchQuery, selectedGenre, selectedYear,
    sortBy, currentPage, totalPages, genres, favorites, preferences,
    isFavorite, sortedMovies,
    fetchGenres, fetchMovies, toggleFavorite,
    setSort, setGenre, setYear, setSearch, savePreferences
  }
})
