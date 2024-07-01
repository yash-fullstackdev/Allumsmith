interface SvgProps {
	height?: string;
	width?: string;
	color?: string;
}

const CloseIcon = ({ width = '30%', height = '30%', color = 'red' }: SvgProps) => {
	return (
		<svg
			width={width}
			height={height}
			viewBox='0 0 24 24'
			fill={color}
			xmlns='http://www.w3.org/2000/svg'>
			<path
				d='M18 6L6 18M6 6L18 18'
				stroke='red'
				stroke-width='2'
				stroke-linecap='round'
				stroke-linejoin='round'
			/>
		</svg>
	);
};

export default CloseIcon;
