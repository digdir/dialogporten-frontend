import { Outlet } from "react-router-dom";
import { Header, Footer, Sidebar } from '../../components';

import styles from "./pageLayout.module.css";

export const PageLayout = () => {
	return (
		<div className={styles.pageLayout}>
			<Header name="John Doe" />
			<div className={styles.container}>
				<Sidebar />
				<Outlet />
			</div>
      <Footer />
		</div>
	);
};
