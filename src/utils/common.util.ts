const shouldRedirectOrShowLoader = (
	isSignedIn: boolean | undefined,
	isLoading: boolean,
	pathName: any,
): boolean => {
	return (
		!isSignedIn &&
		!isLoading &&
		!pathName.pathname.startsWith('/sign-in') &&
		!pathName.pathname.startsWith('/sign-up')
	);
};

const togglePermissionAndUpdateInnerPages = (pageId: any, prevPermissions: any, appPages: any) => {
	let updatedPermissions = {
		...prevPermissions,
		[pageId.to]: !prevPermissions[pageId.to],
	};

	// Allow all inner routes if the parent route is allowed
	if (updatedPermissions[pageId.to]) {
		const pagesToUpdate = getAllInnerPages(pageId, appPages);
		pagesToUpdate.forEach((page: any) => {
			updatedPermissions = {
				...updatedPermissions,
				[page]: true,
			};
		});
	}

	return updatedPermissions;
};
const getAllInnerPages = (pageId: any, appPages: any) => {
	const page = appPages[pageId.appKey];
	if (page) {
		const innerPages = Object.values(page).reduce((acc: string[], childRoutes: any) => {
			if (typeof childRoutes === 'object' && childRoutes.to) {
				acc.push(childRoutes.to);
			}
			return acc;
		}, []);
		return innerPages;
	}
	return [];
};

const filterPermissions = (data: any) => {
	return Object.fromEntries(Object.entries(data).filter(([_, value]) => value === true));
};

export {
	togglePermissionAndUpdateInnerPages,
	filterPermissions,
	getAllInnerPages,
	shouldRedirectOrShowLoader,
};
