import React, { SVGProps } from 'react';

const SvgStrikethrough = (props: SVGProps<SVGSVGElement>) => {
	return (
		<svg viewBox='0 0 24 24' className='svg-icon' {...props}>
			<g fill='none' fillRule='evenodd'>
				<path d='M0 0h24v24H0z' />
				<rect fill='currentColor' opacity={0.3} x={4} y={11} width={17} height={2} rx={1} />
				<path
					d='M12.06 19.16c-2.06 0-3.78-1-4.62-2.2l1.38-1.2c.68.88 1.84 1.66 3.22 1.66 1.64 0 2.68-.76 2.68-2 0-1.3-.8-1.98-2.32-2.64l-1.3-.56C8.94 11.3 8 9.98 8 8.2c0-2.16 2.04-3.56 4.14-3.56 1.66 0 3.02.66 3.98 1.82l-1.28 1.28c-.74-.88-1.52-1.36-2.76-1.36-1.2 0-2.26.68-2.26 1.86 0 1.04.6 1.74 2.1 2.4l1.3.56c1.92.84 3.34 2.02 3.34 4.02 0 2.32-1.72 3.94-4.5 3.94z'
					fill='currentColor'
				/>
			</g>
		</svg>
	);
};

export default SvgStrikethrough;
