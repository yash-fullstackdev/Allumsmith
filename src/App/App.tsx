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
import { ClerkProvider, useUser } from '@clerk/clerk-react';
import FullScreenLoader from '../components/layouts/common/FullScreenLoader';
import { shouldRedirectOrShowLoader } from '../utils/common.util';
import AuthRouter from '../components/router/AuthRouter';

const App = () => {
	const navigate = useNavigate();
	getOS();

	const { fontSize } = useFontSize();

	return (
		<>
			<style>{`:root {font-size: ${fontSize}px}`}</style>
			<div data-component-name='App' className='flex grow flex-col'>
				<ClerkProvider
					routerPush={(to) => navigate(to)}
					routerReplace={(to) => navigate(to, { replace: true })}
					appearance={{
						elements: {
							footer: 'hidden',
						},
						variables: {
							colorPrimary: 'hsl(263.4, 70%, 50.4%)',
						},
					}}
					publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY}>
					<AuthRouter />
					<AsideRouter />
					<Wrapper>
						<ToastContainer />
						<HeaderRouter />
						<ContentRouter />
						<FooterRouter />
					</Wrapper>
				</ClerkProvider>
			</div>
		</>
	);
};

export default App;
