import { Link } from 'react-router-dom';
import PageWrapper from '../../../../components/layouts/PageWrapper/PageWrapper';
import Container from '../../../../components/layouts/Container/Container';
import { appPages } from '../../../../config/pages.config';
import Card, { CardBody } from '../../../../components/ui/Card';

import getUserRights from '../../../../hooks/useUserRights';

const privileges = getUserRights('mastersetting');

const MasterSettingsPage = () => {
	return privileges.canRead() ? (
		<PageWrapper name='Master Settings'>
			<Container>
				<div className='grid grid-cols-12 gap-4'>
					<div className='col-span-12 sm:col-span-6 lg:col-span-3'>
						<Link
							to={`../${appPages.masterSettingsAppPages.subPages.customerClassPage.to}`}>
							<Card className='cursor-pointer'>
								<CardBody>
									<div className='flex flex-col gap-2'>
										<div className='space-x-1 text-slate-500 hover:text-blue-500 rtl:space-x-reverse'>
											<span className='text-2xl font-medium'>
												Customer Class
											</span>
										</div>
									</div>
								</CardBody>
							</Card>
						</Link>
					</div>

					<div className='col-span-12 sm:col-span-6 lg:col-span-3'>
						<Link
							to={`../${appPages.masterSettingsAppPages.subPages.customerTypePage.to}`}>
							<Card className='cursor-pointer'>
								<CardBody>
									<div className='flex flex-col gap-2'>
										<div className='space-x-1 text-slate-500 hover:text-blue-500 rtl:space-x-reverse'>
											<span className='text-2xl font-medium'>
												Customer Type
											</span>
										</div>
									</div>
								</CardBody>
							</Card>
						</Link>
					</div>

					<div className='col-span-12 sm:col-span-6 lg:col-span-3'>
						<Link
							to={`../${appPages.masterSettingsAppPages.subPages.shippingMethodPage.to}`}>
							<Card className='cursor-pointer'>
								<CardBody>
									<div className='flex flex-col gap-2'>
										<div className='space-x-1 text-slate-500 hover:text-blue-500 rtl:space-x-reverse'>
											<span className='text-2xl font-medium'>
												Shipping Method
											</span>
										</div>
									</div>
								</CardBody>
							</Card>
						</Link>
					</div>

					<div className='col-span-12 sm:col-span-6 lg:col-span-3'>
						<Link to={`../${appPages.masterSettingsAppPages.subPages.termsPage.to}`}>
							<Card className='cursor-pointer'>
								<CardBody>
									<div className='flex flex-col gap-2'>
										<div className='space-x-1 text-slate-500 hover:text-blue-500 rtl:space-x-reverse'>
											<span className='text-2xl font-medium'>
												Payment Terms
											</span>
										</div>
									</div>
								</CardBody>
							</Card>
						</Link>
					</div>

					<div className='col-span-12 sm:col-span-6 lg:col-span-3'>
						<Link
							to={`../${appPages.masterSettingsAppPages.subPages.pricingTermsPage.to}`}>
							<Card className='cursor-pointer'>
								<CardBody>
									<div className='flex flex-col gap-2'>
										<div className='space-x-1 text-slate-500 hover:text-blue-500 rtl:space-x-reverse'>
											<span className='text-2xl font-medium'>
												Pricing Terms
											</span>
										</div>
									</div>
								</CardBody>
							</Card>
						</Link>
					</div>

					<div className='col-span-12 sm:col-span-6 lg:col-span-3'>
						<Link
							to={`../${appPages.masterSettingsAppPages.subPages.paymentMethodPage.to}`}>
							<Card className='cursor-pointer'>
								<CardBody>
									<div className='flex flex-col gap-2'>
										<div className='space-x-1 text-slate-500 hover:text-blue-500 rtl:space-x-reverse'>
											<span className='text-2xl font-medium'>
												Payment Method
											</span>
										</div>
									</div>
								</CardBody>
							</Card>
						</Link>
					</div>

					<div className='col-span-12 sm:col-span-6 lg:col-span-3'>
						<Link
							to={`../${appPages.masterSettingsAppPages.subPages.orderSourcePage.to}`}>
							<Card className='cursor-pointer'>
								<CardBody>
									<div className='flex flex-col gap-2'>
										<div className='space-x-1 text-slate-500 hover:text-blue-500 rtl:space-x-reverse'>
											<span className='text-2xl font-medium'>
												Order Source
											</span>
										</div>
									</div>
								</CardBody>
							</Card>
						</Link>
					</div>

					<div className='col-span-12 sm:col-span-6 lg:col-span-3'>
						<Link
							to={`../${appPages.masterSettingsAppPages.subPages.salesmanMaintenancePage.to}`}>
							<Card className='cursor-pointer'>
								<CardBody>
									<div className='flex flex-col gap-2'>
										<div className='space-x-1 text-slate-500 hover:text-blue-500 rtl:space-x-reverse'>
											<span className='text-2xl font-medium'>
												Salesman Maintenance
											</span>
										</div>
									</div>
								</CardBody>
							</Card>
						</Link>
					</div>
				</div>
			</Container>
		</PageWrapper>
	) : (
		<div className='flex h-screen items-center justify-center font-bold'>
			You Dont Have Permission to View the record
		</div>
	);
};

export default MasterSettingsPage;
