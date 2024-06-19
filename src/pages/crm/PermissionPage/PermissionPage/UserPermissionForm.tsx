import Label from '../../../../components/form/Label';
import Button from '../../../../components/ui/Button';
import Card, { CardBody } from '../../../../components/ui/Card';
import { useFormik } from 'formik';
import SelectReact from '../../../../components/form/SelectReact';
import { useEffect, useState } from 'react';
import { appPages } from '../../../../config/pages.config';
import { Switch } from '@mui/material';
import { getAllInnerPages } from '../../../../utils/common.util';
import { get, post } from '../../../../utils/api-helper.util';
import { toast } from 'react-toastify';

interface Page {
	id: string;
	to: string;
	text: string;
	icon: string;
}

const UserPermissionForm = () => {
	const [usersData, setUsersData] = useState([]);
	const [customerId, setCustomerId] = useState('');
	const [customerName, setCustomerName] = useState('');
	const [currentCustomerData, setCurrentCustomerData] = useState<any>({});
	const [permissions, setPermissions] = useState<any>({});

	// const getAllUsersData = async () => {
	// 	try {
	// 		const data = await get('');
	// 		console.log(data, 'data');
	// 		// setCustomerData(allVendorData);
	// 	} catch (error: any) {
	// 		console.error('Error fetching users:', error.message);
	// 	}
	// };

	// const handleSavePermissions = async () => {
	// 	try {
	// 		const response = await post('/api/save-permissions', permissions);
	// 		toast.success('Permissions saved successfully:');
	// 	} catch (error: any) {
	// 		console.error('Error saving permissions:', error.message);
	// 	}
	// };

	// useEffect(() => {
	// 	getAllUsersData();
	// }, []);

	const togglePermission = (pageId: any) => {
		console.log(pageId, 'ASd');
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
			console.log(updatedPermissions, 'Ads');
			return updatedPermissions;
		});
	};

	const formik: any = useFormik({
		initialValues: {
			entries: [
				{
					name: '',
					hsn: '',
					rate: '',
					productCode: '',
					thickness: '',
					length: '',
					weight: '',
					premium_rate: '',
					wooden_rate: '',
					commercial_rate: '',
					anodize_rate: '',
				},
			],
		},
		// validationSchema: productsSchema,
		onSubmit: () => {},
	});

	const SetCurrentCustomerData = (id: string) => {
		setCurrentCustomerData(
			usersData.find((customer: any) => customer._id.toString() === id.toString()),
		);
	};

	return (
		<div className='col-span-12 flex flex-col gap-1 xl:col-span-6'>
			<Card>
				<CardBody>
					<div className='flex'>
						<div className='bold w-full'>
							<Button
								variant='outlined'
								className='flex w-full items-center justify-between rounded-none border-b px-[2px] py-[0px] text-start text-lg font-bold'>
								Add Users Permission
							</Button>
						</div>
					</div>

					{formik.values.entries.map((entry: any, index: any) => (
						<div className='relative py-5' key={index + entry}>
							<div className='mt-2 grid grid-cols-12 gap-1'>
								<div className='col-span-6 lg:col-span-4'>
									<Label htmlFor='customerName'>
										Customer
										<span className='ml-1 text-red-500'>*</span>
									</Label>
									<SelectReact
										id={`name`}
										name={`name`}
										options={usersData.map((customer: any) => ({
											value: customer._id,
											label: customer.name,
										}))}
										value={{ value: customerId, label: customerName }}
										onChange={(selectedOption: any) => {
											setCustomerId(selectedOption.value);
											setCustomerName(selectedOption.label);
											SetCurrentCustomerData(selectedOption.value);
										}}
									/>
								</div>
							</div>
						</div>
					))}
					<form className='flex flex-wrap justify-center'>
						{Object.keys(appPages).map((appKey) => {
							const app = appPages[appKey];
							return (
								<div key={appKey} className='w-1/2 px-4 md:w-1/3 lg:w-1/5 xl:w-1/6'>
									<h2 className='mb-4 text-lg font-bold'>
										{app.identifier !== 'cuo'
											? app.identifier
											: 'customer-order'}
									</h2>
									{Object.values(app).map((page: any) => {
										if (page.id && page.to && page.text && page.icon) {
											return (
												<div key={page.to} className='mb-4'>
													<Switch
														checked={permissions[page.to] || false}
														onClick={() =>
															togglePermission({ ...page, appKey })
														}
													/>
												</div>
											);
										} else {
											return null;
										}
									})}
								</div>
							);
						})}
					</form>

					<div className='mt-2 flex gap-2'>
						<Button
							variant='solid'
							color='blue'
							type='submit'
							onClick={() => {
								localStorage.setItem('permissions', JSON.stringify(permissions));
							}}>
							Save permissions
						</Button>
					</div>
				</CardBody>
			</Card>
		</div>
	);
};

export default UserPermissionForm;
