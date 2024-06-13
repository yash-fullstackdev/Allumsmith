import { RouteProps } from 'react-router-dom';
import { authPages } from '../config/pages.config';
import SignInComponent from '../pages/crm/Auth/SignIn';
import SignUpComponent from '../pages/crm/Auth/SignUp';

const authRoutes: RouteProps[] = [
	{ path: authPages.loginPage.to, element: <SignInComponent /> },
	{ path: authPages.signUpPage.to, element: <SignUpComponent /> },
];

export default authRoutes;
