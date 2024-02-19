import { Outlet } from 'react-router-dom';
import { Header } from '../../components/Header/Header.tsx';
import styles from './pageLayout.module.css';
import { Sidebar } from '../../components/index.ts';

export const PageLayout = () => {
	return (
		<div className={styles.pageLayout}>
			<Header name="John Doe" />
			<div className={styles.container}>
				<Sidebar />
				<Outlet />
			</div>
		</div>
	);
};
