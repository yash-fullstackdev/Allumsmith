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
import InventoryListPage from '../pages/crm/Inventory/InventoryListPage/InventoryListPage';
import InventoryPage from '../pages/crm/Inventory/InventoryPage/InventoryPage';
import CustomerListPage from '../pages/crm/Customer/CustomerListPage/CustomerListPage';
import CustomerPage from '../pages/crm/Customer/CustomerPage/CustomerPage';
import CoatingListPage from '../pages/crm/Coating/CoatingListPage/CoatingListPage';
import CoatingPage from '../pages/crm/Coating/CoatingPage/CoatingPage';
import JobsListPage from '../pages/crm/Jobs/JobsListPage/JobsListPage';
import JobsPage from '../pages/crm/Jobs/JobsPage/JobsPage';


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
	// {
	// 	path: `${appPages.purchaseEntry.listPage.to}`,
	// 	element: <PurchaseEntryListPage />,
	// },
	{
		path: `${appPages.vendorPage.listPage.to}`,
		element: <VendorListPage />,
	},
	{
		path: `${appPages.customerPage.listPage.to}`,
		element: <CustomerListPage />,
	},
	{
		path: `${appPages.vendorPage.editPageLink.to}`,
		element: <VendorPage />,
	},
	{
		path: `${appPages.customerPage.editPageLink.to}`,
		element: <CustomerPage />,
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
		path: `${appPages.inventoryPage.listPage.to}`,
		element: <InventoryListPage />,
	},
	{
		path: `${appPages.inventoryPage.editPageLink.to}`,
		element: <InventoryPage />,
	},
	{
		path: `${appPages.colorsPage.listPage.to}`,
		element: <ColorsListPage />,
	},
	{
		path: `${appPages.colorsPage.editPageLink.to}`,
		element: <ColorsPage />,
	},
	{
		path: `${appPages.coatingPage.listPage.to}`,
		element: <CoatingListPage />,
	},
	{
		path: `${appPages.coatingPage.editPageLink.to}`,
		element: <CoatingPage />,
	},
	{
		path: `${appPages.jobsPage.listPage.to}`,
		element: <JobsListPage />,
	},
	{
		path: `${appPages.jobsPage.editPageLink.to}`,
		element: <JobsPage />,
	},
	// { path: authPages.loginPage.to, element: <LoginPage /> },
	// { path: authPages.signUpPage.to, element: <SignupPage /> },

	{ path: '*', element: <NotFoundPage /> },
];

export default contentRoutes;
