import React, { Suspense } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import contentRoutes from '../../routes/contentRoutes';
import PageWrapper from '../layouts/PageWrapper/PageWrapper';
import Container from '../layouts/Container/Container';
import Subheader, { SubheaderLeft, SubheaderRight } from '../layouts/Subheader/Subheader';
import Header, { HeaderLeft, HeaderRight } from '../layouts/Header/Header';
import Card from '../ui/Card';
import useAllowedRoutes from '../../hooks/useAllowedRoutes';
import NotFoundPage from '../../pages/NotFound.page';
import UsersPermissionPage from '../../pages/crm/PermissionPage/UsersPermissionPage/UsersPermissionPage';
import { useUser } from '@clerk/clerk-react';
import { admins } from '../../constants/common/data';
import UserListPage from '../../pages/crm/PermissionPage/UserListPage/UserListPage';

const ContentRouter = () => {
	let allowedRoutes: any = useAllowedRoutes(contentRoutes, true);
	const { pathname }: any = useLocation();
	const { user }: any = useUser();
	localStorage.setItem('userId', user?.id);

	if (admins.includes(user?.emailAddresses[0]?.emailAddress)) {
		allowedRoutes?.unshift({
			path: '/add-users-permissions',
			element: <UsersPermissionPage />,
		});
		allowedRoutes?.unshift({
			path: '/users',
			element: <UserListPage />,
		});
	}

	// Determine if the current route matches any allowed route
	const isCurrentRouteAllowed = allowedRoutes.some((route: any) => {
		const pathRegex = new RegExp(`^${route.path.replace(/:[^\s/]+/g, '[^/]+')}`);
		return pathRegex.test(pathname);
	});

	// If current route is not allowed, redirect to NotFoundPage
	if (!isCurrentRouteAllowed) {
		return <NotFoundPage />;
	}

	return (
		<Suspense
			fallback={
				<>
					<Header>
						<HeaderLeft>
							<div className='h-10 w-40 animate-pulse rounded-full bg-zinc-800/25 dark:bg-zinc-200/25' />
						</HeaderLeft>
						<HeaderRight>
							<div className='flex gap-4'>
								<div className='h-10 w-10 animate-pulse rounded-full bg-zinc-800/25 dark:bg-zinc-200/25' />
								<div className='h-10 w-10 animate-pulse rounded-full bg-zinc-800/25 dark:bg-zinc-200/25' />
								<div className='h-10 w-10 animate-pulse rounded-full bg-zinc-800/25 dark:bg-zinc-200/25' />
							</div>
						</HeaderRight>
					</Header>
					<PageWrapper>
						<Subheader>
							<SubheaderLeft>
								<div className='h-10 w-40 animate-pulse rounded-full bg-zinc-800/25 dark:bg-zinc-200/25' />
							</SubheaderLeft>
							<SubheaderRight>
								<div className='h-10 w-40 animate-pulse rounded-full bg-zinc-800/25 dark:bg-zinc-200/25' />
							</SubheaderRight>
						</Subheader>
						<Container>
							<div className='grid grid-cols-12 gap-4'>
								<div className='col-span-3'>
									<Card className='h-[15vh] animate-pulse'>
										<div className='invisible'>Loading...</div>
									</Card>
								</div>
								<div className='col-span-3 '>
									<Card className='h-[15vh] animate-pulse'>
										<div className='invisible'>Loading...</div>
									</Card>
								</div>
								<div className='col-span-3'>
									<Card className='h-[15vh] animate-pulse'>
										<div className='invisible'>Loading...</div>
									</Card>
								</div>
								<div className='col-span-3'>
									<Card className='h-[15vh] animate-pulse'>
										<div className='invisible'>Loading...</div>
									</Card>
								</div>

								<div className='col-span-6'>
									<Card className='h-[50vh] animate-pulse'>
										<div className='invisible'>Loading...</div>
									</Card>
								</div>
								<div className='col-span-6'>
									<Card className='h-[50vh] animate-pulse'>
										<div className='invisible'>Loading...</div>
									</Card>
								</div>

								<div className='col-span-12'>
									<Card className='h-[15vh] animate-pulse'>
										<div className='invisible'>Loading...</div>
									</Card>
								</div>
							</div>
						</Container>
					</PageWrapper>
				</>
			}>
			<Routes>
				{allowedRoutes.map((routeProps: any, index: any) => (
					<Route key={`${routeProps.path}-${index}`} {...routeProps} />
				))}
			</Routes>
		</Suspense>
	);
};

export default ContentRouter;
