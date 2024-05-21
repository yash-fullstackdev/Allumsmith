import React, { useCallback, useEffect, useState } from 'react';
import PageWrapper from '../components/layouts/PageWrapper/PageWrapper';
import { DeliveryMan5WithDog } from '../assets/images';
import Container from '../components/layouts/Container/Container';

import { useLocation } from 'react-router-dom';

const NotFoundPage = () => {
	const pathName = useLocation()
	const [userName, setuserName] = useState<string>('');

	const getuserName = useCallback(() => {
		setTimeout(() => {
			setuserName(`Welcome ${localStorage.getItem('firstName')} ${localStorage.getItem('lastName')}`);
		}, 2000)
	}, [])

	useEffect(() => {
		getuserName();
	}, [getuserName]);

	return (
		(pathName.pathname.includes("login") || pathName.pathname.includes("signup")) || pathName.pathname.includes("/") && < PageWrapper isProtectedRoute={false} >
			< Container className='flex h-full items-center justify-center' >
				<div className='grid grid-cols-12 gap-4'>
					<div className='col-span-12 mb-16 flex flex-wrap justify-center gap-4'>
						<div className='flex basis-full justify-center'>
							<span className='text-5xl font-semibold'>Welcome</span>
						</div>
						<div className='flex basis-full justify-center'>
							{/* <span className='text-zinc-500'>Welcome user</span> */}
						</div>
					</div>
					<div className='col-span-3' />
					<div className='col-span-6 flex justify-center'>
						<img src={DeliveryMan5WithDog as string} alt='' className='max-h-[32rem]' />
					</div>
				</div>
			</Container >
		</PageWrapper >

	);
};

export default NotFoundPage;
