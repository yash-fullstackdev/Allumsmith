// import React from 'react';
// import ReactDOM from 'react-dom/client';
// import { BrowserRouter } from 'react-router-dom';
// import reportWebVitals from './reportWebVitals';

// import { ThemeContextProvider } from './context/themeContext';
// import { AuthProvider } from './context/authContext';
// import App from './App/App';

// import './i18n';
// import './styles/index.css';

// import 'react-date-range/dist/styles.css'; // main style file
// import 'react-date-range/dist/theme/default.css';
// import './styles/vendors.css';
// import firebase from 'firebase/app';
// import 'firebase/auth';
// import firebaseConfig from './firebase';

// const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

// if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);
// root.render(
// 	<React.StrictMode>
// 		<ThemeContextProvider>
// 			<BrowserRouter>
// 				<AuthProvider>
// 					<App />
// 				</AuthProvider>
// 			</BrowserRouter>
// 		</ThemeContextProvider>
// 	</React.StrictMode>,
// );

// // If you want to start measuring performance in your app, pass a function
// // to log results (for example: reportWebVitals(console.log))
// // or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import reportWebVitals from './reportWebVitals';

import { ThemeContextProvider } from './context/themeContext';
import { AuthProvider } from './context/authContext';
import App from './App/App';

import './i18n';
import './styles/index.css';

import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css';
import './styles/vendors.css';

// import { UserProvider } from './context/UserContext';

const firebaseConfig = {
	apiKey: 'AIzaSyAo_Sw3ko7qJrvHPtNmTxqaB1U17Z3EGSM',
	authDomain: 'saurav-erp.firebaseapp.com',
	projectId: 'saurav-erp',
	storageBucket: 'saurav-erp.appspot.com',
	messagingSenderId: '427629474156',
	appId: '1:427629474156:web:d35e5e07610d41166b4349',
};

const firebaseApp = initializeApp(firebaseConfig);
// initializeApp(firebaseConfig);
export const auth = getAuth(firebaseApp);
export const firestore = getFirestore(firebaseApp);

// Initialize Firebase
// export default firebaseConfig;
// export  firestore;
// const firestore = getFirestore(firebaseApp);

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
	<React.StrictMode>
		<ThemeContextProvider>
			<BrowserRouter>
				<AuthProvider>
					<App />
				</AuthProvider>
			</BrowserRouter>
		</ThemeContextProvider>
	</React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
