import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { get, put } from '../../../../utils/api-helper.util';
import Card, { CardBody } from '../../../../components/ui/Card';
import Button from '../../../../components/ui/Button';
import Label from '../../../../components/form/Label';
import PageWrapper from '../../../../components/layouts/PageWrapper/PageWrapper';
import Container from '../../../../components/layouts/Container/Container';
import { toast } from 'react-toastify';
import { PathRoutes } from '../../../../utils/routes/enum';
import Subheader, {
	SubheaderLeft,
	SubheaderSeparator,
} from '../../../../components/layouts/Subheader/Subheader';
import Tooltip from '../../../../components/ui/Tooltip';
import Icon from '../../../../components/icon/Icon';
import { CustomerSchema } from '../../../../utils/formValidations';
import { useFormik } from 'formik';
import CustomerForm from '../../../../components/PageComponets/CustomerForm/CustomerPage';

const initialValues = {
	name: '',
	email: '',
	phone: '',
	gst_number: '',
	company: '',
	address_line1: '',
	address_line2: '',
	city: '',
	state: '',
	zipcode: '',
	premium_discount: '',
	anodize_discount: '',
	commercial_discount: '',
	file: [],
	savedFiles: [],
}

const EditCustomerPage = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const [isLoading, setIsLoading] = useState(false);

	const formik: any = useFormik({
		initialValues: initialValues,
		validationSchema: CustomerSchema,
		onSubmit: async (values) => {
			const formDataValue: any = new FormData();
			console.log('values :>> ', values);
			Object.entries(values).forEach(([key, value]: any) => {
				if (key !== 'file' && key !== 'savedFiles') {
					formDataValue.append(key, value);
				}
				if (key === 'file') {
					values?.file?.forEach((item: any) => {
						formDataValue.append('file', item);
					});
				};

				if (key === 'savedFiles') {
					values?.savedFiles
						?.filter((item: any) => !item.add)
						.map(({ add, ...fileWithoutAdd }: any) => {
							return JSON.stringify(fileWithoutAdd);
						})
						?.forEach((item) => {
							formDataValue.append('deletedFiles', item);
						});
				}
			});

			try {
				await put(`/customers/${id}`, formDataValue,);
				toast.success('Customer edited Successfully!');
				setIsLoading(false);
				navigate(PathRoutes.customer);
			} catch (error: any) {
				setIsLoading(false);
				console.error('Error Updating Customer', error);
				toast.error('Error Updating Customer', error);
			}
		}
	});

	const fetchCustomerById = async () => {
		try {
			const customer = await get(`/customers/${id}`);
			const { name, email, phone, gst_number, company, address_line1, address_line2, city, state, zipcode, premium_discount, anodize_discount, commercial_discount, file } = customer.data;
			formik.setValues({
				name,
				email,
				phone,
				gst_number,
				company,
				address_line1,
				address_line2,
				city,
				state,
				zipcode,
				premium_discount,
				anodize_discount,
				commercial_discount,
				file: [],
				savedFiles: (file && file?.length > 0) ? file?.map((file: any) => {
					return { ...file, add: true };
				}) : [],
			});
		} catch (error) {
			console.error('Error fetching Customer data:', error);
		}
	};

	useEffect(() => {
		fetchCustomerById();
	}, []);

	const handleSaveFileAddRemove = (index: number) => {
		const updatedFilesArray = formik?.values?.savedFiles?.map((item: any, idx: number) => {
			if (index === idx) {
				return {
					...item,
					add: !item?.add
				}
			}
			return item
		})

		formik?.setFieldValue('savedFiles', updatedFilesArray);
	}

	return (
		<PageWrapper name='Edit Customer' isProtectedRoute={true}>
			<Subheader>
				<SubheaderLeft>
					<Button
						icon='HeroArrowLeft'
						className='!px-0'
						onClick={() => navigate(`${PathRoutes.customer}`)}>
						{`${window.innerWidth > 425 ? 'Back to List' : ''}`}
					</Button>
					<SubheaderSeparator />
				</SubheaderLeft>
			</Subheader>
			<Container className='flex shrink-0 grow basis-auto flex-col '>
				<Card>
					<CardBody>
						<CustomerForm formik={formik} />
						{formik?.values?.savedFiles?.length > 0 ? (
							<div className='col-span-12 flex flex-col gap-2 mt-2'>
								<Label htmlFor=''>Edit upload documents</Label>
								<div className='flex gap-2 flex-wrap'>
									{formik?.values?.savedFiles?.map((file: any, index: number) => (
										<div className='w-fit p-1.5 rounded-lg bg-zinc-200 dark:bg-zinc-600 flex items-center gap-2'>
											{file?.fileName?.split('-')[1]}
											<Tooltip text={"View File"} placement='top'>
												<Link
													to={file?.fileUrl}
													className='font-medium'
													target='_blank'
												>
													<Icon
														className='cursor-pointer w-6 h-6 text-blue-500'
														icon={'HeroEye'}
													/>
												</Link>
											</Tooltip>
											<Tooltip text={file?.add ? "Remove File" : "Add File"} placement='top'>
												<Icon
													className={`cursor-pointer w-6 h-6 ${file?.add ? "text-red-500" : "text-green-500"}`}
													icon={file?.add ? 'CrossIcon' : 'HeroPlus'}
													onClick={() => {
														handleSaveFileAddRemove(index);
													}}
												/>
											</Tooltip>
										</div>
									))}
								</div>
							</div>
						) : null}
						<div className='mt-4 flex gap-2'>
							<Button
								variant='solid'
								color='blue'
								isLoading={isLoading}
								type='button'
								isDisable={isLoading}
								onClick={formik.handleSubmit}>
								Update Customer
							</Button>
						</div>
					</CardBody>
				</Card>
			</Container>
		</PageWrapper>
	);
};

export default EditCustomerPage;
