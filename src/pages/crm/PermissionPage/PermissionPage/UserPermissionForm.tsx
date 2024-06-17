import Label from '../../../../components/form/Label';
import Input from '../../../../components/form/Input';
import Button from '../../../../components/ui/Button';
import Card, { CardBody } from '../../../../components/ui/Card';
import { useFormik } from 'formik';
import SelectReact from '../../../../components/form/SelectReact';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { appPages } from '../../../../config/pages.config';
import { Switch } from '@mui/material';

// Define types for the appPages object and the page objects it contains
interface Page {
	id: string;
	to: string;
	text: string;
	icon: string;
}

interface AppPages {
	[key: string]: {
		identifier: string;
		[key: string]: Page | string; // Allow for any additional properties in each section
	};
}

const UserPermissionForm = () => {
	const [customerData, setCustomerData] = useState([]);
	const [customerId, setCustomerId] = useState('');
	const [customerName, setCustomerName] = useState('');
	const [currentCustomerData, setCurrentCustomerData] = useState<any>({});
	const [permissions, setPermissions] = useState<any>({});

	// Function to toggle permission for a route
	const togglePermission = (pageId: string) => {
		setPermissions((prevPermissions: any) => ({
			...prevPermissions,
			[pageId]: !prevPermissions[pageId],
		}));
	};

	// const fetchVendorData = async () => {
	// 	try {
	// 		const clientId = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
	// 		const clientSecret = import.meta.env.VITE_CLERK_ID;

	// 		const authEndpoint =
	// 			'https://corsproxy.io/?' +
	// 			encodeURIComponent('https://api.clerk.com/auth/v1/token');
	// 		const token = axios.post(authEndpoint, {
	// 			client_id: clientId,
	// 			client_secret: clientSecret,
	// 		});

	// 		const data = await axios.get(
	// 			'https://corsproxy.io/?' +
	// 				encodeURIComponent(
	// 					'https:api.clerk.com/v1/users?offset=0&order_by=-created_at',
	// 				),
	// 			{
	// 				headers: {
	// 					Authorization: `Bearer ${token}`,
	// 				},
	// 			},
	// 		);
	// 		console.log(data, 'data');
	// 		// setCustomerData(allVendorData);
	// 	} catch (error: any) {
	// 		console.error('Error fetching users:', error.message);
	// 	}
	// };

	// useEffect(() => {
	// 	fetchVendorData();
	// }, []);
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
			customerData.find((customer: any) => customer._id.toString() === id.toString()),
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
										options={customerData.map((customer: any) => ({
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
								<div
									key={app.identifier}
									className='w-1/2 px-4 md:w-1/3 lg:w-1/5 xl:w-1/6'>
									<h2 className='mb-4 text-lg font-bold'>{app.identifier}</h2>
									{Object.values(app).map((page: any) => {
										if (page.id && page.to && page.text && page.icon) {
											return (
												<div key={page.id} className='mb-4'>
													<Switch
														{...Label}
														// label={page.text}
														checked={permissions[page.to] || false}
														onClick={() => togglePermission(page.to)}
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
