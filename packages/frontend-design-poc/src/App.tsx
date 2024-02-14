import { Route, Routes } from "react-router-dom";
import { HelloWorld } from "./components/HelloWorld";
import { PageNotFound } from "./pages/PageNotFound";
import { PageLayout } from "./pages/PageLayout";
import { Inbox } from "./pages/Inbox";
import { InboxItemPage } from "./pages/InboxItemPage";

import styles from "./app.module.css";

function App() {
  return (
    <main className={styles.app}>
      <Routes>
        <Route element={<PageLayout />}>
          <Route path="/" element={<HelloWorld />} />
          <Route path="/inbox" element={<Inbox />} />
          <Route path="/inbox/:id" element={<InboxItemPage />} />
          <Route path="*" element={<PageNotFound />} />
        </Route>
      </Routes>
    </main>
  );
}

export default App;
