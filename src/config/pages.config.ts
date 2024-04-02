export const appPages: any = {
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
	},
	purchaseOrderPage: {
		listPage: {
			id: 'purchaseOrderPage',
			to: '/purchase-order',
			text: 'Purchase Order',
			icon: 'DuoCart1',
		},
		editPageLink: {
			id: 'editPageLink',
			to: '/add-purchase-order',
		},
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
	},
	powderPage: {
		listPage: {
			id: 'powderPage',
			to: '/powder',
			text: 'Powder',
			icon: 'DuoOption',
		}
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
	},
	jobsPage: {
		listPage: {
			id: 'jobsPage',
			to: '/jobs',
			text: 'Jobs',
			icon: 'HeroWrenchScrewdriver',
		},
		addPageLink:{
			id:'addPageLink',
			to:'/add-jobs'
		},
		editPageLink: {
			id: 'editPageLink',
			to: '/edit-jobs',
		},
	},

	customerOrderPage: {
		listPage: {
			id: 'customerOrderPage',
			to: '/customer-order',
			text: 'Customer Order',
			icon: 'HeroShoppingBag',
		},
		addPageLink: {
			id: 'addPageLink',
			to: '/add-customer-order',
		},
		editPageLink: {
			id: 'editPageLink',
			to: '/edit-customer-order',
		},
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
	},
	finishInventory: {
		listPage: {
			id: 'finishInventory',
			to: '/finish-inventory',
			text: 'Finish Inventory',
			icon: 'HeroTruck',
		},
		editPageLink: {
			id: 'editPageLink',
			to: '/add-inventory',
		},
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
		to: '/login',
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
		to: '/signup',
		text: 'signup',
		icon: 'HeroArrowRightOnRectangle',
	},
};

const pagesConfig = {
	// ...examplePages,
	...authPages,
};

export default pagesConfig;
