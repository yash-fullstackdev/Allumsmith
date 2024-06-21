import Label from '../../../../components/form/Label';
import Button from '../../../../components/ui/Button';
import Card, {
	CardBody,
	CardHeader,
	CardHeaderChild,
	CardTitle,
} from '../../../../components/ui/Card';
import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import { appPages } from '../../../../config/pages.config';
import { Switch } from '@mui/material';
import {
	filterPermissions,
	togglePermissionAndUpdateInnerPages,
} from '../../../../utils/common.util';
import Container from '../../../../components/layouts/Container/Container';
import Input from '../../../../components/form/Input';
import Icon from '../../../../components/icon/Icon';
import { toast } from 'react-toastify';
import axios from 'axios';
import { userCreateSchema, userEditSchema } from '../../../../utils/formValidations';
import { userInitialPermission } from '../../../../constants/common/data';
import { useLocation } from 'react-router-dom';
import { userInitialValues } from '../../../../utils/initialValues';
import ErrorMessage from '../../../../components/layouts/common/ErrorMessage';

const UserPermissionForm = () => {
	const [passwordShowStatus, setPasswordShowStatus] = useState(false);
	const [permissions, setPermissions] = useState<any>({});
	const [isAllPermissions, setIsAllPermissions] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const location = useLocation();
	const searchParams = new URLSearchParams(location.search);
	const userId = searchParams.get('id');

	const formik: any = useFormik({
		initialValues: userInitialValues,
		enableReinitialize: true,
		validationSchema: userId ? userEditSchema : userCreateSchema,
		onSubmit: (values: any, { resetForm }) => {
			handleSaveUser(values, resetForm);
		},
	});

	const fetchUserById = async () => {
		try {
			const userData = await axios.get(
				`https://4818-122-179-153-131.ngrok-free.app/user/${userId}`,
				{
					headers: {
						'ngrok-skip-browser-warning': 'true',
					},
				},
			);
			return userData.data;
		} catch (error) {
			console.error('Error fetching product data:', error);
			return null;
		}
	};

	useEffect(() => {
		const fetchData = async () => {
			const userData = await fetchUserById();
			if (userData) {
				const { email, firstName, lastName, phonenumber, username, permission } = userData;
				formik.setValues({
					email,
					firstName,
					lastName,
					phoneNo: phonenumber,
					password: '',
					userName: username,
					userRole: permission.userRole,
				});
				setPermissions(permission.permissions);
			}
		};

		if (userId) {
			fetchData();
		}
	}, []);

	const handleSaveUser = async (values: any, resetForm: any) => {
		try {
			setIsLoading(true);
			const userData: any = {
				emailAddress: [values?.email],
				username: values?.userName,
				firstName: values?.firstName,
				lastName: values?.lastName,
				phoneNumber: [values?.phoneNo.trim()],
				publicMetadata: {
					permissions: filterPermissions(permissions),
					userRole: values?.userRole,
				},
			};

			// If it's a new user (userId not present), assign password
			if (!userId) {
				userData.password = values?.password;
			}

			const apiUrl = !userId
				? 'https://4818-122-179-153-131.ngrok-free.app/user'
				: `https://4818-122-179-153-131.ngrok-free.app/user/${userId}`;

			!userId ? await axios.post(apiUrl, userData) : await axios.put(apiUrl, userData);

			setPermissions({});
			setIsAllPermissions(false);
			resetForm();

			toast.success(!userId ? 'User created successfully' : 'User updated successfully');
		} catch (error: any) {
			console.error('Error saving permissions:', error);
			if (error?.response?.data?.errors?.length > 0) {
				toast.error(error.response.data.errors[0].longMessage);
			} else {
				toast.error('Error saving permissions. Please try again.');
			}
		} finally {
			setIsLoading(false);
		}
	};

	const checkAllPermission = (permissionValue: boolean) => {
		setIsAllPermissions(permissionValue);
		if (permissionValue) {
			setPermissions(userInitialPermission);
		} else {
			setPermissions({});
		}
	};

	const togglePermission = (pageId: any) => {
		setPermissions((prevPermissions: any) => {
			return togglePermissionAndUpdateInnerPages(pageId, prevPermissions, appPages);
		});
	};

	const checkUserId = (userId: any, trueValue: any, falseValue: any) => {
		if (!userId) {
			return trueValue;
		} else {
			return falseValue;
		}
	};

	return (
		<div className='col-span-12 flex flex-col gap-1 xl:col-span-6'>
			<Card>
				<CardBody>
					<Container className='flex shrink-0 grow basis-auto flex-col pb-0'>
						<div className='flex h-full flex-wrap content-start'>
							<div className='mb-4 grid w-full grid-cols-12 gap-1'>
								<div className='col-span-12 flex flex-col gap-1 '>
									<Card>
										<CardHeader>
											<CardHeaderChild>
												<CardTitle>
													<div>
														<div>
															{checkUserId(
																userId,
																'Accounts Creation',
																'Edit User',
															)}
														</div>
														<div className='text-lg font-normal text-zinc-500'>
															Here you can
															{checkUserId(
																userId,
																' create ',
																' edit ',
															)}
															users account
														</div>
													</div>
												</CardTitle>
											</CardHeaderChild>
										</CardHeader>
										<CardBody>
											<form
												onSubmit={formik.handleSubmit}
												className='space-y-4'>
												<div className='grid grid-cols-12 gap-4'>
													{[
														'email',
														'phoneNo',
														'firstName',
														'lastName',
														'userName',
														'userRole',
													].map((fieldName, index) => (
														<div
															key={index}
															className='col-span-12 lg:col-span-3'>
															{fieldName && (
																<>
																	<Label
																		htmlFor={fieldName}
																		className='capitalize'>
																		{fieldName}
																	</Label>
																	<Input
																		id={fieldName}
																		name={fieldName}
																		type='text'
																		value={
																			formik.values[fieldName]
																		}
																		onChange={
																			formik.handleChange
																		}
																		onBlur={formik.handleBlur}
																		autoComplete={
																			fieldName === 'email'
																				? 'email'
																				: 'off'
																		}
																		disabled={
																			fieldName === 'email' &&
																			!!userId
																		}
																		required={
																			fieldName === 'email'
																		}
																	/>
																	<ErrorMessage
																		touched={formik.touched}
																		errors={formik.errors}
																		fieldName={fieldName}
																	/>
																</>
															)}
														</div>
													))}
													{!userId && (
														<div className='col-span-12 lg:col-span-3'>
															<Label htmlFor='password'>
																Password
															</Label>

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
															<ErrorMessage
																touched={formik.touched}
																errors={formik.errors}
																fieldName='password'
															/>
														</div>
													)}
												</div>

												{/* Permission section */}
												<div className='mt-7 flex items-center gap-2'>
													<Label htmlFor='Add Access Permission'>
														Add Access Permission
													</Label>
													<Switch
														id='Add Access Permission'
														checked={isAllPermissions}
														onClick={() => {
															checkAllPermission(!isAllPermissions);
														}}
													/>
													<Label
														htmlFor='Add Access Permission'
														className='font-medium'>
														Select All Permission
													</Label>
												</div>

												<div className='grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6'>
													{/* Loop through permission categories */}
													{Object.keys(appPages).map((appKey) => {
														const app = appPages[appKey];
														return Object.values(app).map(
															(page: any) => {
																if (
																	page.id &&
																	page.to &&
																	page.text &&
																	page.icon
																) {
																	return (
																		<div
																			key={page.to}
																			className='mb-4'>
																			<h2 className='mb-4 text-lg font-bold capitalize'>
																				{app.identifier !==
																				'cuo'
																					? app.identifier
																					: 'customer-order'}
																			</h2>
																			<Switch
																				checked={
																					permissions[
																						page.to
																					] || false
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
																}
																return null;
															},
														);
													})}
												</div>

												<div className='flex gap-2'>
													<Button
														variant='solid'
														color='blue'
														isDisable={isLoading}
														className='h-[35px] w-[150px]'
														type='submit'>
														{!isLoading ? (
															checkUserId(
																userId,
																'Create User',
																'Edit User',
															)
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
				</CardBody>
			</Card>
		</div>
	);
};

export default UserPermissionForm;
