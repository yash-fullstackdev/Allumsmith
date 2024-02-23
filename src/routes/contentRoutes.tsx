import React, { lazy } from 'react';
import { RouteProps } from 'react-router-dom';
import { appPages, authPages } from '../config/pages.config';
import NotFoundPage from '../pages/NotFound.page';
import LoginPage from '../pages/Login.page';
import SignupPage from '../pages/Signup.page';
import ResetPage from '../pages/Reset.page';
import UserListPage from '../pages/crm/user/ProductListPage/ProductListPage';
import UserPage from '../pages/crm/user/ProductPage/AddProductPage';
import CustomerListPage from '../pages/crm/customer/CustomerListPage/CustomerList.page';
import CustomerPage from '../pages/crm/customer/CustomerPage/Customer.page';
import ShippingContacts from '../pages/crm/customer/CustomerPage/ShippingContacts';
import VendorListPage from '../pages/crm/vendor/VendorListPage/VendorList.page';
import VendorPage from '../pages/crm/vendor/VendorPage/Vendor.page';
import RawMaterialPage from '../pages/crm/components/raw-materials/RawMaterialsPage/RawMaterial.page';
import RawMaterialsListPage from '../pages/crm/components/raw-materials/RawMaterialListPage/RawMaterialsListPage';
import InHouseComponentListPage from '../pages/crm/components/in-house-components/InHouseComponentListPage/InHouseComponentListPage';
import InHouseComponentPage from '../pages/crm/components/in-house-components/InHouseComponentPage/InHouseComponent.page';
import ConversionsListPage from '../pages/crm/components/convesions/ConversionsListPage/ConversionsListPage';
import ConversionsPage from '../pages/crm/components/convesions/ConversionsPage/ConversionsPage';
import ProductListPage from '../pages/crm/user/ProductListPage/ProductListPage';
import AddProductPage from '../pages/crm/user/ProductPage/AddProductPage';
import PurchaseOrderListPage from '../pages/crm/PurchaseOrder/PurchaseOrderListPage/PurchaseOrderListPage';
import PurchaseOrderPage from '../pages/crm/PurchaseOrder/PurchaseOrderPage/AddPurchaseOrderPage';

/**
 * UI
 */


/**
 * Icons
 */


// ADDED
const MasterSettingsPage = lazy(() => import('../pages/crm/master-settings/main/main-page'));
const CustomerClassPage = lazy(
	() => import('../pages/crm/master-settings/secondary/customer-class'),
);
const CustomerTypePage = lazy(() => import('../pages/crm/master-settings/secondary/customer-type'));
const ShippingMethodPage = lazy(
	() => import('../pages/crm/master-settings/secondary/shipping-method'),
);
const TermsPage = lazy(() => import('../pages/crm/master-settings/secondary/terms'));
const PricingTermsPage = lazy(() => import('../pages/crm/master-settings/secondary/pricing-terms'));
const PaymentMethodPage = lazy(
	() => import('../pages/crm/master-settings/secondary/payment-method'),
);
const OrderSourcePage = lazy(() => import('../pages/crm/master-settings/secondary/order-source'));
const SalesmanMaintenancePage = lazy(
	() => import('../pages/crm/master-settings/secondary/salesman-maintenance'),
);


const ProfilePage = lazy(() => import('../pages/Profile.page'));



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


	{ path: authPages.loginPage.to, element: <LoginPage /> },
	{ path: authPages.profilePage.to, element: <ProfilePage /> },
	{ path: authPages.resetPage.to, element: <ResetPage /> },
	{ path: authPages.signUpPage.to, element: <SignupPage /> },

	{ path: '*', element: <NotFoundPage /> },
];

export default contentRoutes;
