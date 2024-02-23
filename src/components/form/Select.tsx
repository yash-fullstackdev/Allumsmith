import React, { FC, ReactNode, SelectHTMLAttributes } from 'react';
import classNames from 'classnames';
import themeConfig from '../../config/theme.config';
import { TRounded } from '../../types/rounded.type';
import { TBorderWidth } from '../../types/borderWidth.type';
import { TColors } from '../../types/colors.type';
import { TColorIntensity } from '../../types/colorIntensities.type';
import { IValidationBaseProps } from './Validation';

export type TSelectVariants = 'solid';
export type TSelectDimension = 'xs' | 'sm' | 'default' | 'lg' | 'xl';

interface ISelectProps
	extends SelectHTMLAttributes<HTMLSelectElement>,
		Partial<IValidationBaseProps> {
	borderWidth?: TBorderWidth;
	className?: string;
	children: ReactNode;
	color?: TColors;
	colorIntensity?: TColorIntensity;
	name: string;
	rounded?: TRounded;
	dimension?: TSelectDimension;
	value?: string | number | readonly string[] | undefined;
	variant?: TSelectVariants;
}
const Select: FC<ISelectProps> = (props) => {
	const {
		borderWidth,
		className,
		children,
		color,
		colorIntensity,
		name,
		rounded,
		dimension,
		variant,
		placeholder,
		isValid,
		isTouched,
		invalidFeedback,
		...rest
	} = props;

	const selectVariants: {
		[key in TSelectVariants]: { general: string; validation: string };
	} = {
		solid: {
			general: classNames(
				// Default
				[`${borderWidth as TBorderWidth} border-zinc-100 dark:border-zinc-800`],
				'bg-zinc-100 dark:bg-zinc-800',
				// Hover
				[`hover:border-${color as TColors}-${colorIntensity as TColorIntensity}`],
				[`dark:hover:border-${color as TColors}-${colorIntensity as TColorIntensity}`],
				// Focus
				'focus:border-zinc-300 dark:focus:border-zinc-800',
				'focus:bg-transparent dark:focus:bg-transparent',
			),
			validation: classNames({
				'!border-red-500 ring-4 ring-red-500/30': !isValid && isTouched && invalidFeedback,
				'!border-green-500 focus:ring-4 focus:ring-green-500/30':
					!isValid && isTouched && !invalidFeedback,
			}),
		},
	};
	const selectVariantClasses = selectVariants[variant as TSelectVariants].general;
	const selectValidationsClasses = selectVariants[variant as TSelectVariants].validation;

	/**
	 * Padding & Font Size & Icon Margin
	 */
	const selectDimension: { [key in TSelectDimension]: { general: string } } = {
		xs: {
			general: classNames('px-1.5', 'py-0.5', 'text-xs'),
		},
		sm: {
			general: classNames('px-1.5', 'py-1', 'text-sm'),
		},
		default: {
			general: classNames('px-1.5', 'py-1.5', 'text-base'),
		},
		lg: {
			general: classNames('px-1.5', 'py-2', 'text-lg'),
		},
		xl: {
			general: classNames('px-1.5', 'py-2.5', 'text-xl'),
		},
	};
	const selectDimensionClasses = selectDimension[dimension as TSelectDimension].general;

	const classes = classNames(
		'w-full appearance-none outline-0',
		'text-black dark:text-white',
		themeConfig.transition,
		selectVariantClasses,
		selectDimensionClasses,
		rounded,
		selectValidationsClasses,
		className,
	);

	return (
		<select data-component-name='select' className={classes} name={name} {...rest}>
			{placeholder && !rest?.value && (
				<option value={undefined} hidden>
					{placeholder}
				</option>
			)}
			{children}
		</select>
	);
};
Select.defaultProps = {
	borderWidth: themeConfig.borderWidth,
	className: undefined,
	color: themeConfig.themeColor,
	colorIntensity: themeConfig.themeColorShade,
	rounded: themeConfig.rounded,
	dimension: 'default',
	value: undefined,
	variant: 'solid',
};

export default Select;
