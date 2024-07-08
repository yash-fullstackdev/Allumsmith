import { useEffect, useState } from 'react';
import Button from '../../../../components/ui/Button';
import Card, {
	CardBody,
	CardHeader,
	CardHeaderChild,
	CardTitle,
} from '../../../../components/ui/Card';
import { Input,Label,Checkbox } from '../../../../components/form';
import { useFormik } from 'formik';
import { appPages } from '../../../../config/pages.config';
import Container from '../../../../components/layouts/Container/Container';
import { toast } from 'react-toastify';
import { roleSchema } from '../../../../utils/formValidations';
import { permissionsTypes } from '../../../../constants/common/data';
import { useLocation, useNavigate } from 'react-router-dom';
import ErrorMessage from '../../../../components/form/ErrorMessage';
import { get, post, put } from '../../../../utils/api-helper.util';
import {
	checkUserId,
	createPermissionsData,
	extractInnerRoutes,
	filterPermissions,
	getAllMainRoute,
	handelAllSelections,
	handleSelectAllPermission,
	togglePermissionAndUpdateInnerPages,
	updateInnerPagePermissions,
	updatePermissions,
	updatePermissionsStates,
	updateRoutePermissions,
	updateSelectAllValues,
} from '../../../../utils/userPermission.util';

const RoleCreationForm = () => {
	// State variables
	const [permissions, setPermissions] = useState<any>({});
	const [isLoading, setIsLoading] = useState(false);
	const [permissionCred, setPermissionsCred] = useState<any>({});
	const [selectAllValues, setSelectAllValues] = useState<any>({
		read: false,
		write: false,
		delete: false,
		selectedAll: false,
	});
	const [isSelectedRawValue, setIsSelectedRawValue] = useState<any>({});
    const [permissionRoutes,setPermissionsRoutes] = useState<any>([])

	// Extracting userId from query params
	const location = useLocation();
	const navigate = useNavigate();
	const searchParams = new URLSearchParams(location.search);
	const userId = searchParams.get('id');

	// Formik setup
	const formik: any = useFormik({
		initialValues: {
			roleName: '',
		},
		enableReinitialize: true,
		validationSchema: roleSchema,
		onSubmit: (values: any, { resetForm }) => {
			handleSaveRole(values, resetForm);
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

	// Function to handle save/update Role
	const handleSaveRole = async (values: any, resetForm: any) => {
        try {
            setIsLoading(true);
            const userData: any = {
                name: values.roleName,
                permissions: filterPermissions(permissions),
                permissionCred: permissionCred,
            };
    
            // Ensure permissions and permissionsCred are properly initialized as objects
            userData.permissions = userData.permissions || {};
            userData.permissionsCred = userData.permissionsCred || {};
    
            // Extract paths to remove from adminPage
            const pathsToRemove = Object.values(appPages?.adminPage).map((page: any) => page.to);
    
            // Filter out permissions
            userData.permissions = Object.keys(userData.permissions)
                .filter((path) => !pathsToRemove.includes(path))
                .reduce((obj: any, key) => {
                    obj[key] = userData.permissions[key];
                    return obj;
                }, {});


            const apiUrl = true ? '/roles' : `/users/${userId}`;
    
            // Uncomment when ready to perform API call
            !userId ? await post(apiUrl, userData) : await put(apiUrl, userData);
    
            resetForm();
            navigate('/roles');
    
            toast.success(true ? 'Role created successfully' : 'Role updated successfully');
        } catch (error: any) {
            console.error('Error saving permissions:', error);
            toast.error(error?.response?.data?.message);
        } finally {
            setIsLoading(false);
        }
    };
    

	// Function to toggle all permissions
	const checkAllPermission = (permissionValue: boolean) => {
		setSelectAllValues(handelAllSelections(permissionValue));
		updatePermissionsStates(
			permissionValue,
			setPermissions,
			setPermissionsCred,
			setIsSelectedRawValue,
		);
	};

	const togglePermission = (page: any, permissionType: any, isWrite: any) => {
		setPermissionsCred((prevPermissions: any) => {
			const updatedPermissions = updatePermissions(page?.to, permissionType, prevPermissions);
			return updatedPermissions;
		});
		setPermissions((prevPermissions: any) => {
			return togglePermissionAndUpdateInnerPages(
				page,
				prevPermissions,
				permissionType,
				isWrite,
			);
		});
        if(page?.to === "/add-payment" ){
            setPermissionsCred({...permissionCred,"/add-payment":{
                "read":permissions?.[page?.to],
                "write":permissions?.[page?.to],
                "delete":permissions?.[page?.to]
            }})
        }
	};

	const handelRoutePermissionSelection = (route: string, value: boolean, pageId: string) => {
		setPermissionsCred((prevPermissions: any) => {
			const updatedPermissions = updateRoutePermissions(route, value, prevPermissions);
			setPermissions((prevPermissions: any) => {
				return updateInnerPagePermissions(pageId, !value, prevPermissions);
			});
         
			return updatedPermissions;
		});
	};
	useEffect(() => {
        setPermissionsRoutes(getAllMainRoute())
        setPermissions(extractInnerRoutes(appPages, false));
		setPermissionsCred(createPermissionsData(appPages, false));
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
			permissionRoutes,
			setPermissionsCred,
			setPermissions,
			permissions,
            setSelectAllValues
		);
	};

	useEffect(() => {
		const { updatedSelectedRawValue, selectAllValues } = updateSelectAllValues(permissionCred);
		setIsSelectedRawValue(updatedSelectedRawValue);
		setSelectAllValues(selectAllValues);
	}, [permissionCred]);

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
																'Roles Creation',
																'Edit Roles',
															)}
														</div>
														<div className='text-lg font-normal text-zinc-500'>
															Here you can
															{checkUserId(
																userId,
																' create ',
																' edit ',
															)}
															roles
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
													<div
														key='roleName'
														className='col-span-12 lg:col-span-3'>
														<>
															<Label
																htmlFor='roleName'
																className='capitalize'>
																roleName
																<span className='text-red-500'>
																	*
																</span>
															</Label>
															<Input
																id='roleName'
																name='roleName'
																type='text'
																value={formik.values['roleName']}
																onChange={formik.handleChange}
																onBlur={formik.handleBlur}
																autoComplete='off'
															/>
															<ErrorMessage
																touched={formik.touched}
																errors={formik.errors}
																fieldName='roleNamw'
															/>
														</>
													</div>
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
																Role Privileges
															</div>
														</div>
													</CardTitle>

													<div className='w- mt-4 overflow-x-auto'>
														<table className='min-w-full  bg-white dark:bg-[#27272a]'>
															<thead className='bg-gray-200  dark:bg-[#27272a]'>
																<tr>
																	<th className='px-4 py-2'>
																		<td className='flex w-full  items-center'>
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
																					borderClass='border-gray-400 dark:border-white'
																					className='mr-2 rounded'
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
																						borderClass='border-gray-400 dark:border-white'
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
																						className='border-x border-b transition-colors dark:border-x-0 dark:bg-[#101011]'>
																						<td className='px-4 py-2'>
																							<div className='flex items-center text-xl font-medium text-blue-600'>
																								<Checkbox
																									id={`${page?.to}-${page.text}`}
																									name={`${page?.to}`}
																									borderClass='border-gray-400 dark:border-white'
																									checked={
																										isSelectedRawValue[
																											page?.to
																										]
																									}
																									onChange={(
																										e: any,
																									) => {
																										setIsSelectedRawValue(
																											{
																												...isSelectedRawValue,
																												[e
																													.target
																													.name]:
																													e
																														.target
																														.checked,
																											},
																										);

																										handelRoutePermissionSelection(
																											page?.to,
																											e
																												.target
																												.checked,
                                                                                                                {
                                                                                                                    ...page,
                                                                                                                    appKey,
                                                                                                                },
																										);
																									}}
																									className='mr-2 rounded border-gray-800 text-blue-600 focus:ring-blue-500'
																								/>
																								<span>
																									{
																										page?.text
																									}
																								</span>
																							</div>
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
																												borderClass='border-gray-400 dark:border-white'
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
															'Create Role',
															'Edit Role',
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

export default RoleCreationForm;
