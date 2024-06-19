export const shouldRedirectOrShowLoader = (
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

export const getAllInnerPages = (pageId: any, appPages: any) => {
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
