import React, { SVGProps } from 'react';

const SvgHanger = (props: SVGProps<SVGSVGElement>) => {
	return (
		<svg viewBox='0 0 24 24' className='svg-icon' {...props}>
			<g fill='none' fillRule='evenodd'>
				<path d='M0 0h24v24H0z' />
				<path
					d='M18.264 18L9.91 10.95a3.944 3.944 0 012.272-6.948 3.61 3.61 0 012.731 6.222l-1.375-1.452a1.61 1.61 0 00-1.218-2.774 1.944 1.944 0 00-1.12 3.424l9.4 7.932A1.5 1.5 0 0119.632 20H4.027a1.5 1.5 0 01-.887-2.71l6.269-4.596 1.182 1.612L5.555 18h12.71z'
					fill='currentColor'
				/>
			</g>
		</svg>
	);
};

export default SvgHanger;
