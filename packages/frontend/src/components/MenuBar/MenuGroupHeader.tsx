import type React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './menuGroupHeader.module.css';

export const MenuGroupHeader: React.FC<{ title: string }> = ({ title }) => {
  const { t } = useTranslation();
  if (!title) {
    return null;
  }
  return (
    <header className={styles.menuGroupHeader}>
      <h2 className={styles.title}>{t(title)}</h2>
    </header>
  );
};
