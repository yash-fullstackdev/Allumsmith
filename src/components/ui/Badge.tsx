import React, { FC, ReactNode } from 'react';
import classNames from 'classnames';
import { TColors } from '../../types/colors.type';
import { TColorIntensity } from '../../types/colorIntensities.type';
import themeConfig from '../../config/theme.config';
import useColorIntensity from '../../hooks/useColorIntensity';
import { TBorderWidth } from '../../types/borderWidth.type';
import { TRounded } from '../../types/rounded.type';

export type TBadgeVariants = 'solid' | 'outline' | 'default';

interface IBadgeProps {
	borderWidth?: TBorderWidth;
	children: ReactNode;
	className?: string;
	color?: TColors;
	colorIntensity?: TColorIntensity;
	rounded?: TRounded;
	variant?: TBadgeVariants;
}
const Badge: FC<IBadgeProps> = (props) => {
	const { borderWidth, children, className, color, colorIntensity, rounded, variant, ...rest } =
		props;

	const { textColor } = useColorIntensity(colorIntensity);

	const badgeVariant: { [key in TBadgeVariants]: string } = {
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
	const badgeVariantClasses = badgeVariant[variant as TBadgeVariants];

	const classes = classNames(
		'inline-flex items-center justify-center',
		'px-2',
		[`${borderWidth as TBorderWidth}`],
		[`${rounded as TRounded}`],
		badgeVariantClasses,
		className,
	);

	return (
		<span data-component-name='Badge' className={classes} {...rest}>
			{children}
		</span>
	);
};
Badge.defaultProps = {
	borderWidth: themeConfig.borderWidth,
	className: undefined,
	color: themeConfig.themeColor,
	colorIntensity: themeConfig.themeColorShade,
	rounded: themeConfig.rounded,
	variant: 'default',
};
Badge.displayName = 'Badge';

export default Badge;
