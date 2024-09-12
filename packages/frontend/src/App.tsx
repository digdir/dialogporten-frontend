import { Navigate, Route, Routes } from 'react-router-dom';
import { ProtectedPageLayout } from './components/PageLayout/PageLayout.tsx';
import { Inbox } from './pages/Inbox';
import { InboxItemPage } from './pages/InboxItemPage';
import { Logout } from './pages/LogoutPage';
import { SavedSearchesPage } from './pages/SavedSearches';

import './app.css';

function App() {
  return (
    <div className="app">
      <Routes>
        <Route element={<ProtectedPageLayout />}>
          <Route path="/" element={<Inbox key="inbox" viewType={'inbox'} />} />
          <Route path="/drafts" element={<Inbox key="draft" viewType={'drafts'} />} />
          <Route path="/sent" element={<Inbox key="sent" viewType={'sent'} />} />
          <Route path="/saved-searches" element={<SavedSearchesPage />} />
          <Route path="/inbox/:id" element={<InboxItemPage />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Route>
        <Route path="/loggedout" element={<Logout />} />
      </Routes>
    </div>
  );
}

export default App;
