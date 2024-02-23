import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import { Descendant } from 'slate';
import { EmailAuthProvider, reauthenticateWithCredential, updatePassword } from 'firebase/auth';
import PageWrapper from '../components/layouts/PageWrapper/PageWrapper';
import { useAuth } from '../context/authContext';
import Container from '../components/layouts/Container/Container';
import Subheader, {
	SubheaderLeft,
	SubheaderRight,
} from '../components/layouts/Subheader/Subheader';
import Card, { CardBody, CardFooter, CardFooterChild } from '../components/ui/Card';
import Button, { IButtonProps } from '../components/ui/Button';
import { TIcons } from '../types/icons.type';
import Label from '../components/form/Label';
import Input from '../components/form/Input';
import Select from '../components/form/Select';
import Avatar from '../components/Avatar';
import useSaveBtn from '../hooks/useSaveBtn';
import FieldWrap from '../components/form/FieldWrap';
import Icon from '../components/icon/Icon';
import Checkbox from '../components/form/Checkbox';
import Badge from '../components/ui/Badge';
import RichText from '../components/RichText';
import Radio, { RadioGroup } from '../components/form/Radio';
import useDarkMode from '../hooks/useDarkMode';
import { TDarkMode } from '../types/darkMode.type';
// import firebase, { auth } from '../firebase';
import { auth } from '../firebase'; // Adjust the path accordingly
import Alert from '../components/ui/Alert';

type TTab = {
	text:
	| 'Edit Profile'
	| 'Social'
	| 'Change Password'
	| '2FA'
	| 'Newsletter'
	| 'Sessions'
	| 'Connected'
	| 'Appearance';
	icon: TIcons;
};
type TTabs = {
	[key in // | 'EDIT'
	// | 'SOCIAL'
	'PASSWORD']: TTab; // | 'APPEARANCE' // | 'CONNECTED' // | 'SESSIONS' // | 'NEWSLETTER' // | '2FA'
};
const TAB: TTabs = {
	// EDIT: {
	// 	text: 'Edit Profile',
	// 	icon: 'HeroPencil',
	// },
	// SOCIAL: {
	// 	text: 'Social',
	// 	icon: 'HeroGlobeAmericas',
	// },
	PASSWORD: {
		text: 'Change Password',
		icon: 'HeroKey',
	},
	// '2FA': {
	// 	text: '2FA',
	// 	icon: 'HeroShieldExclamation',
	// },
	// NEWSLETTER: {
	// 	text: 'Newsletter',
	// 	icon: 'HeroBell',
	// },
	// SESSIONS: {
	// 	text: 'Sessions',
	// 	icon: 'HeroQueueList',
	// },
	// CONNECTED: {
	// 	text: 'Connected',
	// 	icon: 'HeroLink',
	// },
	// APPEARANCE: {
	// 	text: 'Appearance',
	// 	icon: 'HeroSwatch',
	// },
};

