import { Route, Routes } from "react-router-dom";
import { HelloWorld } from "./components/HelloWorld";
import { PageNotFound } from "./pages/PageNotFound";
import { PageLayout } from "./pages/PageLayout";
import styles from "./app.module.css";

function App() {
  return (
    <div className={styles.app} role="main">
      <Routes>
        <Route element={<PageLayout />}>
          <Route path="/" element={<HelloWorld />} />
          <Route path="*" element={<PageNotFound />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
