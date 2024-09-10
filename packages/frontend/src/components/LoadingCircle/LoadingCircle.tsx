import styles from './loadingCircle.module.css';
import { useProgress } from './useProgress';

interface LoadingCircleProps {
  percentage: number;
}

export const LoadingCircle: React.FC<LoadingCircleProps> = ({ percentage }) => {
  const { ref } = useProgress(percentage);
  return <div className={styles.progress} ref={ref} data-value={`${percentage}%`} />;
};
