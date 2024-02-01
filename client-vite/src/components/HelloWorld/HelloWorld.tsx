import styles from './helloWorld.module.css';
import { useQuery } from 'react-query';
import { getUser } from '../../api/queries.ts';

export const HelloWorld = () => {
  const { isLoading, data } = useQuery('user', getUser);

  return (<section className={styles.helloWorld}>
      {isLoading ? <span>Loading ...</span> : <h1>Hello, {data?.name}!</h1>}
    </section>);
};