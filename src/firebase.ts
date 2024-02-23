// Import the functions you need from the SDKs you need
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// import firebase from 'firebase/app'; // Import the Firebase App module
import { initializeApp } from 'firebase/app';
// import { getAuth } from 'firebase/auth';
import {
	getAuth,
	EmailAuthProvider,
	reauthenticateWithCredential,
	updatePassword,
} from 'firebase/auth';

import { getFirestore } from 'firebase/firestore';

import { getStorage } from 'firebase/storage';

// Your web app's Firebase configuration
const firebaseConfig = {
	apiKey: 'AIzaSyAo_Sw3ko7qJrvHPtNmTxqaB1U17Z3EGSM',
	authDomain: 'saurav-erp.firebaseapp.com',
	projectId: 'saurav-erp',
	storageBucket: 'saurav-erp.appspot.com',
	messagingSenderId: '427629474156',
	appId: '1:427629474156:web:d35e5e07610d41166b4349',
};
const firebaseApp = initializeApp(firebaseConfig);
const storage = getStorage(firebaseApp);

export { storage };

// initializeApp(firebaseConfig);
export const auth:any = getAuth(firebaseApp);
const firestore = getFirestore(firebaseApp);

// Initialize Firebase
// export default firebaseConfig;
export default firestore;
