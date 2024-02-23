import React from 'react';
import dayjs from 'dayjs';
import Footer, { FooterLeft, FooterRight } from '../../../components/layouts/Footer/Footer';

const DefaultFooterTemplate = () => {
	return (
		<Footer>
			<FooterLeft className='text-zinc-500'>
				<div>Copyright © {dayjs().format('YYYY')}</div>
			</FooterLeft>
		</Footer>
	);
};

export default DefaultFooterTemplate;