const ProfilePage = () => {
	const { i18n } = useTranslation();

	const { setDarkModeStatus } = useDarkMode();

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const { userData, isLoading } = useAuth();
	const [activeTab, setActiveTab] = useState<TTab>(TAB.PASSWORD);

	const defaultProps: IButtonProps = {
		color: 'zinc',
	};
	const activeProps: IButtonProps = {
		...defaultProps,
		isActive: true,
		color: 'blue',
		colorIntensity: '500',
	};

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [isSaving, setIsSaving] = useState<boolean>(false);

	const formik: any = useFormik({
		enableReinitialize: true,
		initialValues: {
			// fileUpload: '',
			// username: userData?.username,
			// email: userData?.email,
			firstName: auth.currentUser?.firstName as any,
			lastName: userData?.lastName,
			position: userData?.position,
			role: userData?.role,
			oldPassword: '',
			newPassword: '',
			newPasswordConfirmation: '',
			email: auth.currentUser?.email,
			twitter: userData?.socialProfiles?.twitter,
			facebook: userData?.socialProfiles?.facebook,
			instagram: userData?.socialProfiles?.instagram,
			github: userData?.socialProfiles?.github,
			twoFactorAuth: userData?.twoFactorAuth,
			weeklyNewsletter: userData?.newsletter?.weeklyNewsletter || false,
			lifecycleEmails: userData?.newsletter?.lifecycleEmails || false,
			promotionalEmails: userData?.newsletter?.promotionalEmails || false,
			productUpdates: userData?.newsletter?.productUpdates || false,
			bio: (userData?.bio && (JSON.parse(userData.bio) as Descendant[])) || [],
			gender: 'Male',
			theme: 'dark',
			birth: '1987-12-21',
		},
		onSubmit: async () => {
			try {
				setIsSaving(true);

				// Check if the user wants to update the password
				if (formik.values.newPassword) {
					// Ensure the email and old password are provided
					if (!formik.values.email || !formik.values.oldPassword) {
						throw new Error(
							'Email and old password are required for reauthentication.',
						);
					}

					// Reauthenticate the user before changing the password
					const credential = EmailAuthProvider.credential(
						formik.values.email,
						formik.values.oldPassword,
					);
					await reauthenticateWithCredential(auth.currentUser as any, credential);

					// Update the user's password
					await updatePassword(auth.currentUser as any, formik.values.newPassword);
				}
				setIsSaving(false);
				alert('Password changed succesfully');
				formik.setValues({});
			} catch (error: any) {
				console.log('Error updating password:', error.code);
				if (error.code === 'auth/invalid-login-credentials') {
					alert('Incorrect old password!');
				}
				if (error.code === 'auth/too-many-requests') {
					alert('Too many Requests, Pl. try again after some time.');
				}
				setIsSaving(false);
			}
		},
	});

	// useEffect(() => {
	// 	setDarkModeStatus(formik.values.theme as TDarkMode);
	// 	// eslint-disable-next-line react-hooks/exhaustive-deps
	// }, [formik.values.theme]);

	const [passwordShowStatus, setPasswordShowStatus] = useState<boolean>(false);
	const [passwordNewShowStatus, setPasswordNewShowStatus] = useState<boolean>(false);
	const [passwordNewConfShowStatus, setPasswordNewConfShowStatus] = useState<boolean>(false);
	const [error, setError] = useState<string | undefined>();

	const { saveBtnText, saveBtnColor, saveBtnDisable } = useSaveBtn({
		isNewItem: false,
		isSaving,
		isDirty: formik.dirty,
	});

	return (
		<PageWrapper name={formik.values.firstName}>
			{/* <Subheader>
				<SubheaderLeft>
					{`${userData?.firstName} ${userData?.lastName}`}{' '}
					<Badge
						color='blue'
						variant='outline'
						rounded='rounded-full'
						className='border-transparent'>
						Edit User
					</Badge>
				</SubheaderLeft>
				<SubheaderRight>
					<Button
						icon='HeroServer'
						variant='solid'
						color={saveBtnColor}
						isDisable={saveBtnDisable}
						onClick={() => formik.handleSubmit()}>
						{saveBtnText}
					</Button>
				</SubheaderRight>
			</Subheader> */}
			<Container className='h-full'>
				<Card className='h-full'>
					<CardBody>
						{formik.values.newPassword !== formik.values.newPasswordConfirmation && (
							<Alert
								className='border-transparent'
								color='amber'
								icon='HeroBeaker'
								title='New password and confirmation do not match'
								variant='solid'>
								{error}
							</Alert>
						)}
						<div className='grid grid-cols-12 gap-4'>
							<div className='col-span-12 flex gap-4 max-sm:flex-wrap sm:col-span-4 sm:flex-col md:col-span-2'>
								{Object.values(TAB).map((i) => (
									<div key={i.text}>
										<Button
											icon={i.icon}
											// eslint-disable-next-line react/jsx-props-no-spreading
											{...(activeTab.text === i.text
												? {
													...activeProps,
												}
												: {
													...defaultProps,
												})}
											onClick={() => {
												setActiveTab(i);
											}}>
											{i.text}
										</Button>
									</div>
								))}
								{/* <div className=' border-zinc-500/25 dark:border-zinc-500/50 max-sm:border-s sm:border-t sm:pt-4'>
									<Button icon='HeroTrash' color='red'>
										Delete Account
									</Button>
								</div> */}
							</div>
							<div className='col-span-12 flex flex-col gap-4 sm:col-span-8 md:col-span-10'>

								{activeTab === TAB.PASSWORD && (
									<>
										<div className='text-4xl font-semibold'>
											Change Password
										</div>
										<div className='grid w-9/12 grid-cols-12 gap-4'>
											<div className='col-span-12'>
												<Label htmlFor='oldPassword'>Old Password</Label>
												<FieldWrap
													lastSuffix={
														<Icon
															className='mx-2'
															icon={
																passwordShowStatus
																	? 'HeroEyeSlash'
																	: 'HeroEye'
															}
															onClick={() => {
																setPasswordShowStatus(
																	!passwordShowStatus,
																);
															}}
														/>
													}>
													<Input
														type={
															passwordShowStatus ? 'text' : 'password'
														}
														id='oldPassword'
														name='oldPassword'
														onChange={formik.handleChange}
														value={formik.values.oldPassword}
														autoComplete='current-password'
													/>
												</FieldWrap>
											</div>
											<div className='col-span-12'>
												<Label htmlFor='newPassword'>New Password</Label>
												<FieldWrap
													lastSuffix={
														<Icon
															className='mx-2'
															icon={
																passwordNewShowStatus
																	? 'HeroEyeSlash'
																	: 'HeroEye'
															}
															onClick={() => {
																setPasswordNewShowStatus(
																	!passwordNewShowStatus,
																);
															}}
														/>
													}>
													<Input
														type={
															passwordNewShowStatus
																? 'text'
																: 'password'
														}
														id='newPassword'
														name='newPassword'
														onChange={formik.handleChange}
														value={formik.values.newPassword}
														autoComplete='new-password'
													/>
												</FieldWrap>
											</div>
											<div className='col-span-12'>
												<Label htmlFor='newPasswordConfirmation'>
													New Password Confirmation
												</Label>
												<FieldWrap
													lastSuffix={
														<Icon
															className='mx-2'
															icon={
																passwordNewConfShowStatus
																	? 'HeroEyeSlash'
																	: 'HeroEye'
															}
															onClick={() => {
																setPasswordNewConfShowStatus(
																	!passwordNewConfShowStatus,
																);
															}}
														/>
													}>
													<Input
														type={
															passwordNewConfShowStatus
																? 'text'
																: 'password'
														}
														id='newPasswordConfirmation'
														name='newPasswordConfirmation'
														onChange={formik.handleChange}
														value={
															formik.values.newPasswordConfirmation
														}
														autoComplete='new-password'
													/>
												</FieldWrap>
											</div>
										</div>
									</>
								)}
							</div>
						</div>
					</CardBody>
					<CardFooter>
						<CardFooterChild>
							<div className='flex items-center gap-2'>
								<Icon icon='HeroDocumentCheck' size='text-2xl' />
								<span className='text-zinc-500'>Last saved:</span>
								<b>{dayjs().locale(i18n.language).format('LLL')}</b>
							</div>
						</CardFooterChild>
						<CardFooterChild>
							<Button
								icon='HeroServer'
								variant='solid'
								color={saveBtnColor}
								isDisable={saveBtnDisable}
								onClick={() => formik.handleSubmit()}>
								{saveBtnText}
							</Button>
						</CardFooterChild>
					</CardFooter>
				</Card>
			</Container>
		</PageWrapper>
	);
};

export default ProfilePage;
