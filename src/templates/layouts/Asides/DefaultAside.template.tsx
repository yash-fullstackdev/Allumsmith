import Aside, { AsideBody, AsideFooter, AsideHead } from '../../../components/layouts/Aside/Aside';
import LogoAndAsideTogglePart from './_parts/LogoAndAsideToggle.part';
import DarkModeSwitcherPart from './_parts/DarkModeSwitcher.part';
import { appPages } from '../../../config/pages.config';
import Nav, { NavItem, NavTitle } from '../../../components/layouts/Navigation/Nav';
import { UserButton, useClerk, useUser } from '@clerk/clerk-react';
import { useLocation } from 'react-router-dom';
import useAllowedRoutes from '../../../hooks/useAllowedRoutes';

const DefaultAsideTemplate = () => {
	const location = useLocation();
	const currentPath = location.pathname;
	const { openUserProfile, signOut } = useClerk();
	const { user } = useUser();

	// Filter allowed routes based on permissions
	const allowedRoutes = useAllowedRoutes(Object.values(appPages));

	if (currentPath.startsWith('/sign-in') || currentPath.startsWith('/sign-up')) {
		return null;
	}

	return (
		<Aside>
			<AsideHead>
				<LogoAndAsideTogglePart />
			</AsideHead>
			<AsideBody>
				<Nav>
					<NavTitle>Module</NavTitle>
					{allowedRoutes.map((page: any, index: any) => (
						<NavItem key={index} {...page.listPage} identifier={page.identifier} />
					))}
				</Nav>
			</AsideBody>

			<AsideFooter>
				<div className='hover:black my-3 ml-3 flex cursor-pointer items-center gap-3 overflow-hidden text-zinc-500 '>
					<UserButton afterSignOutUrl='/sign-in' />
					<span onClick={() => openUserProfile()}>{user?.fullName}</span>
				</div>
				{/* <NavItem text='Logout' icon='HeroArrowRightOnRectangle' onClick={() => signOut()} /> */}
				<DarkModeSwitcherPart />
			</AsideFooter>
		</Aside>
	);
};

export default DefaultAsideTemplate;
