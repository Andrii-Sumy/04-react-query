import { useState } from 'react';
import { toast } from 'react-hot-toast';
import styles from './SearchBar.module.css';

export interface SearchBarProps {
  onSubmit: (q: string) => void;
}

export default function SearchBar({ onSubmit }: SearchBarProps) {
  const [q, setQ] = useState('');

  const action = (formData: FormData) => {
    const value = String(formData.get('query') ?? '').trim();
    if (!value) {
      toast.error('Please enter a search query');
      return;
    }
    onSubmit(value);
  };

  return (
    <form className={styles.form} action={action}>
      <input
        name="query"
        className={styles.input}
        placeholder="Search movies..."
        value={q}
        onChange={(e) => setQ(e.target.value)}
        autoFocus
      />
      <button type="submit" className={styles.button}>Search</button>
    </form>
  );
}
