import Aside, { AsideBody, AsideFooter, AsideHead } from '../../../components/layouts/Aside/Aside';
import LogoAndAsideTogglePart from './_parts/LogoAndAsideToggle.part';
import DarkModeSwitcherPart from './_parts/DarkModeSwitcher.part';
import { appPages } from '../../../config/pages.config';
import Nav, { NavItem, NavTitle } from '../../../components/layouts/Navigation/Nav';
import { UserButton, useClerk, useUser } from '@clerk/clerk-react';
import { useLocation } from 'react-router-dom';

const DefaultAsideTemplate = () => {
	const location = useLocation();
	const currentPath = location.pathname;
	const { openUserProfile, signOut } = useClerk();
	const { user } = useUser();

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
					<NavItem
						{...appPages.adminPage.userPermissionPage}
						identifier={appPages.adminPage.identifier}
					/>
					<NavItem
						{...appPages.productPage.listPage}
						identifier={appPages.productPage.identifier}
					/>
					<NavItem
						{...appPages.vendorPage.listPage}
						identifier={appPages.vendorPage.identifier}
					/>
					<NavItem
						{...appPages.branchesPage.listPage}
						identifier={appPages.branchesPage.identifier}
					/>
					<NavItem
						{...appPages.purchaseOrderPage.listPage}
						identifier={appPages.purchaseOrderPage.identifier}
					/>
					<NavItem
						{...appPages.colorsPage.listPage}
						identifier={appPages.colorsPage.identifier}
					/>
					<NavItem
						{...appPages.coatingPage.listPage}
						identifier={appPages.coatingPage.identifier}
					/>
					<NavItem
						{...appPages.customerPage.listPage}
						identifier={appPages.customerPage.identifier}
					/>
					<NavItem
						{...appPages.customerOrderPage.listPage}
						identifier={appPages.customerOrderPage.identifier}
					/>
					<NavItem
						{...appPages.jobsPage.listPage}
						identifier={appPages.jobsPage.identifier}
					/>
					<NavItem
						{...appPages.invoicePage.listPage}
						identifier={appPages.invoicePage.identifier}
					/>
					<NavItem
						{...appPages.ledgerPage.listPage}
						identifier={appPages.ledgerPage.identifier}
					/>
					{/* <NavItem {...appPages.purchaseEntry.listPage} /> */}
					<NavItem
						{...appPages.inventoryPage.listPage}
						identifier={appPages.inventoryPage.identifier}
					/>
					<NavItem
						{...appPages.finishInventory.listPage}
						identifier={appPages.finishInventory.identifier}
					/>
					<NavItem
						{...appPages.powderPage.listPage}
						identifier={appPages.powderPage.identifier}
					/>
					<NavItem
						{...appPages.workerPage.listPage}
						identifier={appPages.workerPage.identifier}
					/>
					<NavItem
						{...appPages.payment.listPage}
						identifier={appPages.payment.listPage}
					/>
				</Nav>
			</AsideBody>
			<AsideFooter>
				<div className='hover:black my-3 ml-3 flex  h-fit cursor-pointer items-center gap-3 overflow-hidden text-zinc-500 '>
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
