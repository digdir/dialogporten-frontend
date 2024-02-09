import { Outlet } from "react-router-dom";

import styles from "./pageLayout.module.css";

export const PageLayout = () => {
  return (
    <div className={styles.pageLayout}>
      <nav aria-label="hovedmeny" />
      <Outlet />
    </div>
  );
};
