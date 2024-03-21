import React, { FC, HTMLAttributes, ReactNode } from 'react';
import classNames from 'classnames';
import Tooltip from '../ui/Tooltip';

interface ILabelProps extends HTMLAttributes<HTMLLabelElement> {
	children: ReactNode;
	description?: string;
	className?: string;
	htmlFor: string;
}
const Label: FC<ILabelProps> = (props) => {
	const { children, className, description, ...rest } = props;
	return (
		<label
			data-component-name='Label'
			// className={classNames('mb-2 inline-block w-full cursor-pointer text-sm', className)}
			className={classNames('inline-block w-full cursor-pointer text-xl font-bold text-sky-600', className)}
			{...rest}>
			{children}
			{description && <Tooltip className='ms-2 align-baseline' text={description} />}
		</label>
	);
};
Label.defaultProps = {
	className: undefined,
	description: undefined,
};

export default Label;
