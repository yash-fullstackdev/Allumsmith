import React, { useEffect } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import asideRoutes from '../../routes/asideRoutes';
import { shouldRedirectOrShowLoader } from '../../utils/common.util';
import { useUser } from '@clerk/clerk-react';
import FullScreenLoader from '../layouts/common/FullScreenLoader';

const AsideRouter = () => {
	const navigate = useNavigate();
	const pathName = useLocation();
	const { isSignedIn, isLoaded, user }: any = useUser();
	localStorage.setItem('userId', user?.id);

	useEffect(() => {
		if (shouldRedirectOrShowLoader(isSignedIn, !isLoaded, pathName)) {
			navigate('/sign-in');
		}
	}, [isSignedIn, isLoaded, navigate, pathName]);
	if (
		!pathName.pathname.startsWith('/sign-in') &&
		!pathName.pathname.startsWith('/sign-up') &&
		!isLoaded
	) {
		return <FullScreenLoader />;
	}

	if (shouldRedirectOrShowLoader(isSignedIn, !isLoaded, pathName)) {
		return <FullScreenLoader />;
	}
	return (
		<Routes>
			{asideRoutes.map((routeProps) => (
				<Route key={routeProps.path} {...routeProps} />
			))}
		</Routes>
	);
};

export default AsideRouter;
