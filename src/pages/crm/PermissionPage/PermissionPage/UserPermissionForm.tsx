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
import Container from '../../../../components/layouts/Container/Container';
import Input from '../../../../components/form/Input';
import Icon from '../../../../components/icon/Icon';
import { toast } from 'react-toastify';
import { userCreateSchema, userEditSchema } from '../../../../utils/formValidations';
import { useLocation, useNavigate } from 'react-router-dom';
import { userInitialValues } from '../../../../utils/initialValues';
import ErrorMessage from '../../../../components/layouts/common/ErrorMessage';
import { get, post, put } from '../../../../utils/api-helper.util';
import SelectReact from '../../../../components/form/SelectReact';

const UserPermissionForm = () => {
	// State variables
	const [passwordShowStatus, setPasswordShowStatus] = useState(false);
	const [permissions, setPermissions] = useState<any>({});
	const [isLoading, setIsLoading] = useState(false);
	const [roleList, setRoleList] = useState<any>([]);
	const [permissionCred, setPermissionsCred] = useState<any>({});
	const [selectAllValues, setSelectAllValues] = useState<any>({
		read: false,
		write: false,
		delete: false,
		selectedAll: false,
	});
	const [isSelectedRawValue, setIsSelectedRawValue] = useState<any>({});

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

	const fetchRoles = async () => {
		try {
			const { data } = await get(`/roles`);
			setRoleList(data?.data);
		} catch (error: any) {
			console.log(error, 'fetch roles error');
		}
	};

	// Effect to fetch user data if userId is present
	useEffect(() => {
		fetchRoles();
		const fetchData = async () => {
			const userData = await fetchUserById();
			if (userData) {
				const { email, firstName, lastName, phonenumber, role_id} = userData;
				console.log(userData,"userData")
				formik.setValues({
					email,
					firstName,
					lastName,
					phoneNo: phonenumber,
					password: '',
					userRole: role_id,
				});
				setPermissions(role_id.permissions);
				setPermissionsCred(role_id?.permissionCred);
			}
		};

		if (userId) {
			fetchData();
		}
	}, []);

	// // Function to handle save/update user
	const handleSaveUser = async (values: any, resetForm: any) => {
		try {
			setIsLoading(true);
			const userData: any = {
				emailAddress: [values?.email],
				firstName: values?.firstName,
				lastName: values?.lastName,
				phoneNumber: [values?.phoneNo.trim()],
				role_id: values?.userRole?._id,
				publicMetadata: {
					permissions: values?.userRole?.permissions,
					userRole: values?.userRole?.name,
					permissionsCred: values?.userRole?.permissionCred,
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

	
	// Helper function to conditionally render elements based on userId presence
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
													].map((fieldName, index) => (
														<div
															key={index}
															className='col-span-12 lg:col-span-4'>
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
														<div className='col-span-12 lg:col-span-4'>
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

													<div className='col-span-12 lg:col-span-4'>
														<Label htmlFor='password'>
															User Role
															<span className='text-red-500'>*</span>
														</Label>
														<SelectReact
															name='userRole'
															className='w-64'
															value={{
																value:
																	formik.values?.userRole?._id ||
																	'',
																label: formik.values?.userRole
																	?.name,
															}}
															options={
																roleList &&
																roleList.map((role: any) => ({
																	value: role._id,
																	label: role.name,
																	data: role,
																}))
															}
															onBlur={formik.handleBlur}
															menuPlacement='auto'
															onChange={(selectedOption: any) => {
																formik.setFieldValue(
																	'userRole',
																	selectedOption.data,
																);
															}}
														/>
														<ErrorMessage
															touched={formik.touched}
															errors={formik.errors}
															fieldName='userRole'
														/>
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
