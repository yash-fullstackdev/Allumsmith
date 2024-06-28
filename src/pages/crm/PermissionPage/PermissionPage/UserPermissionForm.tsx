
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
import {
	allReadPermissionsTrueData,
	extractInnerRoutes,
	filterPermissions,
	getAllInnerPages,
	handleSelectAllPermission,
	isSelectedAll,
	togglePermissionAndUpdateInnerPages,
	updateCredPermissions,
} from '../../../../utils/common.util';
import Container from '../../../../components/layouts/Container/Container';
import Input from '../../../../components/form/Input';
import Icon from '../../../../components/icon/Icon';
import { toast } from 'react-toastify';
import { userCreateSchema, userEditSchema } from '../../../../utils/formValidations';
import {
	pagesToCheck,
	permissionCredAll,
	permissionsTypes,
	userInitialPermission,
} from '../../../../constants/common/data';
import { useLocation, useNavigate } from 'react-router-dom';
import { userInitialValues } from '../../../../utils/initialValues';
import ErrorMessage from '../../../../components/layouts/common/ErrorMessage';
import { get, post, put } from '../../../../utils/api-helper.util';
import Checkbox from '../../../../components/form/Checkbox';

const UserPermissionForm = () => {
	// State variables
	const [passwordShowStatus, setPasswordShowStatus] = useState(false);
	const [permissions, setPermissions] = useState<any>({});
	const [isLoading, setIsLoading] = useState(false);
	const [permissionCred, setPermissionsCred] = useState<any>({});
	const [selectAllValues, setSelectAllValues] = useState<any>({
		read: false,
		write: false,
		delete: false,
		selectedAll: false,
	});

	// Extracting userId from query params
	const location = useLocation();
	const navigate = useNavigate();
	const searchParams = new URLSearchParams(location.search);
	const userId = searchParams.get('id');

	// Formik setup
	const formik: any = useFormik({
		initialValues: userInitialValues,
		enableReinitialize: true,
		validationSchema: userId ? userEditSchema : userCreateSchema,
		onSubmit: (values: any, { resetForm }) => {
			handleSaveUser(values, resetForm);
		},
	});

	// Function to fetch user data by userId
	const fetchUserById = async () => {
		try {
			const userData = await get(`/users/${userId}`);
			return userData.data;
		} catch (error) {
			console.error('Error fetching product data:', error);
			return null;
		}
	};

	// Effect to fetch user data if userId is present
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
				setPermissionsCred(permission?.permissionsCred);
			}
		};

		if (userId) {
			fetchData();
		}
	}, []);

	// Function to handle save/update user
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
					permissionsCred: permissionCred,
				},
			};

			// If it's a new user (userId not present), assign password
			if (!userId) {
				userData.password = values?.password;
			}

			const apiUrl = !userId ? '/users' : `/users/${userId}`;

			!userId ? await post(apiUrl, userData) : await put(apiUrl, userData);

			
			resetForm();
			navigate('/users');

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

	// Function to toggle all permissions
	const checkAllPermission = (permissionValue: boolean) => {
		setSelectAllValues((prevSelectAllValues:any) => ({
		  ...prevSelectAllValues,
		  selectedAll: permissionValue,
		}));
	
		  if (permissionValue) {
			setPermissions(extractInnerRoutes(appPages, true));
			setPermissionsCred(createPermissionsData(appPages, true));
			setSelectAllValues({
				read: true,
				write: true,
				delete: true,
				selectedAll: true,
			})
		  } else {
			setPermissions(extractInnerRoutes(appPages, false));
			setPermissionsCred(createPermissionsData(appPages, false));
			setSelectAllValues({
				read: false,
				write: false,
				delete: false,
				selectedAll: false,
			})
		  }
	
	  };

	  console.log(permissionCred,permissions,"chejcdhs")

	const togglePermission = (pageId: any, type: any, writeRemove: any) => {

		setPermissionsCred((prevPermissions: any) => {
			const updatedPermissions = {
				...prevPermissions,
				[pageId?.to]: {
					...(prevPermissions[pageId?.to] || {
						read: false,
						write: false,
						delete: false,
					}),
					[type]: !prevPermissions[pageId?.to]?.[type],
				},
			};

			// Ensure 'read' is true if 'write' or 'delete' is being toggled on
			if ((type === 'write' || type === 'delete') && updatedPermissions[pageId?.to][type]) {
				updatedPermissions[pageId?.to].read = true;
			}

			// Ensure 'write' and 'delete' are false if 'read' is set to false
			if (type === 'read' && !updatedPermissions[pageId?.to].read) {
				updatedPermissions[pageId?.to].write = false;
				updatedPermissions[pageId?.to].delete = false;
			}

			return updatedPermissions;
		});
		setPermissions((prevPermissions: any) => {
			return togglePermissionAndUpdateInnerPages(
				pageId,
				prevPermissions,
				appPages,
				type,
				writeRemove,
			);
		});
	};

	const createPermissionsData = (pages: any, value:any) => {
		const permissions: any = {};

		const addPermissions = (route: any) => {
			permissions[route] = {
				read: value,
				write: value,
				delete: value,
			};
		};

		Object.values(pages).forEach((pageGroup: any) => {
			addPermissions(pageGroup?.listPage?.to);
		});

		return permissions;
	};

	useEffect(() => {
		setPermissionsCred(createPermissionsData(appPages,false));
	}, []);

	const handleCheckboxChange = (actionType: string, value: boolean) => {
		setSelectAllValues((prevState: any) => ({
			...prevState,
			[actionType]: value,
		}));

		handleSelectAll(actionType, value);
	};

	const handleSelectAll = (actionType: string, value: boolean) => {
		handleSelectAllPermission(
			actionType,
			value,
			pagesToCheck,
			appPages,
			setPermissionsCred,
			setPermissions,
			setSelectAllValues,
			selectAllValues,
		);
	};

	// Helper function to conditionally render elements based on userId presence
	const checkUserId = (userId: any, trueValue: any, falseValue: any) => {
		if (!userId) {
			return trueValue;
		} else {
			return falseValue;
		}
	};



	// useEffect to set isAllPermissions based on permissions changes
	useEffect(() => {
		setSelectAllValues({...selectAllValues,selectedAll:isSelectedAll(appPages,permissions)});
	}, []);



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
																		<span className='text-red-500'>
																			*
																		</span>
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
																Password{' '}
																<span className='text-red-500'>
																	*
																</span>
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

												<div className='rounded-lg bg-white p-6 shadow-[rgba(17,_17,_26,_0.1)_0px_0px_16px] dark:bg-[#09090b]'>
													<CardTitle>
														<div className='flex flex-col  gap-2'>
															<div>Add Privileges</div>
															<div className='text-lg font-normal text-zinc-500'>
																Here you can
																{checkUserId(
																	userId,
																	' create ',
																	' edit ',
																)}
																users Privileges
															</div>
														</div>
													</CardTitle>

													<div className='w- mt-4 overflow-x-auto'>
														<table className='min-w-full  bg-white dark:bg-[#27272a]'>
															<thead className='bg-gray-200  dark:bg-[#27272a]'>
																<tr>
																	<th className='px-4 py-2'>
																		<td className='flex items-center  w-full'>
																			<span className='w-1/1'>
																				<Checkbox
																					checked={
																						selectAllValues?.selectedAll
																					}
																					onClick={() => {
																						checkAllPermission(
																							!selectAllValues?.selectedAll,
																						);
																					
																					}}
																					className='mr-2 rounded border-gray-800 text-blue-600 focus:ring-blue-500'
																				/>
																			</span>
																			<span className='w-full text-center'>
																				Module
																			</span>
																		</td>
																	</th>

																	{permissionsTypes.map(
																		(value: string) => (
																			<th
																				className='px-4 py-2 capitalize '
																				key={value}>
																				<td className='flex items-center justify-center'>
																					<Checkbox
																						id={value}
																						name={value}
																						inputClassName=''
																						checked={
																							selectAllValues[
																								value
																							]
																						}
																						onChange={(
																							e: any,
																						) =>
																							handleCheckboxChange(
																								value,
																								e
																									.target
																									.checked,
																							)
																						}
																						className='mr-2 rounded border-gray-800 text-blue-600 focus:ring-blue-500'
																					/>
																					{value}
																				</td>
																			</th>
																		),
																	)}
																</tr>
															</thead>
															<tbody>
																{Object.keys(appPages)
																	.slice(1)
																	.map((appKey) => {
																		const app =
																			appPages?.[appKey];
																		return Object.values(
																			app,
																		)?.map((page: any) => {
																			if (
																				page.id &&
																				page.to &&
																				page.text &&
																				page.icon
																			) {
																				return (
																					<tr
																						key={
																							page.to
																						}
																						className='border-x border-b transition-colors hover:bg-gray-300 dark:border-x-0 dark:bg-[#101011] dark:hover:bg-[#15151e]'>
																						<td className='px-4 py-2'>
																							<span className='text-xl font-medium text-blue-600'>
																								{
																									page?.text
																								}
																							</span>
																						</td>

																						{permissionsTypes.map(
																							(
																								permissionType,
																							) => (
																								<td
																									key={`${page?.to}-${permissionType}`}
																									className='px-4 py-2'>
																									<div className='flex items-center justify-center'>
																										{!(
																											page?.to ===
																												'/add-payment' &&
																											permissionType !==
																												'read'
																										) && (
																											<Checkbox
																												id={`${page?.to}-${permissionType}`}
																												name={`${page?.to}-${permissionType}`}
																												inputClassName='ml-14'
																												checked={
																													permissionCred[
																														page?.to
																													]?.[
																														permissionType
																													] ||
																													false
																												}
																												onChange={(
																													e,
																												) => {
																													const target =
																														e.target as HTMLInputElement;
																													togglePermission(
																														{
																															...page,
																															appKey,
																															permissionType,
																															checked:
																																target.checked,
																														},
																														permissionType,
																														permissionCred[
																															page
																																.to
																														]?.[
																															permissionType
																														] &&
																															(permissionType ===
																																'write' ||
																																permissionType ===
																																	'read'),
																													);
																												}}
																												className='mr-2 rounded border-gray-800 text-blue-600 focus:ring-blue-500'
																											/>
																										)}
																									</div>
																								</td>
																							),
																						)}
																					</tr>
																				);
																			}
																			return null;
																		});
																	})}
															</tbody>
														</table>
													</div>
												</div>

												<div className='flex gap-2'>
													<Button
														variant='solid'
														color='blue'
														isDisable={isLoading}
														isLoading={isLoading}
														className='h-[35px] w-[150px]'
														type='submit'>
														{checkUserId(
															userId,
															'Create User',
															'Edit User',
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

