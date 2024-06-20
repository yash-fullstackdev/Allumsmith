import Label from '../../../../components/form/Label';
import Button from '../../../../components/ui/Button';
import Card, {
	CardBody,
	CardHeader,
	CardHeaderChild,
	CardTitle,
} from '../../../../components/ui/Card';
import { useFormik } from 'formik';
import { useState } from 'react';
import { appPages } from '../../../../config/pages.config';
import { Switch } from '@mui/material';
import { getAllInnerPages } from '../../../../utils/common.util';
import { get, post } from '../../../../utils/api-helper.util';
import PageWrapper from '../../../../components/layouts/PageWrapper/PageWrapper';
import Container from '../../../../components/layouts/Container/Container';
import Input from '../../../../components/form/Input';
import Icon from '../../../../components/icon/Icon';
import { toast } from 'react-toastify';
import axios from 'axios';
import { userCreateSchema } from '../../../../utils/formValidations';
import { userInitialPermission } from '../../../../constants/common/data';

const UserPermissionForm = () => {
	const [passwordShowStatus, setPasswordShowStatus] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const initialValues = {
		email: '',
		firstName: '',
		lastName: '',
		phoneNo: '',
		password: '',
		userName: '',
		userRole: '',
	};

	const [permissions, setPermissions] = useState<any>(userInitialPermission);
	const formik: any = useFormik({
		initialValues,
		enableReinitialize: true,
		validationSchema: userCreateSchema,
		onSubmit: (values: any, { resetForm }) => {
			handleSavePermissions(values);
			resetForm();
			setPermissions({});
		},
	});

	const handleSavePermissions = async (values: any) => {
		try {
			setIsLoading(true);
			await axios.post('https://a57e-122-179-153-131.ngrok-free.app/clerk', {
				emailAddress: [values?.email],
				username: values?.userName,
				firstName: values?.firstName,
				lastName: values?.lastName,
				phoneNumber: [values?.phoneNo],
				password: values?.password,
				publicMetadata: {
					permissions: permissions,
					userRole: values?.userRole,
				},
			});

			toast.success('User created successfully');
		} catch (error: any) {
			toast.error(error?.message);
			console.error('Error saving permissions:', error.message);
		} finally {
			setIsLoading(false);
		}
	};

	const togglePermission = (pageId: any) => {
		setPermissions((prevPermissions: any) => {
			let updatedPermissions = {
				...prevPermissions,
				[pageId.to]: !prevPermissions[pageId.to],
			};

			// Allow all inner routes if the parent route is allowed
			if (updatedPermissions[pageId.to]) {
				const pagesToUpdate = getAllInnerPages(pageId, appPages);
				pagesToUpdate.forEach((page: any) => {
					updatedPermissions = {
						...updatedPermissions,
						[page]: true,
					};
				});
			}
			return updatedPermissions;
		});
	};

	return (
		<div className='col-span-12 flex flex-col gap-1 xl:col-span-6'>
			<Card>
				<CardBody>
					<PageWrapper>
						<Container className='flex shrink-0 grow basis-auto flex-col pb-0'>
							<div className='flex h-full flex-wrap content-start'>
								<div className='mb-4 grid w-full grid-cols-12 gap-1'>
									<div className='col-span-12 flex flex-col gap-1 '>
										<Card>
											<CardHeader>
												<CardHeaderChild>
													<CardTitle>
														<div>
															<div>Accounts Creation</div>
															<div className='text-lg font-normal text-zinc-500'>
																Here you can create users account
															</div>
														</div>
													</CardTitle>
												</CardHeaderChild>
											</CardHeader>
											<CardBody>
												<form onSubmit={formik.handleSubmit}>
													<div className='grid grid-cols-8 gap-3'>
														<div className='col-span-12 lg:col-span-3'>
															<Label htmlFor='email'>Email</Label>
															<Input
																id='email'
																name='email'
																onChange={formik.handleChange}
																value={formik.values.email}
																autoComplete='email'
																required
																onBlur={formik.handleBlur}
															/>
															{formik.touched.email &&
															formik.errors.email ? (
																<div className='text-red-500'>
																	{formik.errors.email}
																</div>
															) : null}
														</div>
														<div className='col-span-12 lg:col-span-3'>
															<Label htmlFor='phoneNo'>
																Phone No
															</Label>
															<Input
																id='phoneNo'
																name='phoneNo'
																onChange={formik.handleChange}
																value={formik.values.phoneNo}
																onBlur={formik.handleBlur}
															/>
															{formik.touched.phoneNo &&
															formik.errors.phoneNo ? (
																<div className='text-red-500'>
																	{formik.errors.phoneNo}
																</div>
															) : null}
														</div>
														<div className='col-span-12 lg:col-span-3'>
															<Label htmlFor='firstName'>
																First Name
															</Label>
															<Input
																id='firstName'
																name='firstName'
																onChange={formik.handleChange}
																value={formik.values.firstName}
																// isTouched={formik.touched.firstName}
																onBlur={formik.handleBlur}
															/>
															{formik.touched.firstName &&
															formik.errors.firstName ? (
																<div className='text-red-500'>
																	{formik.errors.firstName}
																</div>
															) : null}
															{/* <ErrorMessage name='firstName' /> */}
														</div>
														<div className='col-span-12 lg:col-span-3'>
															<Label htmlFor='lastName'>
																Last Name
															</Label>
															<Input
																id='lastName'
																name='lastName'
																onChange={formik.handleChange}
																value={formik.values.lastName}
																onBlur={formik.handleBlur}
															/>
															{formik.touched.lastName &&
															formik.errors.lastName ? (
																<div className='text-red-500'>
																	{formik.errors.lastName}
																</div>
															) : null}
														</div>
														<div className='col-span-12 lg:col-span-3'>
															<Label htmlFor='userName'>
																UserName
															</Label>
															<Input
																id='userName'
																name='userName'
																onChange={formik.handleChange}
																value={formik.values.userName}
																onBlur={formik.handleBlur}
															/>
															{formik.touched.userName &&
															formik.errors.userName ? (
																<div className='text-red-500'>
																	{formik.errors.userName}
																</div>
															) : null}
														</div>

														<div className='col-span-12 lg:col-span-3'>
															<Label htmlFor='userRole'>
																UserRole
															</Label>
															<Input
																id='userRole'
																name='userRole'
																onChange={formik.handleChange}
																value={formik.values.userRole}
																onBlur={formik.handleBlur}
															/>
															{formik.touched.userRole &&
															formik.errors.userRole ? (
																<div className='text-red-500'>
																	{formik.errors.userRole}
																</div>
															) : null}
														</div>

														{/* {isNewUser && ( */}
														<div className='col-span-12 lg:col-span-3'>
															<Label htmlFor='password'>
																Password
															</Label>
															{/* <FieldWrap> */}
															<div className='relative'>
																<Input
																	type={
																		passwordShowStatus
																			? 'text'
																			: 'password'
																	}
																	id='password'
																	name='password'
																	onChange={formik.handleChange}
																	value={formik.values.password}
																	onBlur={formik.handleBlur}
																/>
																<Icon
																	className='absolute right-4 top-1/2 -translate-y-1/2 transform cursor-pointer'
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
															</div>
															{formik.touched.password &&
																formik.errors.password && (
																	<div className='text-red-500'>
																		{formik.errors.password}
																	</div>
																)}
															{/* </FieldWrap> */}
														</div>
														{/* )} */}
													</div>

													<div className='mt-7 flex flex-wrap '>
														<Label htmlFor='Add Access Permission'>
															Add Access Permission
														</Label>
														{Object.keys(appPages).map((appKey) => {
															const app = appPages[appKey];
															return (
																<div
																	key={appKey}
																	className='mt-4 w-1/2 md:w-1/3 lg:w-1/5 xl:w-1/6'>
																	<h2 className='mb-4 text-lg font-bold capitalize'>
																		{app.identifier !== 'cuo'
																			? app.identifier
																			: 'customer-order'}
																	</h2>
																	{Object.values(app).map(
																		(page: any) => {
																			if (
																				page.id &&
																				page.to &&
																				page.text &&
																				page.icon
																			) {
																				return (
																					<div
																						key={
																							page.to
																						}
																						className='mb-4'>
																						<Switch
																							checked={
																								permissions[
																									page
																										.to
																								] ||
																								false
																							}
																							onClick={() =>
																								togglePermission(
																									{
																										...page,
																										appKey,
																									},
																								)
																							}
																						/>
																					</div>
																				);
																			} else {
																				return null;
																			}
																		},
																	)}
																</div>
															);
														})}
													</div>
													<div className='flex gap-2'>
														<Button
															variant='solid'
															color='blue'
															isDisable={isLoading}
															className=' h-[35px] w-[150px]'
															type='submit'>
															{!isLoading ? (
																'Create User'
															) : (
																<div className='h-6 w-6 animate-spin rounded-full border-[2px] border-b-blue-500'></div>
															)}
														</Button>
													</div>
												</form>
											</CardBody>
										</Card>
									</div>
								</div>
							</div>
						</Container>
					</PageWrapper>
				</CardBody>
			</Card>
		</div>
	);
};

export default UserPermissionForm;
