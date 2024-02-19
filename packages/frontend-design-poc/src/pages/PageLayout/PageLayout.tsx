<<<<<<< HEAD
import { Outlet } from 'react-router-dom';
import { Header } from '../../components';
import styles from './pageLayout.module.css';
import { Footer, Sidebar } from '../../components';
=======
import { Outlet } from "react-router-dom";
import { Header, Footer } from '../../components';

import styles from "./pageLayout.module.css";
>>>>>>> 3f25efa (adds missing import to PageLayout)

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
