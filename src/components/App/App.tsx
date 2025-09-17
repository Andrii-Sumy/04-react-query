import { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import styles from './App.module.css';

import SearchBar from '../SearchBar/SearchBar';
import MovieGrid from '../MovieGrid/MovieGrid';
import Loader from '../Loader/Loader';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import MovieModal from '../MovieModal/MovieModal';

import type { Movie } from '../../types/movie';
import { fetchMovies } from '../../services/movieService';

export default function App() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<Movie | null>(null);
  const [lastQuery, setLastQuery] = useState('');

  async function handleSearch(query: string) {
    const q = query.trim();
    setLastQuery(q);
    if (!q) return;

    try {
      setLoading(true);
      setError(null);
      const results = await fetchMovies(q);
      setMovies(results);
    } catch (e: any) {
      setMovies([]);
      setError(e?.message || 'Unknown error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.container}>
      <Toaster position="top-right" /> { }
      <a href="https://www.themoviedb.org/" target="_blank" rel="noreferrer">
        Powered by TMDB
      </a>

      <SearchBar onSubmit={handleSearch} />

      {loading && <Loader />}
      {error ? <ErrorMessage message={error} /> : null}

      {!loading && !error && movies.length === 0 && lastQuery && (
        <p>Nothing found for “{lastQuery}”.</p>
      )}

      {!loading && !error && movies.length > 0 && (
        <MovieGrid movies={movies} onSelect={setSelected} />
      )}

      {selected && <MovieModal movie={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
