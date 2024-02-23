import React, { FC } from 'react';
import ReactSelect, { GroupBase } from 'react-select';
import { PublicBaseSelectProps } from 'react-select/base';
import classNames from 'classnames';
import { TBorderWidth } from '../../types/borderWidth.type';
import themeConfig from '../../config/theme.config';
import { TRounded } from '../../types/rounded.type';
import { TColors } from '../../types/colors.type';
import { TColorIntensity } from '../../types/colorIntensities.type';
import useColorIntensity from '../../hooks/useColorIntensity';
import useRoundedSize from '../../hooks/useRoundedSize';
import { IValidationBaseProps } from './Validation';

export type TSelectVariant = 'solid';
export type TSelectDimension = 'sm' | 'default' | 'lg' | 'xl';

type TSelectOption =
	| {
			value: string;
			label: string;
			isFixed?: boolean;
			isDisabled?: boolean;
	  }
	| undefined;
export type TSelectOptions = TSelectOption[];
export type TSelectGroups = GroupBase<TSelectOption>[];

type TReactSelect = Partial<
	PublicBaseSelectProps<TSelectOption, boolean, GroupBase<TSelectOption>>
>;

interface ISelectReactProps extends TReactSelect, Partial<IValidationBaseProps> {
	borderWidth?: TBorderWidth;
	className?: string;
	color?: TColors;
	colorIntensity?: TColorIntensity;
	name: string;
	rounded?: TRounded;
	dimension?: TSelectDimension;
	variant?: TSelectVariant;
}
const SelectReact: FC<ISelectReactProps> = (props) => {
	const {
		borderWidth,
		className,
		color,
		colorIntensity,
		isValidMessage,
		name,
		rounded,
		dimension,
		validFeedback,
		variant,
		isValid,
		isTouched,
		invalidFeedback,
		...rest
	} = props;

	const { textColor } = useColorIntensity(colorIntensity);

	const selectVariant: {
		[key in TSelectVariant]: {
			control: string;
			controlFocus: string;
			validation: string;
			validationFocus: string;
		};
	} = {
		solid: {
			control: classNames(
				// Default
				[`${borderWidth as TBorderWidth} border-zinc-100 dark:border-zinc-800`],
				'bg-zinc-100 dark:bg-zinc-800',
				'w-full',
				'text-black dark:text-white',
				themeConfig.transition,
				[`${rounded as TRounded}`],
				// Hover
				[`hover:border-${color as TColors}-${colorIntensity as TColorIntensity}`],
				[`dark:hover:border-${color as TColors}-${colorIntensity as TColorIntensity}`],
			),
			controlFocus: classNames(
				{
					'!border-zinc-300 dark:!border-zinc-800': isValid,
				},
				'!bg-transparent dark:!bg-transparent',
			),
			validation: classNames({
				'!border-red-500 ring-4 ring-red-500/30': !isValid && isTouched && invalidFeedback,
				'!border-green-500': !isValid && isTouched && !invalidFeedback,
			}),
			validationFocus: classNames({
				'!ring-4 !ring-green-500/30': !isValid && isTouched && !invalidFeedback,
			}),
		},
	};
	const selectControlVariantClasses = selectVariant[variant as TSelectVariant].control;
	const selectControlFocusVariantClasses = selectVariant[variant as TSelectVariant].controlFocus;
	const selectControlValidationsClasses = selectVariant[variant as TSelectVariant].validation;
	const selectControlValidationFocusClasses =
		selectVariant[variant as TSelectVariant].validationFocus;

	const selectDimensions: { [key in TSelectDimension]: { control: string } } = {
		sm: { control: classNames('!min-h-[2rem] text-sm') },
		default: { control: classNames('!min-h-[2.5rem]') },
		lg: { control: classNames('!min-h-[3rem] text-lg') },
		xl: { control: classNames('!min-h-[3.25rem] text-xl') },
	};
	const selectDimensionClasses = selectDimensions[dimension as TSelectDimension].control;

	const { roundedCustom } = useRoundedSize(rounded);

	return (
		<ReactSelect
			inputId={rest.id || name}
			data-component-name='Select'
			unstyled
			classNames={{
				control: (state) =>
					classNames(
						'py-0.5 px-1.5',
						selectControlVariantClasses,
						{
							[`${selectControlFocusVariantClasses}`]: state.isFocused,
						},
						selectControlValidationsClasses,
						{
							[`${selectControlValidationFocusClasses}`]: state.isFocused,
						},
						selectDimensionClasses,
						themeConfig.transition,
						className,
					),
				option: (state) =>
					classNames('px-1.5 py-1', themeConfig.transition, {
						[`bg-${color as TColors}-${colorIntensity as TColorIntensity}`]:
							state.isFocused,
						[`${textColor}`]: state.isFocused,
						'opacity-50': state?.data?.isDisabled,
					}),
				menu: () =>
					classNames('bg-white dark:bg-black overflow-hidden shadow-lg', [
						`${rounded as TRounded}`,
					]),
				group: () => classNames('border-zinc-500/25', '[&:not(:last-child)]:border-b'),
				groupHeading: () => classNames('font-semibold', 'px-1.5', 'pt-1.5', 'pb-0.5'),
				placeholder: () => classNames('text-black/50', 'dark:text-white/50'),
				indicatorSeparator: () => classNames('rounded', '!bg-zinc-500/50'),
				multiValue: (state) =>
					classNames(
						`bg-${color as TColors}-${colorIntensity as TColorIntensity}`,
						'm-0.5',
						'ltr:pl-1 rtl:pr-1',
						[`${textColor}`],
						[`${roundedCustom(-2)}`],
						{
							'ltr:pr-1 rtl:pl-1': state?.data?.isFixed,
						},
					),
				multiValueRemove: (state) =>
					classNames(
						'hover:bg-red-500',
						[`${roundedCustom(-2)}`],
						themeConfig.transition,
						{
							'!hidden': state?.data?.isFixed,
							'opacity-50 pointer-events-none': state?.data?.isDisabled,
						},
					),
			}}
			{...rest}
		/>
	);
};
SelectReact.defaultProps = {
	borderWidth: themeConfig.borderWidth,
	className: undefined,
	color: themeConfig.themeColor,
	colorIntensity: themeConfig.themeColorShade,
	rounded: themeConfig.rounded,
	dimension: 'default',
	variant: 'solid',
};
SelectReact.displayName = 'Select';

export default SelectReact;
