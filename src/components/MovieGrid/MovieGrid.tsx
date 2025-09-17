import { useEffect, useMemo, useRef, useState } from 'react';
import styles from './MovieGrid.module.css';
import type { Movie } from '../../types/movie';
import { imgUrl } from '../../services/movieService';

export interface MovieGridProps {
  movies: Movie[];
  onSelect: (m: Movie) => void;
}

const PAGE_SIZE = 15;

export default function MovieGrid({ movies, onSelect }: MovieGridProps) {
  const [count, setCount] = useState(PAGE_SIZE);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => { setCount(PAGE_SIZE); }, [movies]);

  const visible = useMemo(() => movies.slice(0, count), [movies, count]);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setCount((c) => Math.min(c + PAGE_SIZE, movies.length));
        }
      },
      { rootMargin: '300px 0px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [movies.length]);

  if (!movies || movies.length === 0) {
    return <p className={styles.empty}>Nothing found yet.</p>;
  }

  return (
    <>
      <div
        className={styles.grid}
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
          gap: 16,
        }}
      >
        {visible.map((m) => (
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
            {m.release_date && <div className={styles.meta}>{m.release_date.slice(0, 4)}</div>}
          </div>
        ))}
      </div>
      <div ref={sentinelRef} className={styles.sentinel} />
    </>
  );
}
