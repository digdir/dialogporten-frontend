import { Route, Routes } from 'react-router-dom';
import { PageLayout } from './components/PageLayout';
import { Home } from './pages/Home';
import { Inbox } from './pages/Inbox';
import { InboxItemPage } from './pages/InboxItemPage';
import { PageNotFound } from './pages/PageNotFound';
import { SavedSearches } from './pages/SavedSearches';

import './app.css';

function App() {
  return (
    <div className="app">
      <Routes>
        <Route element={<PageLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/inbox" element={<Inbox viewType={'inbox'} />} />
          <Route path="/drafts" element={<Inbox viewType={'draft'} />} />
          <Route path="/sent" element={<Inbox viewType={'sent'} />} />
          <Route path="/saved-searches" element={<SavedSearches />} />
          <Route path="/inbox/:id" element={<InboxItemPage />} />
          <Route path="*" element={<PageNotFound />} />
        </Route>
        <Route
          path="/loggedout"
          element={
            <main>
              <h1>You are now logged out ...</h1>
            </main>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
