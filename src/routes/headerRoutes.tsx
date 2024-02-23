import React from 'react';
import { RouteProps } from 'react-router-dom';
import DefaultHeaderTemplate from '../templates/layouts/Headers/DefaultHeader.template';
import { appPages, authPages } from '../config/pages.config';

const headerRoutes: RouteProps[] = [
	{ path: authPages.loginPage.to, element: null },
	{ path: authPages.signUpPage.to, element: null },

	{ path: authPages.resetPage.to, element: null },

	{
		path: appPages.projectAppPages.subPages.projectDashboardPage.to,
		element: null,
	},
	{
		path: '',
		element: null,
	},
	{ path: '*', element: <DefaultHeaderTemplate /> },
];

export default headerRoutes;
