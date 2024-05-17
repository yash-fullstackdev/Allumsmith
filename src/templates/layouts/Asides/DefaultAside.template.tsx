import Aside, { AsideBody, AsideFooter, AsideHead } from '../../../components/layouts/Aside/Aside';
import LogoAndAsideTogglePart from './_parts/LogoAndAsideToggle.part';
import DarkModeSwitcherPart from './_parts/DarkModeSwitcher.part';
import { appPages } from '../../../config/pages.config';
import Nav, {
	NavItem,
	NavTitle,
} from '../../../components/layouts/Navigation/Nav';
import UserTemplate from '../User/User.template';


const DefaultAsideTemplate = () => {

	return (
		<Aside>
			<AsideHead>
				<LogoAndAsideTogglePart />
			</AsideHead>
			<AsideBody>
				<Nav>
					<NavTitle>Module</NavTitle>
					<NavItem {...appPages.productPage.listPage} />
					<NavItem {...appPages.vendorPage.listPage} />
					<NavItem {...appPages.branchesPage.listPage} />
					<NavItem {...appPages.purchaseOrderPage.listPage} />
					<NavItem {...appPages.colorsPage.listPage} />
					<NavItem {...appPages.coatingPage.listPage} />
					<NavItem {...appPages.customerPage.listPage} />
					<NavItem {...appPages.customerOrderPage.listPage} />
					<NavItem {...appPages.jobsPage.listPage} />
					<NavItem {...appPages.invoicePage.listPage} />
					<NavItem {...appPages.ledgerPage.listPage} />
					{/* <NavItem {...appPages.purchaseEntry.listPage} /> */}
					<NavItem {...appPages.inventoryPage.listPage} />
					<NavItem {...appPages.finishInventory.listPage} />
					<NavItem {...appPages.powderPage.listPage} />
					<NavItem {...appPages.workerPage.listPage} />
				</Nav>
			</AsideBody>
			<AsideFooter>
				{/* <UserTemplate /> */}
				<DarkModeSwitcherPart />
			</AsideFooter>
		</Aside>
	);
};

export default DefaultAsideTemplate;
