import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import ReactPaginate from 'react-paginate';
import { Toaster, toast } from 'react-hot-toast';
import css from './App.module.css';

import SearchBar from '../SearchBar/SearchBar';
import MovieGrid from '../MovieGrid/MovieGrid';
import Loader from '../Loader/Loader';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import MovieModal from '../MovieModal/MovieModal';

import type { Movie } from '../../types/movie';
import { fetchMovies, type SearchResponse } from '../../services/movieService';

export default function App() {
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Movie | null>(null);

  const { data, isFetching, isError, error } = useQuery({
    queryKey: ['movies', query, page] as const,
    queryFn: async (): Promise<SearchResponse> => fetchMovies(query, page),
    enabled: !!query,
    placeholderData: (prev) => prev,
  });

  const movies = data?.results ?? [];
  const totalPages = data?.total_pages ?? 0;

  useEffect(() => {
    if (!isFetching && !isError && query && data && data.results.length === 0) {
      toast(`Nothing found for “${query}”`);
    }
  }, [isFetching, isError, query, data]);

  const handleSearch = (q: string) => {
    setQuery(q);
    setPage(1);
  };

  return (
    <div className={css.container}>
      <Toaster position="top-right" />
      <a href="https://www.themoviedb.org/" target="_blank" rel="noreferrer">
        Powered by TMDB
      </a>

      <SearchBar onSubmit={handleSearch} />

      {isFetching && <Loader />}
      {isError && <ErrorMessage message={(error as Error).message} />}

      {!isFetching && !isError && movies.length === 0 && query && (
        <p>Nothing found for “{query}”.</p>
      )}

      {!isError && movies.length > 0 && (
        <>
          <MovieGrid movies={movies} onSelect={setSelected} />
          {totalPages > 1 && (
            <ReactPaginate
              pageCount={totalPages}
              pageRangeDisplayed={5}
              marginPagesDisplayed={1}
              onPageChange={({ selected }) => setPage(selected + 1)}
              forcePage={page - 1}
              containerClassName={css.pagination}
              activeClassName={css.active}
              nextLabel="→"
              previousLabel="←"
            />
          )}
        </>
      )}

      {selected && <MovieModal movie={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
