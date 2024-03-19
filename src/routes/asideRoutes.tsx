import React from 'react';
import { RouteProps } from 'react-router-dom';
import DefaultAsideTemplate from '../templates/layouts/Asides/DefaultAside.template';
import { authPages } from '../config/pages.config';

const asideRoutes: RouteProps[] = [
	{ path: authPages.loginPage.to, element: null },
	{ path: authPages.resetPage.to, element: null },
	{ path: authPages.signUpPage.to, element: null },
	{ path: '*', element: <DefaultAsideTemplate /> },
];

export default asideRoutes;
