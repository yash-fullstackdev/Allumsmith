export const appPages: any = {
	productPage: {
		listPage: {
			id: 'productPage',
			to: '/product',
			text: 'Product',
			// icon: 'HeroQueueList',
			icon: 'HeroUserCircle',
		},
		editPageLink: {
			id: 'editPageLink',
			to: '/add-product',
		},
	},
	purchaseOrderPage: {
		listPage: {
			id: 'purchaseOrderPage',
			to: '/purchase-order',
			text: 'Purchase Order',
			// icon: 'HeroQueueList',
			icon: 'HeroUserCircle',
		},
		editPageLink: {
			id: 'editPageLink',
			to: '/add-purchase-order',
		},
	},
	// purchaseEntry: {
	// 	listPage: {
	// 		id: 'purchaseEntry',
	// 		to: '/purchase-entry',
	// 		text: 'Purchase Entry',
	// 		// icon: 'HeroQueueList',
	// 		icon: 'HeroUserCircle',
	// 	},
	// 	editPageLink: {
	// 		id: 'editPageLink',
	// 		to: '/add-purchase-entry',
	// 	},
	// },
	vendorPage: {
		listPage: {
			id: 'vendorsPage',
			to: '/vendor',
			text: 'Vendor',
			// icon: 'HeroQueueList',
			icon: 'HeroUserCircle',
		},
		editPageLink: {
			id: 'editPageLink',
			to: '/add-vendor',
		},
	},
	customerPage: {
		listPage: {
			id: 'customerPage',
			to: '/customer',
			text: 'Customer',
			// icon: 'HeroQueueList',
			icon: 'HeroUserCircle',
		},
		editPageLink: {
			id: 'editPageLink',
			to: '/add-customer',
		},
	},
	branchesPage: {
		listPage: {
			id: 'branchesPage',
			to: '/branches',
			text: 'Branches',
			// icon: 'HeroQueueList',
			icon: 'HeroUserCircle',
		},
		editPageLink: {
			id: 'editPageLink',
			to: '/add-branches',
		},
	},
	colorsPage: {
		listPage: {
			id: 'colorsPage',
			to: '/colors',
			text: 'Colors',
			// icon: 'HeroQueueList',
			icon: 'HeroUserCircle',
		},
		editPageLink: {
			id: 'editPageLink',
			to: '/add-colors',
		},
	},
	coatingPage: {
		listPage: {
			id: 'coatingPage',
			to: '/coating',
			text: 'Coating',
			// icon: 'HeroQueueList',
			icon: 'HeroUserCircle',
		},
		editPageLink: {
			id: 'editPageLink',
			to: '/add-coating',
		},
	},

	inventoryPage: {
		listPage: {
			id: 'inventoryPage',
			to: '/inventory',
			text: 'Inventory',
			// icon: 'HeroQueueList',
			icon: 'HeroUserCircle',
		},
		editPageLink: {
			id: 'editPageLink',
			to: '/add-inventory',
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
