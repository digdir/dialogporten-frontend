import { useEffect, useState } from 'react';
import appStyles from './app.module.css';

function App() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [username, setUsername] = useState<string>('');

  useEffect(() => {
    setIsLoading(true);
    fetch('/user')
      .then((resp) => resp.json())
      .then((user) => setUsername(user.name))
      .finally(() => setIsLoading(false));

  }, []);

  return (<section className={appStyles.app} data-testid="app">
    {isLoading ? <p>Is loading</p> : <h1>Hello, {username}!</h1>}
  </section>);
}

export default App;
