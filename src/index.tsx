import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import reportWebVitals from './reportWebVitals';
import { ClerkProvider } from '@clerk/clerk-react';
import { ThemeContextProvider } from './context/themeContext';
import { AuthProvider } from './context/authContext';
import App from './App/App';
import './i18n';
import './styles/index.css';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css';
import './styles/vendors.css';
import AuthRouter from './components/router/AuthRouter';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
	<React.StrictMode>
		<ClerkProvider
			appearance={{
				variables: {
					colorPrimary: 'hsl(263.4, 70%, 50.4%)',
				},
			}}
			publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY}>
			<ThemeContextProvider>
				<BrowserRouter>
					<AuthProvider>
						<AuthRouter />
						<App />
					</AuthProvider>
				</BrowserRouter>
			</ThemeContextProvider>
		</ClerkProvider>
	</React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
