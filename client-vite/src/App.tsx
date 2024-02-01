import { QueryClient, QueryClientProvider } from 'react-query';
import { HelloWorld } from './components/HelloWorld/HelloWorld.tsx';
import styles from './app.module.css'

const queryClient = new QueryClient();

function App() {
  return (<QueryClientProvider client={queryClient}>
    <section data-testid="app" className={styles.app}>
      <HelloWorld />
    </section>
  </QueryClientProvider>);
}

export default App;
