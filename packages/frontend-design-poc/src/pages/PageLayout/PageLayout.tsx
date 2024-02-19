import { Outlet } from 'react-router-dom';
import { Header } from '../../components';
import styles from './pageLayout.module.css';
import { Footer, Sidebar } from '../../components';

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
