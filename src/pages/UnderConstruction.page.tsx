import React from 'react';
import PageWrapper from '../components/layouts/PageWrapper/PageWrapper';
import Container from '../components/layouts/Container/Container';
import { DeliveryMan1 } from '../assets/images';

const UnderConstructionPage = () => {
	return (
		<PageWrapper name='Under Construction'>
			<Container className='flex h-full items-center justify-center'>
				<div className='grid grid-cols-12 gap-4'>
					<div className='col-span-12 mb-16 flex flex-wrap justify-center gap-4'>
						<div className='flex basis-full justify-center'>
							<span className='text-5xl font-semibold'>Under Construction</span>
						</div>
						<div className='flex basis-full justify-center'>
							<span className='text-zinc-500'>
								We are working to publish the page as soon as possible, if you want
								to support us, you can buy it now and share your suggestions with
								us.
							</span>
						</div>
					</div>
					<div className='col-span-3' />
					<div className='col-span-6 flex justify-center'>
						<img src={DeliveryMan1 as string} alt='' className='max-h-[32rem]' />
					</div>
				</div>
			</Container>
		</PageWrapper>
	);
};

export default UnderConstructionPage;
