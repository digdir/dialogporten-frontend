import { Navigate, Route, Routes } from 'react-router-dom';
import { PageLayout } from './components';
import { Inbox } from './pages/Inbox';
import { InboxItemPage } from './pages/InboxItemPage';
import { SavedSearchesPage } from './pages/SavedSearches';

import './app.css';

function App() {
  return (
    <div className="app">
      <Routes>
        <Route element={<PageLayout />}>
          <Route path="/" element={<Inbox key="inbox" viewType={'inbox'} />} />
          <Route path="/drafts" element={<Inbox key="draft" viewType={'drafts'} />} />
          <Route path="/sent" element={<Inbox key="sent" viewType={'sent'} />} />
          <Route path="/saved-searches" element={<SavedSearchesPage />} />
          <Route path="/inbox/:id" element={<InboxItemPage />} />
          <Route path="*" element={<Navigate to="/" />} />
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
