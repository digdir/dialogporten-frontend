import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import { getUser } from '../../api/queries.ts';
import styles from './helloWorld.module.css';

export const HelloWorld = () => {
  const { isLoading, data } = useQuery('user', getUser);
  const { t } = useTranslation();
  return (
    <section className={styles.helloWorld}>
      {isLoading ? <span>Loading ...</span> : <h1>{t('example.hello', { person: data?.name })}!</h1>}
      <Link to="/inbox/">Inbox</Link>
    </section>
  );
};
