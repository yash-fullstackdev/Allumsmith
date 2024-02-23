import React, { FC, HTMLAttributes, ReactNode, useState } from 'react';
import classNames from 'classnames';
import { TColors } from '../../types/colors.type';
import { TColorIntensity } from '../../types/colorIntensities.type';
import themeConfig from '../../config/theme.config';
import { TIcons } from '../../types/icons.type';
import Icon from '../icon/Icon';
import { TFontSizes } from '../../types/fontSizes.type';
import useColorIntensity from '../../hooks/useColorIntensity';
import { TRounded } from '../../types/rounded.type';
import { TBorderWidth } from '../../types/borderWidth.type';
import CloseButton from './CloseButton';

export type TAlertVariants = 'solid' | 'outline' | 'default';

interface IAlertProps extends HTMLAttributes<HTMLDivElement> {
	borderWidth?: TBorderWidth;
	children: ReactNode;
	className?: string;
	color?: TColors;
	colorIntensity?: TColorIntensity;
	icon?: TIcons;
	iconSize?: TFontSizes;
	isClosable?: boolean;
	rounded?: TRounded;
	title?: string;
	variant?: TAlertVariants;
}
const Alert: FC<IAlertProps> = (props) => {
	const {
		borderWidth,
		children,
		className,
		color,
		colorIntensity,
		icon,
		iconSize,
		isClosable,
		rounded,
		title,
		variant,
		...rest
	} = props;
	const [status, setStatus] = useState<boolean>(true);

	const { textColor } = useColorIntensity(colorIntensity);

	const badgeVariants: { [key in TAlertVariants]: string } = {
		solid: classNames(
			[`${textColor}`],
			[`bg-${color as TColors}-${colorIntensity as TColorIntensity}`],
			'border-transparent',
		),
		outline: classNames(
			[`border-${color as TColors}-${colorIntensity as TColorIntensity}`],
			[`bg-${color as TColors}-${colorIntensity as TColorIntensity}/10`],
			[`text-${color as TColors}-${colorIntensity as TColorIntensity}`],
		),
		default: classNames(
			[`text-${color as TColors}-${colorIntensity as TColorIntensity}`],
			'border-transparent',
		),
	};
	const badgeVariantClasses = badgeVariants[variant as TAlertVariants];

	const classes = classNames(
		'relative',
		'flex h-fit items-stretch',
		'p-4',
		[`${borderWidth as TBorderWidth}`],
		[`${rounded as TRounded}`],
		badgeVariantClasses,
		className,
	);

	if (status)
		return (
			<div data-component-name='Alert' className={classes} {...rest}>
				{icon && (
					<Icon
						icon={icon}
						className='shrink-0 self-center ltr:mr-4 rtl:ml-4'
						size={iconSize}
					/>
				)}
				<div className='w-full grow self-center'>
					{title && <div className='text-lg font-semibold'>{title}</div>}
					<div>{children}</div>
				</div>
				{isClosable && (
					<div className='flex h-full grow items-start'>
						<CloseButton setIsOpen={setStatus} />
					</div>
				)}
			</div>
		);
	return null;
};
Alert.defaultProps = {
	borderWidth: themeConfig.borderWidth,
	className: undefined,
	color: themeConfig.themeColor,
	colorIntensity: themeConfig.themeColorShade,
	icon: undefined,
	iconSize: 'text-3xl',
	isClosable: false,
	rounded: themeConfig.rounded,
	title: undefined,
	variant: 'default',
};
Alert.displayName = 'Alert';

export default Alert;
