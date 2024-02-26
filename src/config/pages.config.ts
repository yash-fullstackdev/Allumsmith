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
