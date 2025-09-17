import type { FC } from 'react';
import styles from './ErrorMessage.module.css';

type Props = { message: string };

const ErrorMessage: FC<Props> = ({ message }) => {
  return <div className={styles.error}>{message}</div>;
};

export default ErrorMessage;
