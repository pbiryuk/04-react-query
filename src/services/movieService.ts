import axios from 'axios';
import type { Movie } from '../types/movie';

const API_TOKEN = import.meta.env.VITE_TMDB_TOKEN;
const BASE_URL = 'https://api.themoviedb.org/3/search/movie';

export interface MovieResponse {
  results: Movie[];
  total_pages: number;
}

export async function fetchMovies(query: string, page: number): Promise<MovieResponse> {
  if (!API_TOKEN) {
    throw new Error('TMDB API token is missing!');
  }

  const { data } = await axios.get<MovieResponse>(BASE_URL, {
    params: {
      query,
      page,
    },
    headers: {
      Authorization: `Bearer ${API_TOKEN}`,
    },
  });

  return data;
}
