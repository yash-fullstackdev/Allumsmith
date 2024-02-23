import React, { FC } from 'react';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import DARK_MODE from '../../../../constants/darkMode.constant';
import Icon from '../../../../components/icon/Icon';
import useDarkMode from '../../../../hooks/useDarkMode';
import { TIcons } from '../../../../types/icons.type';
import { TDarkMode } from '../../../../types/darkMode.type';
import useAsideStatus from '../../../../hooks/useAsideStatus';
import themeConfig from '../../../../config/theme.config';

interface IStyledButtonProps {
	text: string;
	icon: TIcons;
	status: TDarkMode;
}
const StyledButton: FC<IStyledButtonProps> = ({ text, icon, status }) => {
	const { darkModeStatus, setDarkModeStatus } = useDarkMode();
	const { asideStatus } = useAsideStatus();

	const handeClick = () => {
		if (!asideStatus) {
			if (darkModeStatus === DARK_MODE.DARK) {
				setDarkModeStatus(DARK_MODE.LIGHT);
			} else if (darkModeStatus === DARK_MODE.LIGHT) {
				setDarkModeStatus(DARK_MODE.SYSTEM);
			} else {
				setDarkModeStatus(DARK_MODE.DARK);
			}
		} else {
			setDarkModeStatus(status);
		}
	};

	if (!asideStatus && darkModeStatus !== status) return null;
	return (
		<button
			type='button'
			aria-label={`${text} Mode`}
			className={classNames(
				'p-1.5',
				'rounded-full',
				'text-zinc-500 dark:hover:text-zinc-100',
				'flex flex-auto items-center justify-center',
				{
					'bg-white shadow-lg dark:bg-zinc-800 dark:text-white':
						darkModeStatus === status,
					'hover:text-zinc-950': darkModeStatus !== status,
				},
				themeConfig.transition,
			)}
			onClick={handeClick}>
			<Icon
				icon={icon}
				className={classNames('text-xl', {
					'ltr:mr-1.5 rtl:ml-1.5': asideStatus,
				})}
			/>
			{asideStatus && text}
		</button>
	);
};
const DarkModeSwitcherPart = () => {
	const { t } = useTranslation();
	return (
		<div className='flex w-full overflow-hidden rounded-full bg-zinc-100 p-2 text-sm dark:bg-zinc-950'>
			<StyledButton icon='HeroMoon' status={DARK_MODE.DARK} text={t('theme.dark')} />
			<StyledButton icon='HeroSun' status={DARK_MODE.LIGHT} text={t('theme.light')} />
			<StyledButton
				icon='HeroComputerDesktop'
				status={DARK_MODE.SYSTEM}
				text={t('theme.system')}
			/>
		</div>
	);
};

export default DarkModeSwitcherPart;
