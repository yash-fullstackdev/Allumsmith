import React, { FC, HTMLAttributes, ReactNode, useEffect, useId, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import { AnimatePresence, motion } from 'framer-motion';
import { TIcons } from '../../../types/icons.type';
import Icon, { IIconProps } from '../../icon/Icon';
import useAsideStatus from '../../../hooks/useAsideStatus';
import themeConfig from '../../../config/theme.config';
import Tooltip from '../../ui/Tooltip';
import Avatar from '../../Avatar';
import { TColors } from '../../../types/colors.type';

const navItemClasses = {
	default: classNames(
		'mb-2 p-3',
		'flex items-center',
		'cursor-pointer',
		'overflow-hidden',
		'rounded-xl',
		'border',
		'text-zinc-500',
		'hover:text-zinc-950 dark:hover:text-zinc-100',
		'grow',
		themeConfig.transition,
	),
	inactive: 'border-transparent',
	active: 'border-zinc-500 font-semibold text-zinc-950 dark:border-zinc-800 dark:text-zinc-100',
	here: 'text-zinc-950 dark:text-zinc-100 border-transparent',
};

const navItemChildCheck = (
	children:
		| React.ReactElement<unknown, string | React.JSXElementConstructor<unknown>>
		| string
		| number
		| Iterable<React.ReactNode>
		| React.ReactPortal
		| boolean
		| null
		| undefined
		| INavButtonProps,
): boolean => {
	// @ts-ignore
	// eslint-disable-next-line @typescript-eslint/no-unsafe-return
	return children?.length > 1
		? // @ts-ignore
		// eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-return
		children?.map((child) => child.type.displayName).includes('NavButton')
		: // @ts-ignore
		// eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-return
		children?.type?.displayName === 'NavButton';
};

interface INavItemTextProps extends HTMLAttributes<HTMLDivElement> {
	children: ReactNode;
	className?: string;
}
const NavItemText: FC<INavItemTextProps> = (props) => {
	const { children, className, ...rest } = props;

	return (
		<div
			data-component-name='Nav/NavItemText'
			className={classNames('overflow-hidden truncate whitespace-nowrap', className)}
			{...rest}>
			{children}
		</div>
	);
};
NavItemText.defaultProps = {
	className: undefined,
};
NavItemText.displayName = 'NavItemText';

interface INavItemContentProps extends HTMLAttributes<HTMLDivElement> {
	children: ReactNode;
	className?: string;
}
const NavItemContent: FC<INavItemContentProps> = (props) => {
	const { children, className, ...rest } = props;

	const { asideStatus } = useAsideStatus();

	return (
		<div
			data-component-name='Nav/NavItemContent'
			className={classNames(
				'flex w-full items-center justify-between truncate',
				{
					hidden: !asideStatus,
				},
				className,
			)}
			{...rest}>
			{children}
		</div>
	);
};
NavItemContent.defaultProps = {
	className: undefined,
};
NavItemContent.displayName = 'NavItemContent';

interface INavIconProps extends Partial<IIconProps> {
	icon?: TIcons;
	className?: string;
}
const NavIcon: FC<INavIconProps> = (props) => {
	const { className, icon } = props;

	const { asideStatus } = useAsideStatus();

	return (
		<Icon
			data-component-name='Nav/NavIcon'
			icon={icon as TIcons}
			className={classNames(
				'w-6 flex-none text-2xl',
				{
					'me-3': asideStatus,
				},
				className,
			)}
		/>
	);
};
NavIcon.defaultProps = {
	icon: 'HeroMinus',
	className: undefined,
};
NavIcon.displayName = 'NavIcon';

interface INavButtonProps extends HTMLAttributes<HTMLButtonElement> {
	className?: string;
	icon: TIcons;
	iconColor?: TColors;
	iconClassName?: string;
	title: string;
}
export const NavButton: FC<INavButtonProps> = (props) => {
	const { icon, iconColor, className, iconClassName, ...rest } = props;

	return (
		<button
			data-component-name='Nav/NavButton'
			type='button'
			className={classNames(className)}
			{...rest}>
			<Icon
				icon={icon}
				color={iconColor}
				size='text-2xl'
				className={classNames(
					{
						'text-zinc-500 hover:text-zinc-950 dark:hover:text-zinc-100': !iconColor,
					},
					themeConfig.transition,
					iconClassName,
				)}
			/>
		</button>
	);
};
NavButton.defaultProps = {
	className: undefined,
	iconColor: undefined,
	iconClassName: undefined,
};
NavButton.displayName = 'NavButton';

interface INavItemProps extends HTMLAttributes<HTMLLIElement> {
	children?: ReactNode;
	icon?: TIcons;
	text: string;
	to?: string;
	className?: string;
	identifier?: string
}
// export const NavItem: FC<INavItemProps> = (props) => {
// 	const { children, icon, text, to, className, identifier, ...rest } = props;
// 	console.log("🚀 ~ childrasdsen:", children)

// 	const { t } = useTranslation('menu');

// 	const { asideStatus, setAsideStatus } = useAsideStatus();

// 	const isChildrenNavButton = navItemChildCheck(children);
// 	console.log('identifier', identifier === to)
// 	const isActive = (match: any, location: any) => {
//         // Check if the current location matches the 'to' prop
//         if (match || location.pathname === to) {
//             return true;
//         }
//         // Check if the current location matches the 'identifier' prop
//         if (identifier && location.pathname.includes(identifier)) {
//             return true;
//         }
//         return false;
//     };
// 	const CONTENT = (
// 		<>
// 			<NavIcon icon={icon} />
// 			<NavItemContent>
// 				<NavItemText>{t(text)}</NavItemText>
// 				{children && !isChildrenNavButton && <div>{children as ReactNode}</div>}
// 			</NavItemContent>
// 		</>
// 	);

// 	return (
// 		<Tooltip text={asideStatus ? '' : t(text)} placement='right'>
// 			<li
// 				data-component-name='Nav/NavItem'
// 				className={classNames(
// 					'flex list-none items-center overflow-hidden whitespace-nowrap',
// 					className,
// 				)}
// 				{...rest}>
// 				{to ? (
// 					<>
// 						{/* For Desktop */}
// 						<NavLink
// 							end
// 							to={to}
// 							className={({ isActive }) =>
// 								isActive
// 									? classNames(
// 										navItemClasses.default,
// 										navItemClasses.active,
// 										'max-md:hidden',
// 									)
// 									: classNames(
// 										navItemClasses.default,
// 										navItemClasses.inactive,
// 										'max-md:hidden',
// 									)
// 							}>
// 							{CONTENT}
// 						</NavLink>
// 						{/* For Mobile */}
// 						<NavLink
// 							end
// 							to={to}
// 							onClick={() => setAsideStatus(false)}
// 							className={({ isActive }) =>
// 								isActive
// 									? classNames(
// 										navItemClasses.default,
// 										navItemClasses.active,
// 										'md:hidden',
// 									)
// 									: classNames(
// 										navItemClasses.default,
// 										navItemClasses.inactive,
// 										'md:hidden',
// 									)
// 							}>
// 							{CONTENT}
// 						</NavLink>
// 					</>
// 				) : (
// 					<>
// 						{/* For Desktop */}
// 						<div
// 							className={classNames(
// 								navItemClasses.default,
// 								navItemClasses.inactive,
// 								'max-md:hidden',
// 							)}>
// 							{CONTENT}
// 						</div>
// 						{/* For Mobile */}
// 						<div
// 							className={classNames(
// 								navItemClasses.default,
// 								navItemClasses.inactive,
// 								'md:hidden',
// 							)}>
// 							{CONTENT}
// 						</div>
// 					</>
// 				)}
// 				{asideStatus && children && isChildrenNavButton && (
// 					<div className='mb-2 flex items-center gap-3 px-3'>{children as ReactNode}</div>
// 				)}
// 			</li>
// 		</Tooltip>
// 	);
// };
export const NavItem: FC<INavItemProps> = (props) => {
	
	// debugger
    const { children, icon, text, to, className, identifier, ...rest } = props;
    const { t } = useTranslation('menu');
    const { asideStatus, setAsideStatus } = useAsideStatus();
    const location = useLocation();
   
    // const isActive = (identifier && location.pathname.includes(identifier)) || (to && location.pathname.includes(to));
	// const isActive = identifier 
    // ? location.pathname.includes(identifier) 
    // : (to && location.pathname.includes(to));
	// const isActive = (identifier && location.pathname.includes(identifier)) || (to && location.pathname === to);
	const isActive = (to && location.pathname === to) || (identifier && location.pathname.includes(identifier));





	// const isActive = identifier && location.pathname.includes(identifier);
	// const isActive = (to && location.pathname.includes(to)) || (!to && identifier && location.pathname.includes(identifier));

    const CONTENT = (
        <>
            <NavIcon icon={icon} />
            <NavItemContent>
                <NavItemText>{t(text)}</NavItemText>
                {children && !navItemChildCheck(children) && <div>{children}</div>}
            </NavItemContent>
        </>
    );
    return (
        <Tooltip text={asideStatus ? '' : t(text)} placement='right'>
            <li
                data-component-name='Nav/NavItem'
                className={classNames('flex list-none items-center overflow-hidden whitespace-nowrap', className)}
                {...rest}
            >
                {to ? (
                    <>
                        {/* For Desktop */}
                        <NavLink
                            end
                            to={to}
                            className={classNames(navItemClasses.default, {
                                [navItemClasses.active]: isActive,
                                [navItemClasses.inactive]: !isActive,
                                'max-md:hidden': true,
                            })}
							// className={classNames(navItemClasses.default, {
							// 	[navItemClasses.active]: location.pathname === to, // Check if the current location matches the 'to' prop
							// 	[navItemClasses.inactive]: location.pathname !== to,
							// 	'max-md:hidden': true,
							// })}
                        >
                            {CONTENT}
                        </NavLink>
                        {/* For Mobile */}
                        <NavLink
                            end
                            to={to}
                            onClick={() => setAsideStatus(false)}
                            className={classNames(navItemClasses.default, {
                                [navItemClasses.active]: isActive,
                                [navItemClasses.inactive]: !isActive,
                                'md:hidden': true,
                            })}
                        >
                            {CONTENT}
                        </NavLink>
                    </>
                ) : (
                    <>
                        {/* For Desktop */}
                        <div className={classNames(navItemClasses.default, {
                            [navItemClasses.active]: isActive,
                            [navItemClasses.inactive]: !isActive,
                            'max-md:hidden': true,
                        })}>
                            {CONTENT}
                        </div>
                        {/* For Mobile */}
                        <div className={classNames(navItemClasses.default, {
                            [navItemClasses.active]: isActive,
                            [navItemClasses.inactive]: !isActive,
                            'md:hidden': true,
                        })}>
                            {CONTENT}
                        </div>
                    </>
                )}
                      
                {asideStatus && children && navItemChildCheck(children) && (
                    <div className='mb-2 flex items-center gap-3 px-3'>{children}</div>
                )}
            </li>
        </Tooltip>
    );
};

NavItem.defaultProps = {
	children: undefined,
	className: undefined,
	icon: undefined,
	to: undefined,
	identifier: undefined,
};
NavItem.displayName = 'NavItem';

interface INavCollapseProps extends HTMLAttributes<HTMLLIElement> {
	children: ReactNode;
	icon?: TIcons;
	text: string;
	to: string;
	className?: string;
	identifier?: string;
}
export const NavCollapse: FC<INavCollapseProps> = (props) => {
	const { children, icon, text, className, to, identifier, ...rest } = props;

	const { t } = useTranslation('menu');

	const id = useId();
	const [isActive, setIsActive] = useState<boolean>(false);

	const { asideStatus } = useAsideStatus();

	const location = useLocation();
	// const here = to !== '/' && location.pathname.includes(to);
	// console.log("🚀 ~ here:", here)

	// useEffect(() => {
	// 	setIsActive(here);
	// }, [here, location.pathname]);
	

	
	const isActiveCollapse = identifier !== undefined && location.pathname.includes(identifier);

	useEffect(() => {
        // Update isActive state when location changes
        setIsActive(isActiveCollapse);
    }, [isActiveCollapse, location.pathname]);

    const toggleIsActive = () => {
        // Toggle isActive state when clicked
        setIsActive(!isActive);
    };
	return (
		// <li
		// 	data-component-name='Nav/NavCollapse'
		// 	className={classNames('list-none overflow-hidden', className)}
		// 	{...rest}>
		// 	<Tooltip text={asideStatus ? '' : t(text)} placement='right'>
		// 		<div
		// 			role='presentation'
		// 			className={
		// 				isActive || here
		// 					? classNames(navItemClasses.default, navItemClasses.here)
		// 					: classNames(navItemClasses.default, navItemClasses.inactive)
		// 			}
		// 			onClick={() => {
		// 				setIsActive(!isActive)
		// 			}}>
		// 			<NavIcon icon={icon} />

		// 			<NavItemContent>
		// 				<NavItemText>{t(text)}</NavItemText>
		// 				<div>
		// 					<Icon
		// 						icon='HeroChevronDown'
		// 						className={classNames(
		// 							'text-2xl',
		// 							{
		// 								'rotate-180': isActive,
		// 							},
		// 							themeConfig.transition,
		// 						)}
		// 					/>
		// 				</div>
		// 			</NavItemContent>
		// 		</div>
		// 	</Tooltip>
		// 	<AnimatePresence>
		// 		{isActive && (
		// 			<motion.ul
		// 				key={id}
		// 				initial='collapsed'
		// 				animate='open'
		// 				exit='collapsed'
		// 				variants={{
		// 					open: { height: 'auto' },
		// 					collapsed: { height: 0 },
		// 				}}
		// 				transition={{ duration: 0.3 }}
		// 				className={classNames('!transition-margin !duration-300 !ease-in-out', {
		// 					'ms-4': asideStatus,
		// 				})}>
		// 				{children}
		// 			</motion.ul>
		// 		)}
		// 	</AnimatePresence>
		// </li>
		<li
            data-component-name='Nav/NavCollapse'
            className={classNames('list-none overflow-hidden', className)}
            {...rest}
        >
            <Tooltip text={asideStatus ? '' : t(text)} placement='right'>
                <div
                    role='presentation'
                    className={classNames(navItemClasses.default, {
                        [navItemClasses.here]: isActive,
                        [navItemClasses.inactive]: !isActive,
                    })}
					onClick={toggleIsActive}
                >
                    <NavIcon icon={icon} />
                    <NavItemContent>
                        <NavItemText>{t(text)}</NavItemText>
                        <div>
                            <Icon
                                icon='HeroChevronDown'
                                className={classNames(
                                    'text-2xl',
                                    { 'rotate-180': isActive },
                                    themeConfig.transition,
                                )}
                            />
                        </div>
                    </NavItemContent>
                </div>
            </Tooltip>
            <AnimatePresence>
                {isActive && (
                    <motion.ul
                        initial='collapsed'
                        animate='open'
                        exit='collapsed'
                        variants={{
                            open: { height: 'auto' },
                            collapsed: { height: 0 },
                        }}
                        transition={{ duration: 0.3 }}
                        className={classNames('!transition-margin !duration-300 !ease-in-out', {
                            'ms-4': asideStatus,
                        })}
                    >
                        {children}
                    </motion.ul>
                )}
            </AnimatePresence>
        </li>
	);
};
NavCollapse.defaultProps = {
	className: undefined,
	icon: undefined,
};
NavCollapse.displayName = 'NavCollapse';

interface INavTitleProps extends HTMLAttributes<HTMLLIElement> {
	children: string;
	className?: string;
}
export const NavTitle: FC<INavTitleProps> = (props) => {
	const { children, className, ...rest } = props;

	const { t } = useTranslation('menu');

	const { asideStatus } = useAsideStatus();

	return (
		<Tooltip text={asideStatus ? '' : t(children)} placement='right'>
			<li
				data-component-name='Nav/NavTitle'
				className={classNames(
					'list-none overflow-hidden truncate whitespace-nowrap px-3 py-1.5 text-sm font-semibold text-zinc-500',
					className,
				)}
				{...rest}>
				{asideStatus ? (
					children
				) : (
					<div className='my-1.5 h-2 w-full max-w-[6rem] rounded-full bg-zinc-500' />
				)}
			</li>
		</Tooltip>
	);
};
NavTitle.defaultProps = {
	className: undefined,
};
NavTitle.displayName = 'NavTitle';

interface INavUserProps extends HTMLAttributes<HTMLLIElement> {
	children?: ReactNode;
	image?: string;
	text: string;
	to?: string;
	className?: string;
}
export const NavUser: FC<INavUserProps> = (props) => {
	const { children, image, text, to, className, ...rest } = props;

	const { t } = useTranslation('menu');

	const { asideStatus, setAsideStatus } = useAsideStatus();

	const isChildrenNavButton = navItemChildCheck(children);

	const CONTENT = (
		<>
			<Avatar
				src={image}
				name={text}
				className={classNames('w-6 rounded-full', {
					'me-3': asideStatus,
				})}
				rounded='rounded'
			/>
			<NavItemContent>
				<NavItemText>{t(text)}</NavItemText>
				{children && !isChildrenNavButton && <div>{children as ReactNode}</div>}
			</NavItemContent>
		</>
	);

	return (
		<Tooltip text={asideStatus ? '' : t(text)} placement='right'>
			<li
				data-component-name='Nav/NavUser'
				className={classNames(
					'flex list-none items-center overflow-hidden whitespace-nowrap',
					className,
				)}
				{...rest}>
				{to ? (
					<>
						{/* For Desktop */}
						<NavLink
							end
							to={to}
							className={({ isActive }) =>
								isActive
									? classNames(
										navItemClasses.default,
										navItemClasses.active,
										'max-md:hidden',
									)
									: classNames(
										navItemClasses.default,
										navItemClasses.inactive,
										'max-md:hidden',
									)
							}>
							{CONTENT}
						</NavLink>
						{/* For Mobile */}
						<NavLink
							end
							to={to}
							onClick={() => setAsideStatus(false)}
							className={({ isActive }) =>
								isActive
									? classNames(
										navItemClasses.default,
										navItemClasses.active,
										'md:hidden',
									)
									: classNames(
										navItemClasses.default,
										navItemClasses.inactive,
										'md:hidden',
									)
							}>
							{CONTENT}
						</NavLink>
					</>
				) : (
					<>
						{/* For Desktop */}
						<div
							className={classNames(
								navItemClasses.default,
								navItemClasses.inactive,
								'max-md:hidden',
							)}>
							{CONTENT}
						</div>
						{/* For Mobile */}
						<div
							className={classNames(
								navItemClasses.default,
								navItemClasses.inactive,
								'md:hidden',
							)}>
							{CONTENT}
						</div>
					</>
				)}
				{asideStatus && children && isChildrenNavButton && (
					<div className='mb-2 flex items-center gap-3 px-3'>{children as ReactNode}</div>
				)}
			</li>
		</Tooltip>
	);
};
NavUser.defaultProps = {
	children: undefined,
	className: undefined,
	image: undefined,
	to: undefined,
};
NavUser.displayName = 'NavUser';

interface INavSeparatorProps extends HTMLAttributes<HTMLLIElement> {
	className?: string;
}
export const NavSeparator: FC<INavSeparatorProps> = (props) => {
	const { className, ...rest } = props;
	return (
		<li
			data-component-name='Nav/NavSeparator'
			className={classNames(
				'mb-2 list-none rounded-full border-b border-zinc-500/25',
				className,
			)}
			{...rest}
		/>
	);
};
NavSeparator.defaultProps = {
	className: undefined,
};
NavSeparator.displayName = 'NavSeparator';

interface INavProps extends HTMLAttributes<HTMLDivElement> {
	children: ReactNode;
	className?: string;
}
const Nav: FC<INavProps> = (props) => {
	const { children, className, ...rest } = props;

	return (
		<nav data-component-name='Nav' className={classNames(className)} {...rest}>
			<ul>{children}</ul>
		</nav>
	);
};
Nav.defaultProps = {
	className: undefined,
};
Nav.displayName = 'Nav';

export default Nav;