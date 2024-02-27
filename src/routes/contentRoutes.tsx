import React, { lazy } from 'react';
import { RouteProps } from 'react-router-dom';
import { appPages, authPages } from '../config/pages.config';
import NotFoundPage from '../pages/NotFound.page';
import ProductListPage from '../pages/crm/user/ProductListPage/ProductListPage';
import AddProductPage from '../pages/crm/user/ProductPage/AddProductPage';
import PurchaseOrderListPage from '../pages/crm/PurchaseOrder/PurchaseOrderListPage/PurchaseOrderListPage';
import PurchaseOrderPage from '../pages/crm/PurchaseOrder/PurchaseOrderPage/AddPurchaseOrderPage';
import VendorListPage from '../pages/crm/Vendors/VendorListPage/VendorListPage';
import VendorPage from '../pages/crm/Vendors/VendorPage/VendorPage';
import BranchesListPage from '../pages/crm/Branches/BranchesListPage/BranchesListPage';
import BranchesPage from '../pages/crm/Branches/BranchesPage/BranchesPage';
import ColorsListPage from '../pages/crm/Colors/ColorsListPage/ColorsListPage';
import ColorsPage from '../pages/crm/Colors/ColorsPage/ColorsPage';

/**
 * UI
 */


/**
 * Icons
 */


// ADDED





const contentRoutes: RouteProps[] = [

	{
		path: appPages.productPage.listPage.to,
		element: <ProductListPage />,
	},

	{
		path: `${appPages.productPage.editPageLink.to}`,
		element: <AddProductPage />,
	},
	{
		path: `${appPages.purchaseOrderPage.listPage.to}`,
		element: <PurchaseOrderListPage />,
	},
	{
		path: `${appPages.purchaseOrderPage.editPageLink.to}`,
		element: <PurchaseOrderPage />,
	},
	{
		path: `${appPages.vendorPage.listPage.to}`,
		element: <VendorListPage />,
	},
	{
		path: `${appPages.vendorPage.editPageLink.to}`,
		element: <VendorPage />,
	},
	{
		path: `${appPages.branchesPage.listPage.to}`,
		element: <BranchesListPage />,
	},
	{
		path: `${appPages.branchesPage.editPageLink.to}`,
		element: <BranchesPage />,
	},
	{
		path: `${appPages.colorsPage.listPage.to}`,
		element: <ColorsListPage />,
	},
	{
		path: `${appPages.colorsPage.editPageLink.to}`,
		element: <ColorsPage />,
	},
	// { path: authPages.loginPage.to, element: <LoginPage /> },
	// { path: authPages.signUpPage.to, element: <SignupPage /> },

	{ path: '*', element: <NotFoundPage /> },
];

export default contentRoutes;
