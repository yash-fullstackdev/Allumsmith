import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { get, put } from '../../../../utils/api-helper.util';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { PathRoutes } from '../../../../utils/routes/enum';
import { useFormik } from 'formik';
import { vendorSchema } from '../../../../utils/formValidations';
import VendorForm from '../../../../components/PageComponets/VendorForm/VendorForm';
import {
	Container,
	PageWrapper,
	Subheader,
	SubheaderLeft,
	SubheaderSeparator,
} from '../../../../components/layouts';
import { Button, Card, CardBody } from '../../../../components/ui';

const EditVendorPage = () => {
	const navigate = useNavigate();
	const { id } = useParams();

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
		onSubmit: async (value) => {
			try {
				const editedVendor = await put(`/vendors/${id}`, value);
				toast.success('Vendor edited Successfully!');
			} catch (error: any) {
				console.error('Error Updating Vendor', error);
				toast.error('Error Updating Vendor', error);
			} finally {
				navigate(PathRoutes.vendor);
			}
		},
	});

	const fetchVendorById = async () => {
		try {
			const vendorData = await get(`/vendors/${id}`);
			const {
				name,
				email,
				phone,
				gstNumber,
				company,
				addressLine1,
				addressLine2,
				city,
				state,
				zipcode,
			} = vendorData.data;
			formik.setValues({
				name,
				email,
				phone,
				gstNumber,
				company,
				addressLine1,
				addressLine2,
				city,
				state,
				zipcode,
			});
		} catch (error) {
			console.error('Error fetching vendor data:', error);
		}
	};

	const fields = [
		{
			name: 'name',
			label: 'Name',
			type: 'text',
			validation: Yup.string().required('Name is required'),
		},
		{ name: 'email', label: 'Email', type: 'email' },
		{ name: 'password', label: 'Password', type: 'password' },
		{ name: 'phone', label: 'Phone', type: 'text' },
		{ name: 'file', label: 'Upload File', type: 'file' },
		{
			name: 'subscription',
			label: 'Subscription',
			type: 'select',
			options: [
				{ value: 'basic', label: 'Basic' },
				{ value: 'pro', label: 'Pro' },
				{ value: 'premium', label: 'Premium' },
			],
		},
		{
			name: 'gender',
			label: 'Gender',
			type: 'radio',
			options: [
				{ value: 'male', label: 'Male' },
				{ value: 'female', label: 'Female' },
			],
		},
		{
			name: 'terms',
			label: 'Accept Terms',
			type: 'checkbox',
		},
	];

	useEffect(() => {
		fetchVendorById();
	}, []);

	return (
		<PageWrapper name='Edit Vendor' isProtectedRoute={true}>
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
			<Container className='flex shrink-0 grow basis-auto flex-col '>
				<Card>
					<CardBody>
						<VendorForm formik={formik} />
						<div className='mt-4 flex gap-2'>
							<Button
								variant='solid'
								isLoading={formik?.isSubmitting}
								isDisable={formik?.isSubmitting}
								color='blue'
								type='button'
								onClick={formik.handleSubmit}>
								Update Vendor
							</Button>
						</div>
					</CardBody>
				</Card>
			</Container>
		</PageWrapper>
	);
};

export default EditVendorPage;
