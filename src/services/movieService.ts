import axios from 'axios';
import type { Movie } from '../types/movie';

const moviesApi = axios.create({
  baseURL: 'https://api.themoviedb.org/3',
  headers: {
    Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}`,
  },

  params: {
    language: 'en-US',
    page: 1,
    include_adult: false,
  },
});

interface MoviesResponse {
  results: Movie[];
}

export async function fetchMovies(query: string): Promise<Movie[]> {
  const { data } = await moviesApi.get<MoviesResponse>('/search/movie', {
    params: { query },
  });

  return data.results;
}
