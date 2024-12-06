import { Navigate, Route, Routes } from 'react-router-dom';
import { ProtectedPageLayout } from './components/PageLayout/PageLayout.tsx';
import { Inbox } from './pages/Inbox';
import { Routes as AppRoutes } from './pages/Inbox/Inbox';
import { InboxItemPage } from './pages/InboxItemPage';
import { Logout } from './pages/LogoutPage';
import { SavedSearchesPage } from './pages/SavedSearches';

import './app.css';

function App() {
  return (
    <div className="app">
      <Routes>
        <Route element={<ProtectedPageLayout />}>
          <Route path={AppRoutes.inbox} element={<Inbox key="inbox" viewType={'inbox'} />} />
          <Route path={AppRoutes.drafts} element={<Inbox key="draft" viewType={'drafts'} />} />
          <Route path={AppRoutes.sent} element={<Inbox key="sent" viewType={'sent'} />} />
          <Route path={AppRoutes.archive} element={<Inbox key="archive" viewType={'archive'} />} />
          <Route path={AppRoutes.bin} element={<Inbox key="bin" viewType={'bin'} />} />
          <Route path={AppRoutes.inboxItem} element={<InboxItemPage />} />
          <Route path={AppRoutes.savedSearches} element={<SavedSearchesPage />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Route>
        <Route path="/loggedout" element={<Logout />} />
      </Routes>
    </div>
  );
}

export default App;
