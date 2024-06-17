export const appPages: any = {
	adminPage: {
		userPermissionPage: {
			id: 'permissionPage',
			to: '/add-users-permissions',
			text: 'Users Permissions',
			icon: 'DuoKey',
		},
		identifier: 'user-permissions',
	},
	productPage: {
		listPage: {
			id: 'productPage',
			to: '/product',
			text: 'Product',
			icon: 'DuoBox3',
		},
		addPageLink: {
			id: 'addPageLink',
			to: '/add-product',
		},
		editPageLink: {
			id: 'editPageLink',
			to: '/edit-product',
		},
		identifier: 'product',
	},
	purchaseOrderPage: {
		listPage: {
			id: 'purchaseOrderPage',
			to: '/purchase-order',
			text: 'Purchase Order',
			icon: 'DuoCart1',
		},
		addPageLink: {
			id: 'addPageLink',
			to: '/add-purchase-order',
		},
		editPageLink: {
			id: 'editPageLink',
			to: '/edit-purchase-order',
		},
		identifier: 'purchase-order',
	},

	vendorPage: {
		listPage: {
			id: 'vendorsPage',
			to: '/vendor',
			text: 'Vendor',
			icon: 'HeroUserCircle',
		},
		addPageLink: {
			id: 'addPageLink',
			to: '/add-vendor',
		},
		editPageLink: {
			id: 'editPageLink',
			to: '/edit-vendor',
		},
		identifier: 'vendor',
	},
	customerPage: {
		listPage: {
			id: 'customerPage',
			to: '/customer',
			text: 'Customer',
			icon: 'HeroUsers',
		},
		addPageLink: {
			id: 'addPageLink',
			to: '/add-customer',
		},
		editPageLink: {
			id: 'editPageLink',
			to: '/edit-customer',
		},
		identifier: 'customer',
	},
	workerPage: {
		listPage: {
			id: 'workerPage',
			to: '/worker',
			text: 'Worker',
			icon: 'HeroUserGroup',
		},
		addPageLink: {
			id: 'addPageLink',
			to: '/add-worker',
		},
		editPageLink: {
			id: 'editPageLink',
			to: '/edit-worker',
		},
		identifier: 'worker',
	},
	powderPage: {
		listPage: {
			id: 'powderPage',
			to: '/raw-material',
			text: 'Raw material',
			icon: 'DuoOption',
		},
		identifier: 'raw-material',
	},
	branchesPage: {
		listPage: {
			id: 'branchesPage',
			to: '/branches',
			text: 'Branches',
			icon: 'HeroBuildingOffice2',
		},
		addPageLink: {
			id: 'addPageLink',
			to: '/add-branches',
		},
		editPageLink: {
			id: 'editPageLink',
			to: '/edit-branches',
		},
		identifier: 'branches',
	},
	colorsPage: {
		listPage: {
			id: 'colorsPage',
			to: '/colors',
			text: 'Colors',
			icon: 'DuoColor',
		},
		addPageLink: {
			id: 'addPageLink',
			to: '/add-colors',
		},
		editPageLink: {
			id: 'editPageLink',
			to: '/edit-colors',
		},
		// editPageLink: {
		// 	id: 'editPageLink',
		// 	to: '/add-colors',
		// },
		identifier: 'colors',
	},
	coatingPage: {
		listPage: {
			id: 'coatingPage',
			to: '/coating',
			text: 'Coating',
			icon: 'DuoBox2',
		},
		addPageLink: {
			id: 'addPageLink',
			to: '/add-coating',
		},
		editPageLink: {
			id: 'editPageLink',
			to: '/edit-coating',
		},
		identifier: 'coating',
	},
	jobsPage: {
		listPage: {
			id: 'jobsPage',
			to: '/jobs',
			text: 'Jobs',
			icon: 'HeroWrenchScrewdriver',
		},
		addPageLink: {
			id: 'addPageLink',
			to: '/add-jobs',
		},
		editPageLink: {
			id: 'editPageLink',
			to: '/edit-jobs',
		},
		editwihtoutPageLink: {
			id: 'editwihtoutPageLink',
			to: '/edit-jobs-withoutmaterial',
		},
		identifier: 'jobs',
	},

	customerOrderPage: {
		listPage: {
			id: 'OrderPage',
			to: '/cuo-order',
			text: 'Customer Order',
			icon: 'HeroShoppingBag',
		},
		addPageLink: {
			id: 'addPageLink',
			to: '/add-cuo-order',
		},
		editPageLink: {
			id: 'editPageLink',
			to: '/edit-cuo-order',
		},
		identifier: 'cuo',
	},

	inventoryPage: {
		listPage: {
			id: 'inventoryPage',
			to: '/inventory',
			text: 'Inventory',
			icon: 'HeroHomeModern',
		},
		editPageLink: {
			id: 'editPageLink',
			to: '/add-inventory',
		},
		identifier: 'inventory',
	},
	finishInventory: {
		listPage: {
			id: 'finishInventory',
			to: '/finish-storage',
			text: 'Finish Inventory',
			icon: 'HeroTruck',
		},
		editPageLink: {
			id: 'editPageLink',
			to: '/add-storage',
		},
		identifier: 'storage',
	},
	invoicePage: {
		listPage: {
			id: 'invoice',
			to: '/invoice-list',
			text: 'Invoice List',
			icon: 'HeroReceiptPercent',
		},
		addPageLink: {
			id: 'addPageLink',
			to: '/add-invoice',
		},
		editPageLink: {
			id: 'editPageLink',
			to: '/edit-invoice',
		},
		identifier: 'invoice',
	},
	ledgerPage: {
		listPage: {
			id: 'ledger',
			to: '/ledger-list',
			text: 'Ledger List',
			icon: 'HeroReceiptPercent',
		},
		addPageLink: {
			id: 'addPageLink',
			to: '/add-ledger',
		},
		editPageLink: {
			id: 'editPageLink',
			to: '/edit-ledger',
		},
		identifier: 'ledger',
	},
	payment: {
		listPage: {
			id: 'payment',
			to: '/add-payment',
			text: 'Payment',
			icon: 'HeroReceiptPercent',
		},
		addPageLink: {
			id: 'addPageLink',
			to: '/add-payment',
		},
		identifier: 'payment',
	},
	projectAppPages: {
		subPages: {
			projectDashboardPage: {
				id: 'projectDashboardPage',
				to: '/project/dashboard',
				text: 'Projects Dashboard',
				icon: 'HeroClipboardDocumentCheck',
			},

			projectBoardPageLink: {
				id: 'projectBoardPageLink',
				to: '/project/board',
			},
		},
	},

	mailAppPages: {
		// id: 'mailApp',
		// to: '/mail',
		// text: 'Mail',
		// icon: 'HeroEnvelope',
		subPages: {
			inboxPages: {
				id: 'inboxPages',
				to: '/mail/inbox',
				text: 'Inbox',
				icon: 'HeroEnvelope',
			},
		},
	},
};

export const authPages = {
	loginPage: {
		id: 'loginPage',
		to: '/sign-in/*',
		text: 'Login',
		icon: 'HeroArrowRightOnRectangle',
	},
	profilePage: {
		id: 'profilePage',
		to: '/profile',
		text: 'Profile',
		icon: 'HeroUser',
	},
	resetPage: {
		id: 'restePage',
		to: '/reset',
		text: 'Reset',
		icon: 'HeroArrowRightOnRectangle',
	},
	signUpPage: {
		id: 'signupPage',
		to: '/sign-up/*',
		text: 'signup',
		icon: 'HeroArrowRightOnRectangle',
	},
};

const pagesConfig = {
	// ...examplePages,
	...authPages,
};

export default pagesConfig;
