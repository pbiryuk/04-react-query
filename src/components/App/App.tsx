import { useEffect, useRef, useState } from 'react';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import toast, { Toaster } from 'react-hot-toast';

import { fetchMovies } from '../../services/movieService';
import type { MovieResponse } from '../../types/movie';
import { type Movie } from '../../types/movie';

import SearchBar from '../SearchBar/SearchBar';
import MovieGrid from '../MovieGrid/MovieGrid';
import Loader from '../Loader/Loader';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import MovieModal from '../MovieModal/MovieModal';
import ReactPaginate from 'react-paginate';
import styles from './App.module.css';

export default function App() {
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const { data, isLoading, isError, isSuccess, isFetching } = useQuery<MovieResponse>({
  queryKey: ['movies', searchQuery, page],
  queryFn: () => fetchMovies(searchQuery, page),
  enabled: searchQuery.trim().length > 0,
  placeholderData: keepPreviousData,
});

  const handleSearch = (query: string) => {
    const trimmed = query.trim();
    if (!trimmed) {
      toast.error('Please enter your search query.');
      return;
    }
    setSearchQuery(trimmed);
    setPage(1);
    setSelectedMovie(null); 
  };

  const movies = data?.results || [];
  const totalPages = data?.total_pages || 0;

  const prevSearchQuery = useRef('');

  useEffect(() => {
  if (isSuccess) {
    if (data?.results.length === 0) {
      toast('No movies found for your request.');
    } else if (prevSearchQuery.current !== searchQuery) {
      toast.success('Movies found successfully!');
      prevSearchQuery.current = searchQuery;
    }
  }
}, [isSuccess, data, searchQuery]);
  


  return (
    <>
      <Toaster position="top-center" />
      <SearchBar onSubmit={handleSearch} />

      {searchQuery && (isLoading || isFetching) && <Loader />}

      {isError && <ErrorMessage />}

      {/* Only show pagination + grid when data is successfully loaded */}
      {isSuccess && movies.length > 0 && (
        <>
          {totalPages > 1 && (
            <ReactPaginate
              pageCount={totalPages}
              pageRangeDisplayed={5}
              marginPagesDisplayed={1}
              onPageChange={({ selected }) => setPage(selected + 1)}
              forcePage={page - 1}
              containerClassName={styles.pagination}
              activeClassName={styles.active}
              nextLabel="→"
              previousLabel="←"
            />
          )}

          {/* Loader only if fetching and there's no previous data */}
          {isFetching && movies.length === 0 && <Loader />}

          <MovieGrid movies={movies} onSelect={setSelectedMovie} />
        </>
      )}

      {selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={() => setSelectedMovie(null)} />
      )}
    </>
  );
}