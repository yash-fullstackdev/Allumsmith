import React, { FC } from 'react';
import classNames from 'classnames';
import getFirstLetter from '../utils/getFirstLetter';
import { TRounded } from '../types/rounded.type';
import themeConfig from '../config/theme.config';

interface IAvatarProps {
	src?: string;
	name?: string;
	className?: string;
	rounded?: TRounded;
}
const Avatar: FC<IAvatarProps> = (props) => {
	const { src, name, className, rounded, ...rest } = props;

	const sharedClass = classNames('aspect-square w-12', className, rounded);

	if (src) {
		return (
			<img
				className={classNames('object-cover', sharedClass)}
				src={src}
				alt={name}
				{...rest}
			/>
		);
	}
	return (
		<div
			className={classNames(
				'flex items-center justify-center font-bold',
				`bg-${themeConfig.themeColor}-${themeConfig.themeColorShade}/10`,
				`text-${themeConfig.themeColor}-${themeConfig.themeColorShade}`,
				sharedClass,
			)}>
			{getFirstLetter(name || 'Anonymous')}
		</div>
	);
};
Avatar.defaultProps = {
	src: undefined,
	name: undefined,
	className: undefined,
	rounded: 'rounded-full',
};

export default Avatar;
