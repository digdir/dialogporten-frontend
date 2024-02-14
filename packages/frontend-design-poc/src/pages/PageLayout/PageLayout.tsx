import { Outlet } from "react-router-dom";
import { Header } from "../../components/Header/Header.tsx";

import styles from "./pageLayout.module.css";

export const PageLayout = () => {
  return (
    <div className={styles.pageLayout}>
      <Header name="John Doe" />
      <div className={styles.container}>
        <Outlet />
      </div>
    </div>
  );
};
