import React, { FC, HTMLAttributes, ReactNode } from 'react';
import classNames from 'classnames';
import Tooltip from '../ui/Tooltip';

interface ILabelProps extends HTMLAttributes<HTMLLabelElement> {
	children: ReactNode;
	description?: string;
	className?: string;
	htmlFor: string;
	require?:boolean
}
const Label: FC<ILabelProps> = (props) => {
	const { children, className, description,require, ...rest } = props;
	return (
		<label
			data-component-name='Label'
			// className={classNames('mb-2 inline-block w-full cursor-pointer text-sm', className)}
			className={classNames('inline-block w-fit cursor-pointer text-xl ', className)}
			{...rest}>
			{children}{require && <span className='ml-1 text-red-500'>*</span>}
			{description && <Tooltip className='ms-2 align-baseline' text={description} />}
		</label>
	);
};
Label.defaultProps = {
	className: undefined,
	description: undefined,
};

export default Label;
