import ReactDOM from 'react-dom/client';
import App from './App'; // Ensure this is the correct path, and typically you don't include the file extension
import { BrowserRouter } from 'react-router-dom';

const rootElement = document.getElementById('root');

if (rootElement) {
	const root = ReactDOM.createRoot(rootElement);
	root.render(
		<BrowserRouter>
			<App />
		</BrowserRouter>,
	);
} else {
	console.error('Failed to find the root element');
}
