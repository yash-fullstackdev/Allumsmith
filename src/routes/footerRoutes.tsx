import React from 'react';
import { RouteProps } from 'react-router-dom';
import DefaultFooterTemplate from '../templates/layouts/Footers/DefaultFooter.template';
import { authPages } from '../config/pages.config';

const footerRoutes: RouteProps[] = [
	{ path: authPages.loginPage.to, element: null },
	{ path: authPages.resetPage.to, element: null },
	{ path: authPages.signUpPage.to, element: null },

	{ path: '*', element: <DefaultFooterTemplate /> },
];

export default footerRoutes;
