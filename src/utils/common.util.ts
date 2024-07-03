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


export {
	shouldRedirectOrShowLoader,
};
