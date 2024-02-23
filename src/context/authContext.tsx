import React, {
	createContext,
	FC,
	ReactNode,
	useContext,
	useEffect,
	useMemo,
	useState,
} from 'react';
import { useNavigate } from 'react-router-dom';
import firebase, { initializeApp } from 'firebase/app';
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import useLocalStorage from '../hooks/useLocalStorage';
import { authPages } from '../config/pages.config';
import useFakeUserAPI from '../mocks/hooks/useFakeUserAPI';
import { TUser } from '../mocks/db/users.db';

import firestore, { auth } from '../firebase';
import { updateAxiosInstance } from '../utils/api-helper.util';
import { doc, getDoc } from 'firebase/firestore';

export interface IAuthContextProps {
	usernameStorage: string | ((newValue: string | null) => void) | null;
	onLogin: (username: string, password: string) => Promise<void>;
	onSignup: (username: string, password: string) => Promise<void>;
	onLogout: () => void;
	userData: TUser;
	isLoading: boolean;
}
const AuthContext = createContext<IAuthContextProps>({} as IAuthContextProps);

interface IAuthProviderProps {
	children: ReactNode;
}
export const AuthProvider: FC<IAuthProviderProps> = ({ children }) => {
	const [usernameStorage, setUserName] = useLocalStorage('user', null);

	const [items, setItems] = useState([]);

	const { response, isLoading, getCheckUser } = useFakeUserAPI(usernameStorage as string);
	const userData = response as TUser;

	const navigate = useNavigate();


	const onLogin = async (username: string, password: string) => {
		try {

			const userCredential = await signInWithEmailAndPassword(auth, username, password);
			const { user } = userCredential;
			localStorage.setItem('userEmail', user.email ?? "");

			// Get the ID token
			const idToken = await user.getIdToken();
			localStorage.setItem('accesstoken', idToken)

			// if (idToken) {
			// 	localStorage.setItem('token', idToken);
			// }
			updateAxiosInstance();

			if (typeof setUserName === 'function') {
				await setUserName(username);
				navigate('/');
			}
			const userData: any = await getDoc(doc(firestore, `users/${user.uid}`));
			console.log(userData.data());

			localStorage.setItem('module', JSON.stringify(userData.data().modules));
			localStorage.setItem('firstName', userData.data().firstName);
			localStorage.setItem('lastName', userData.data().lastName);
			// console.log("User Data", userData?._document?.data?.value?.mapValue?.fields);

		} catch (error) {
			// Handle login error
			throw new Error('Login failed: Invalid user credentials');
		}
	};

	const onSignup = async (username: string, password: string) => {
		try {
			// await createUserWithEmailAndPassword(auth, username, password);
			// if (typeof setUserName === 'function') {
			// 	await setUserName(username);
			// 	navigate('/');
			const userCredential = await createUserWithEmailAndPassword(auth, username, password);
			const { user } = userCredential;

			// Get the ID token
			const idToken = await user.getIdToken();
			console.log('User ID token:', idToken);

			updateAxiosInstance();

			if (typeof setUserName === 'function') {
				await setUserName(username);
				navigate('/');
			}
		} catch (error: Error | any) {
			// Handle signup error
			throw new Error(`Signup failed:, ${error.message}`);
		}
	};


	const onLogout = async () => {
		if (typeof setUserName === 'function') await setUserName(null);
		navigate(`../${authPages.loginPage.to}`, { replace: true });
		localStorage.clear()
	};

	const value: IAuthContextProps = useMemo(
		() => ({
			usernameStorage,
			onLogin,
			onLogout,
			userData,
			isLoading,
			onSignup,
		}),
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[usernameStorage, userData],
	);
	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
	return useContext(AuthContext);
};
