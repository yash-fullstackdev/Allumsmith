import { useNavigate } from 'react-router-dom';
import { post } from '../../../../utils/api-helper.util';
import { PathRoutes } from '../../../../utils/routes/enum';
import { toast } from 'react-toastify';
import CustomerForm from '../../../../components/PageComponets/CustomerForm/CustomerPage';
import { useFormik } from 'formik';
import { CustomerSchema } from '../../../../utils/formValidations';
import { Container, PageWrapper, Subheader, SubheaderLeft, SubheaderSeparator } from '../../../../components/layouts';
import { Button, Card, CardBody } from '../../../../components/ui';

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
};
const CustomerPage = () => {
	const navigate = useNavigate();
	const formik: any = useFormik({
		initialValues: initialValues,
		validationSchema: CustomerSchema,
		onSubmit: async (values) => {
			const formDataValue: any = new FormData();
			console.log('value :>> ', values);
			Object.entries(values).forEach(([key, value]: any) => {
				if (key !== 'file') {
					formDataValue.append(key, value);
				}
				if (key === 'file') {
					values?.file?.forEach((item: any) => {
						formDataValue.append('file', item);
					});
				}
			});

			try {
				await post('/customers', formDataValue, {
					headers: {
						'Content-Type': 'multipart/form-data',
					},
				});

				toast.success('customer added Successfully!');
				navigate(PathRoutes.customer);
			} catch (error: any) {
				console.error('Error Saving customer', error);
				toast.error(error.response.data.message, error);
			}
		},
	});

	return (
		<PageWrapper name='ADD Customer' isProtectedRoute={true}>
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
			<Container className='flex shrink-0 grow basis-auto flex-col pb-0'>
				<Card>
					<CardBody>
						<div className='flex w-full items-center justify-between rounded-none border-b px-[2px] py-[0px] text-start text-lg font-bold'>
							Add Customer
						</div>

						<CustomerForm formik={formik} />

						<div className='mt-2 flex gap-2'>
							<Button
								variant='solid'
								color='blue'
								isLoading={formik?.isSubmitting}
								isDisable={formik?.isSubmitting}
								type='button'
								onClick={formik.handleSubmit}>
								Save Customer
							</Button>
						</div>
					</CardBody>
				</Card>
			</Container>
		</PageWrapper>
	);
};

export default CustomerPage;
