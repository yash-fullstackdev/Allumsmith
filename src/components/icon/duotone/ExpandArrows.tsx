import React, { SVGProps } from 'react';

const SvgExpandArrows = (props: SVGProps<SVGSVGElement>) => {
	return (
		<svg viewBox='0 0 24 24' className='svg-icon' {...props}>
			<g fill='none' fillRule='evenodd'>
				<path d='M0 0h24v24H0z' />
				<path
					d='M10.586 12L5.464 6.879A1 1 0 016.88 5.464L12 10.586l6.192-6.193a1 1 0 111.415 1.415L13.414 12l6.193 6.192a1 1 0 11-1.415 1.415L12 13.414l-5.121 5.122a1 1 0 11-1.415-1.415L10.586 12z'
					fill='currentColor'
					opacity={0.3}
				/>
				<path
					d='M6 18h3c.667.114 1 .448 1 1s-.333.886-1 1H4v-5c0-.667.333-1 1-1s1 .333 1 1v3zm12 0v-3c.114-.667.448-1 1-1s.886.333 1 1v5h-5c-.667 0-1-.333-1-1s.333-1 1-1h3zm0-12h-3c-.667-.114-1-.448-1-1s.333-.886 1-1h5v5c0 .667-.333 1-1 1s-1-.333-1-1V6zM6 6v3c-.114.667-.448 1-1 1s-.886-.333-1-1V4h5c.667 0 1 .333 1 1s-.333 1-1 1H6z'
					fill='currentColor'
				/>
			</g>
		</svg>
	);
};

export default SvgExpandArrows;
