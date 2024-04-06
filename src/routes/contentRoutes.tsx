import { RouteProps } from 'react-router-dom';
import { appPages, authPages } from '../config/pages.config';
import NotFoundPage from '../pages/NotFound.page';
import ProductListPage from '../pages/crm/user/ProductListPage/ProductListPage';
import AddProductPage from '../pages/crm/user/ProductPage/AddProductPage';
import PurchaseOrderListPage from '../pages/crm/PurchaseOrder/PurchaseOrderListPage/PurchaseOrderListPage';
import PurchaseOrderPage from '../pages/crm/PurchaseOrder/PurchaseOrderPage/AddPurchaseOrderPage';
import CustomerOrderPage from '../pages/crm/CustomerOrder/CustomerOrderPage/AddCustomerOrderPage';
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
import WorkerListPage from '../pages/crm/Worker/WorkerListPage/WorkerListPage';
import WorkerPage from '../pages/crm/Worker/WorkerPage/WorkerPage';
import EditWorkerPage from '../pages/crm/Worker/WorkerPage/EditWorkerPage';
import CoatingListPage from '../pages/crm/Coating/CoatingListPage/CoatingListPage';
import CoatingPage from '../pages/crm/Coating/CoatingPage/CoatingPage';
import JobsListPage from '../pages/crm/Jobs/JobsListPage/JobsListPage';
import JobsPage from '../pages/crm/Jobs/JobsPage/JobsPage';
import EditProductPage from '../pages/crm/user/ProductPage/EditProductPage';
import EditVendorPage from '../pages/crm/Vendors/VendorPage/EditVendorPage';
import EditBranchPage from '../pages/crm/Branches/BranchesPage/EditBranchPage';
import EditColorPage from '../pages/crm/Colors/ColorsPage/EditColorPage';
import EditCoatingPage from '../pages/crm/Coating/CoatingPage/EditCoatingPage';
import EditCustomerPage from '../pages/crm/Customer/CustomerPage/EditCustomerPage';
import FinishInventoryListPage from '../pages/crm/FinishInventory/FInishInventoryListPage/FinishInventoryListPage';
import CustomerOrderListPage from '../pages/crm/CustomerOrder/CustomerOrderListPage/CustomerOrderListPage';
import PowderPage from '../pages/crm/Powder/PowderPage/PowderPage';
import InvoiceListPage from '../pages/crm/Invoice/InvoiceListpage/InvoiceListPage';
import AddInvoice from '../pages/crm/Invoice/InvoicePage/AddInvoice';
import EditInvoice from '../pages/crm/Invoice/InvoicePage/EditInvoice';
import EditJobPage from '../pages/crm/Jobs/JobsPage/EditJobPage';


const contentRoutes: RouteProps[] = [

	{
		path: appPages.productPage.listPage.to,
		element: <ProductListPage />,
	},

	{
		path: `${appPages.productPage.addPageLink.to}`,
		element: <AddProductPage />,
	},
	{
		path: `${appPages.productPage.editPageLink.to}/:id`,
		element: <EditProductPage />,
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
		path: `${appPages.customerOrderPage.listPage.to}`,
		element: <CustomerOrderListPage />,
	},
	{
		path: `${appPages.customerOrderPage.addPageLink.to}`,
		element: <CustomerOrderPage />,
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
		path: `${appPages.workerPage.listPage.to}`,
		element: <WorkerListPage />,
	},
	{
		path: `${appPages.workerPage.editPageLink.to}/:id`,
		element: <EditWorkerPage />,
	},
	{
		path: `${appPages.workerPage.addPageLink.to}`,
		element: <WorkerPage />,
	},
	{
		path: `${appPages.vendorPage.addPageLink.to}`,
		element: <VendorPage />,
	},
	{
		path: `${appPages.vendorPage.editPageLink.to}/:id`,
		element: <EditVendorPage />,
	},
	{
		path: `${appPages.customerPage.addPageLink.to}`,
		element: <CustomerPage />,
	},

	{
		path: `${appPages.customerPage.editPageLink.to}/:id`,
		element: <EditCustomerPage />,
	},
	{
		path: `${appPages.branchesPage.listPage.to}`,
		element: <BranchesListPage />,
	},
	{
		path: `${appPages.branchesPage.addPageLink.to}`,
		element: <BranchesPage />,
	},
	{
		path: `${appPages.branchesPage.editPageLink.to}/:id`,
		element: <EditBranchPage />,
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
		path: `${appPages.finishInventory.listPage.to}`,
		element: <FinishInventoryListPage />,
	},
	{
		path: `${appPages.colorsPage.listPage.to}`,
		element: <ColorsListPage />,
	},
	{
		path: `${appPages.colorsPage.addPageLink.to}`,
		element: <ColorsPage />,
	},
	{
		path: `${appPages.colorsPage.editPageLink.to}/:id`,
		element: <EditColorPage />,
	},
	{
		path: `${appPages.coatingPage.listPage.to}`,
		element: <CoatingListPage />,
	},
	{
		path: `${appPages.coatingPage.addPageLink.to}`,
		element: <CoatingPage />,
	},
	{
		path: `${appPages.coatingPage.editPageLink.to}/:id`,
		element: <EditCoatingPage />,
	},
	{
		path: `${appPages.jobsPage.listPage.to}`,
		element: <JobsListPage />,
	},
	{
		path: `${appPages.jobsPage.addPageLink.to}`,
		element: <JobsPage />,
	},
	{
		path: `${appPages.jobsPage.editPageLink.to}/:id`,
		element: <EditJobPage />,
	},
	{
		path: `${appPages.powderPage.listPage.to}`,
		element: <PowderPage />,
	},
	{
		path: `${appPages.invoicePage.listPage.to}`,
		element: <InvoiceListPage />,
	},
	{
		path: `${appPages.invoicePage.addPageLink.to}`,
		element: <AddInvoice />,
	},
	{
		path: `${appPages.invoicePage.editPageLink.to}`,
		element: <EditInvoice />,
	},
	// { path: authPages.loginPage.to, element: <LoginPage /> },
	// { path: authPages.signUpPage.to, element: <SignupPage /> },

	{ path: '*', element: <NotFoundPage /> },
];

export default contentRoutes;
