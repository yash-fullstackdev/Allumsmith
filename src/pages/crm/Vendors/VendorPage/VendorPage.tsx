import { useFormik } from 'formik';
import { post } from '../../../../utils/api-helper.util';
import { PathRoutes } from '../../../../utils/routes/enum';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { vendorSchema } from '../../../../utils/formValidations';
import DynamicForm from '../../../../components/form/DynamicForm';
import { VendorsCreateForm } from '../../../../utils/formCreation';
import {
	Container,
	PageWrapper,
	Subheader,
	SubheaderLeft,
	SubheaderSeparator,
} from '../../../../components/layouts';
import { Button, Card, CardBody } from '../../../../components/ui';
import VendorForm from '../../../../components/PageComponets/VendorForm/VendorForm';
import DynamicMultiEntryForm from '../../../../components/form/DynamicMultiForm';
import * as Yup from 'yup';

const VendorPage = () => {
	const formik: any = useFormik({
		initialValues: {
			name: '',
			email: '',
			phone: '',
			gstNumber: '',
			company: '',
			addressLine1: '',
			addressLine2: '',
			city: '',
			state: '',
			zipcode: '',
		},
		validationSchema: vendorSchema,
		onSubmit: async (values) => {
			console.log('Values', values);
			try {
				await post('/vendors', values);
				toast.success('Vendor added Successfully!');
			} catch (error: any) {
				toast.error('Error Saving Vendor', error);
			} finally {
				navigate(PathRoutes.vendor);
			}
		},
	});

	const handleSubmit = (values: any) => {
		console.log('Form Values:', values);
	};

	// const fields = [
	// 	{
	// 		name: 'firstName',
	// 		label: 'First Name',
	// 		type: 'text',
	// 		validation: Yup.string().required('First Name is required'),
	// 	},
	// 	{
	// 		name: 'lastName',
	// 		label: 'Last Name',
	// 		type: 'text',
	// 		validation: Yup.string().required('Last Name is required'),
	// 	},
	// 	{
	// 		name: 'email',
	// 		label: 'Email',
	// 		type: 'email',
	// 		validation: Yup.string().email('Invalid email format').required('Email is required'),
	// 	},
	// 	{
	// 		name: 'password',
	// 		label: 'Password',
	// 		type: 'password',
	// 		validation: Yup.string()
	// 			.min(6, 'Password must be at least 6 characters')
	// 			.required('Password is required'),
	// 	},
	// 	{
	// 		name: 'gender',
	// 		label: 'Gender',
	// 		type: 'radio',
	// 		options: [
	// 			{ value: 'male', label: 'Male' },
	// 			{ value: 'female', label: 'Female' },
	// 		],
	// 		validation: Yup.string().required('Gender is required'),
	// 	},
	// 	{
	// 		name: 'hobbies',
	// 		label: 'Hobbies',
	// 		type: 'checkbox',
	// 		options: [
	// 			{ value: 'reading', label: 'Reading' },
	// 			{ value: 'travelling', label: 'Travelling' },
	// 			{ value: 'swimming', label: 'Swimming' },
	// 		],
	// 	},
	// 	{
	// 		name: 'profilePicture',
	// 		label: 'Profile Picture',
	// 		type: 'file',
	// 	},
	// 	{
	// 		name: 'bio',
	// 		label: 'Bio',
	// 		type: 'textarea',
	// 	},
	// ];

	const handelSubmit = async (values: any) => {
		console.log('Values', values);
		try {
			await post('/vendors', values);
			toast.success('Vendor added Successfully!');
		} catch (error: any) {
			toast.error('Error Saving Vendor', error);
		} finally {
			navigate(PathRoutes.vendor);
		}
	};

	const navigate = useNavigate();
	return (
		<PageWrapper name='ADD Vendor' isProtectedRoute={true}>
			<Subheader>
				<SubheaderLeft>
					<Button
						icon='HeroArrowLeft'
						className='!px-0'
						onClick={() => navigate(`${PathRoutes.vendor}`)}>
						{`${window.innerWidth > 425 ? 'Back to List' : ''}`}
					</Button>
					<SubheaderSeparator />
				</SubheaderLeft>
			</Subheader>
			<Container className='flex shrink-0 grow basis-auto flex-col pb-0'>
				<Card>
					<CardBody>
						<div className='flex w-full items-center justify-between rounded-none border-b px-[2px] py-[0px] text-start text-lg font-bold'>
							Add Vendor
						</div>
						{/* <VendorForm formik={formik} /> */}
						<DynamicForm
							fields={VendorsCreateForm}
							onSubmit={handelSubmit}
							parentClassName='mt-2 grid grid-cols-12 gap-3'
							btnLabel='Save Vendor'
						/>

						{/* <div className='app-container'>
							<DynamicMultiEntryForm
								fields={VendorsCreateForm}
								parentClassName='mt-2 grid grid-cols-12 gap-3'
								btnLabel='Submit Entry'
								onSubmit={handleSubmit}
							/>
						</div> */}

						{/* <div className='flex mt-2 gap-2'>
                            <Button variant='solid' color='blue'  isLoading={formik?.isSubmitting} isDisable={formik?.isSubmitting} type='button' onClick={formik.handleSubmit}>
                                Save Vendor
                            </Button>
                        </div> */}
					</CardBody>
				</Card>
			</Container>
		</PageWrapper>
	);
};

export default VendorPage;
