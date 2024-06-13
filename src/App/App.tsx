import React, { useEffect, useState } from 'react';
import { ToastContainer } from 'react-toastify';
import AsideRouter from '../components/router/AsideRouter';
import Wrapper from '../components/layouts/Wrapper/Wrapper';
import HeaderRouter from '../components/router/HeaderRouter';
import ContentRouter from '../components/router/ContentRouter';
import FooterRouter from '../components/router/FooterRouter';
import useFontSize from '../hooks/useFontSize';
import getOS from '../utils/getOS.util';
import { useLocation, useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { useUser } from '@clerk/clerk-react';
import FullScreenLoader from '../components/layouts/common/FullScreenLoader';
import { shouldRedirectOrShowLoader } from '../utils/common.util';

const App = () => {
	const navigate = useNavigate();
	const pathName = useLocation();
	const { isSignedIn, isLoaded } = useUser();
	getOS();

	const { fontSize } = useFontSize();

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
		<>
			<style>{`:root {font-size: ${fontSize}px}`}</style>
			<div data-component-name='App' className='flex grow flex-col'>
				<AsideRouter />
				<Wrapper>
					<ToastContainer />
					<HeaderRouter />
					<ContentRouter />
					<FooterRouter />
				</Wrapper>
			</div>
		</>
	);
};

export default App;
