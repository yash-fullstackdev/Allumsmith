import React, { SVGProps } from 'react';

const SvgHorizontal = (props: SVGProps<SVGSVGElement>) => {
	return (
		<svg viewBox='0 0 24 24' className='svg-icon' {...props}>
			<g fill='none' fillRule='evenodd'>
				<path d='M0 0h24v24H0z' />
				<path
					d='M21 12a1 1 0 01-1 1h-1a1 1 0 010-2h1a1 1 0 011 1zm-5 0a1 1 0 01-1 1h-1a1 1 0 010-2h1a1 1 0 011 1zm-5 0a1 1 0 01-1 1H9a1 1 0 010-2h1a1 1 0 011 1zm-5 0a1 1 0 01-1 1H4a1 1 0 010-2h1a1 1 0 011 1z'
					fill='currentColor'
				/>
				<path
					d='M14.96 21H9.04a.5.5 0 01-.39-.812l2.96-3.7a.5.5 0 01.78 0l2.96 3.7a.5.5 0 01-.39.812zM9.04 3h5.92a.5.5 0 01.39.812l-2.96 3.7a.5.5 0 01-.78 0l-2.96-3.7A.5.5 0 019.04 3z'
					fill='currentColor'
					opacity={0.3}
				/>
			</g>
		</svg>
	);
};

export default SvgHorizontal;
