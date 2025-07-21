import axios from 'axios';
import type { MovieResponse } from '../types/movie';

const API_TOKEN = import.meta.env.VITE_TMDB_TOKEN;
const BASE_URL = 'https://api.themoviedb.org/3/search/movie';

export async function fetchMovies(query: string, page: number): Promise<MovieResponse> {
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
