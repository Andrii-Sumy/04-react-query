import styles from './MovieGrid.module.css';
import type { Movie } from '../../types/movie';
import { imgUrl } from '../../services/movieService';

export interface MovieGridProps {
  movies: Movie[];
  onSelect: (m: Movie) => void;
}

export default function MovieGrid({ movies, onSelect }: MovieGridProps) {
  if (!movies || movies.length === 0) {
    return <p className={styles.empty}>Nothing found yet.</p>;
  }

  return (
    <div
      className={styles.grid}
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
        gap: 16,
      }}
    >
      {movies.map((m) => (
        <div key={m.id} className={styles.card} onClick={() => onSelect(m)}>
          {m.poster_path && (
            <img
              className={styles.poster}
              src={imgUrl(m.poster_path, 'w300')}
              alt={m.title}
              loading="lazy"
            />
          )}
          <div className={styles.title}>{m.title}</div>
          {m.release_date && (
            <div className={styles.meta}>{m.release_date.slice(0, 4)}</div>
          )}
        </div>
      ))}
    </div>
  );
}
