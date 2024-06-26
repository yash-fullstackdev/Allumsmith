import { RouteProps } from 'react-router-dom';
import { appPages, authPages } from '../config/pages.config';
import SignInComponent from '../pages/crm/Auth/SignIn';
import SignUpComponent from '../pages/crm/Auth/SignUp';
import UsersPermissionPage from '../pages/crm/PermissionPage/UsersPermissionPage/UsersPermissionPage';

const authRoutes: RouteProps[] = [
	{ path: authPages.loginPage.to, element: <SignInComponent /> },
	{ path: authPages.signUpPage.to, element: <SignUpComponent /> },
];

export default authRoutes;
