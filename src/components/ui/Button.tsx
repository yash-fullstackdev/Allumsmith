import React, { forwardRef, HTMLAttributes, ReactNode } from 'react';
import classNames from 'classnames';
import { TColors } from '../../types/colors.type';
import { TColorIntensity } from '../../types/colorIntensities.type';
import { TRounded } from '../../types/rounded.type';
import themeConfig from '../../config/theme.config';
import useColorIntensity from '../../hooks/useColorIntensity';
import { TIcons } from '../../types/icons.type';
import Icon from '../icon/Icon';
import { TBorderWidth } from '../../types/borderWidth.type';

export type TButtonVariants = 'solid' | 'outline' | 'default' | 'outlined';
export type TButtonSize = 'xs' | 'sm' | 'default' | 'lg' | 'xl' | 'small';

export interface IButtonProps extends HTMLAttributes<HTMLButtonElement> {
	borderWidth?: TBorderWidth;
	children?: ReactNode;
	className?: string;
	color?: TColors;
	colorIntensity?: TColorIntensity;
	icon?: TIcons;
	isActive?: boolean;
	isDisable?: boolean;
	isLoading?: boolean;
	rightIcon?: TIcons;
	rounded?: TRounded;
	size?: TButtonSize;
	variant?: TButtonVariants;
	type?: any;
}
const Button = forwardRef<HTMLButtonElement, IButtonProps>((props, ref) => {
	const {
		borderWidth,
		children,
		className,
		color,
		colorIntensity,
		icon,
		isActive,
		isDisable,
		isLoading,
		rightIcon,
		rounded,
		size,
		variant,
		type,
		...rest
	} = props;
	const HAS_CHILDREN = typeof children !== 'undefined';

	const { textColor, shadeColorIntensity } = useColorIntensity(colorIntensity);

	/**
	 * Variant & Color & Status
	 */
	const btnVariants: any = {
		solid: classNames(
			// Default
			{
				[`bg-${color as TColors}-${colorIntensity as TColorIntensity}`]: !isActive,
			},
			[
				`${borderWidth as TBorderWidth} border-${color as TColors}-${
					colorIntensity as TColorIntensity
				}`,
			],
			[`${textColor}`],
			// Hover
			[`hover:bg-${color as TColors}-${shadeColorIntensity as TColorIntensity}`],
			[`hover:border-${color as TColors}-${shadeColorIntensity as TColorIntensity}`],
			// Active
			[`active:bg-${color as TColors}-${shadeColorIntensity as TColorIntensity}`],
			[`active:border-${color as TColors}-${shadeColorIntensity as TColorIntensity}`],
			{
				[`bg-${color as TColors}-${shadeColorIntensity as TColorIntensity}`]: isActive,
				[`border-${color as TColors}-${shadeColorIntensity as TColorIntensity}`]: isActive,
			},
		),
		outline: classNames(
			// Default
			'bg-transparent',
			[`${borderWidth as TBorderWidth}`],
			{
				[`border-${color as TColors}-${colorIntensity as TColorIntensity}/50`]: !isActive,
			},
			'text-black dark:text-white',
			// Hover
			[`hover:border-${color as TColors}-${colorIntensity as TColorIntensity}`],
			// Active
			[`active:border-${color as TColors}-${colorIntensity as TColorIntensity}`],
			{
				[`border-${color as TColors}-${colorIntensity as TColorIntensity}`]: isActive,
			},
		),
		default: classNames(
			// Default
			'bg-transparent',
			{ 'text-zinc-600 dark:text-zinc-400': !isActive },
			[`${borderWidth as TBorderWidth}`],
			'border-transparent',
			// Hover
			[
				`hover:text-${color as TColors}-${
					colorIntensity as TColorIntensity
				} dark:hover:text-${color as TColors}-${colorIntensity as TColorIntensity}`,
			],
			// Active
			[`active:text-${color as TColors}-${colorIntensity as TColorIntensity}`],
			{
				[`text-${color as TColors}-${colorIntensity as TColorIntensity}`]: isActive,
			},
		),
	};
	const btnVariantClasses = btnVariants[variant as TButtonVariants];

	/**
	 * Padding & Font Size & Icon Margin
	 */
	const btnSizes: {
		[key in TButtonSize]: { general: string; icon: string; rightIcon: string };
	} = {
		xs: {
			general: classNames(
				{
					'px-3': HAS_CHILDREN,
					'px-0.5': !HAS_CHILDREN,
				},
				'py-0.5',
				'text-xs',
			),
			icon: classNames({ 'ltr:mr-1 rtl:ml-1': HAS_CHILDREN }, 'text-[1.125rem]'),
			rightIcon: classNames('ltr:ml-1', 'rtl:mr-1', 'text-[1.125rem]'),
		},
		sm: {
			general: classNames(
				{
					'px-4': HAS_CHILDREN,
					'px-1': !HAS_CHILDREN,
				},
				'py-1',
				'text-sm',
			),
			icon: classNames({ 'ltr:mr-1 rtl:ml-1': HAS_CHILDREN }, 'text-[1.25rem]'),
			rightIcon: classNames('ltr:ml-1', 'rtl:mr-1', 'text-[1.25rem]'),
		},
		default: {
			general: classNames(
				{
					'px-5': HAS_CHILDREN,
					'px-1.5': !HAS_CHILDREN,
				},
				'py-1.5',
				'text-base',
			),
			icon: classNames({ 'ltr:mr-1.5 rtl:ml-1.5': HAS_CHILDREN }, 'text-[1.5rem]'),
			rightIcon: classNames('ltr:ml-1.5', 'rtl:mr-1.5', 'text-[1.5rem]'),
		},
		lg: {
			general: classNames(
				{
					'px-6': HAS_CHILDREN,
					'px-2': !HAS_CHILDREN,
				},
				'py-2',
				'text-lg',
			),
			icon: classNames({ 'ltr:mr-2 rtl:ml-2': HAS_CHILDREN }, 'text-[1.75rem]'),
			rightIcon: classNames('ltr:ml-2', 'rtl:mr-2', 'text-[1.75rem]'),
		},
		xl: {
			general: classNames(
				{
					'px-7': HAS_CHILDREN,
					'px-2.5': !HAS_CHILDREN,
				},
				'py-2.5',
				'text-xl',
			),
			icon: classNames({ 'ltr:mr-2.5 rtl:ml-2.5': HAS_CHILDREN }, 'text-[1.75rem]'),
			rightIcon: classNames('ltr:ml-2.5', 'rtl:mr-2.5'),
		},
		small: {
			general: classNames(
				{
					'px-0': HAS_CHILDREN,
					'px-2.5': !HAS_CHILDREN,
				},
				'py-2.5',
				'text-xl',
			),
			icon: classNames({ 'ltr:mr-2.5 rtl:ml-2.5': HAS_CHILDREN }, 'text-[1.75rem]'),
			rightIcon: classNames('ltr:ml-2.5', 'rtl:mr-2.5'),
		},
	};
	const btnSizeClasses = btnSizes[size as TButtonSize].general;
	const btnIconClasses = btnSizes[size as TButtonSize].icon;
	const btnRightIconClasses = HAS_CHILDREN ? btnSizes[size as TButtonSize].rightIcon : undefined;

	/**
	 * Disable
	 */
	const btnDisabledClasses = 'opacity-50 pointer-events-none';

	const classes = classNames(
		'inline-flex items-center justify-center',
		btnVariantClasses,
		btnSizeClasses,
		rounded,
		themeConfig.transition,
		{ [`${btnDisabledClasses}`]: isDisable || isLoading },
		className,
	);

	return (
		<button ref={ref} data-component-name='Button' type={type} className={classes} {...rest}>
			{(!!icon || isLoading) && (
				<Icon
					icon={isLoading ? 'DuoLoading' : (icon as TIcons)}
					className={classNames({ 'animate-spin': isLoading }, btnIconClasses)}
				/>
			)}
			{children}
			{!!rightIcon && <Icon icon={rightIcon} className={classNames(btnRightIconClasses)} />}
		</button>
	);
});
Button.defaultProps = {
	borderWidth: themeConfig.borderWidth,
	children: undefined,
	className: undefined,
	color: themeConfig.themeColor,
	colorIntensity: themeConfig.themeColorShade,
	icon: undefined,
	isActive: false,
	isDisable: false,
	isLoading: false,
	rightIcon: undefined,
	rounded: themeConfig.rounded,
	size: 'default',
	variant: 'default',
	type: 'button',
};
Button.displayName = 'Button';

export default Button;
