import React, { SVGProps } from 'react';

const SvgGroup = (props: SVGProps<SVGSVGElement>) => {
	return (
		<svg viewBox='0 0 24 24' className='svg-icon' {...props}>
			<g fill='none' fillRule='evenodd'>
				<path d='M0 0h24v24H0z' />
				<path
					d='M18 14a3 3 0 110-6 3 3 0 010 6zm-9-3a4 4 0 110-8 4 4 0 010 8z'
					fill='currentColor'
					opacity={0.3}
				/>
				<path
					d='M17.601 15c3.407.038 6.188 1.76 6.397 5.4.009.147 0 .6-.542.6H19.6c0-2.25-.744-4.328-1.999-6zm-17.6 5.2C.388 15.426 4.26 13 8.983 13c4.788 0 8.722 2.293 9.015 7.2.012.195 0 .8-.751.8H.727c-.25 0-.747-.54-.726-.8z'
					fill='currentColor'
				/>
			</g>
		</svg>
	);
};

export default SvgGroup;
