import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { get, post, put } from '../../../../utils/api-helper.util';
import Card, { CardBody } from '../../../../components/ui/Card';
import Button from '../../../../components/ui/Button';
import Label from '../../../../components/form/Label';
import Input from '../../../../components/form/Input';
import PageWrapper from '../../../../components/layouts/PageWrapper/PageWrapper';
import Container from '../../../../components/layouts/Container/Container';
import Checkbox from '../../../../components/form/Checkbox';
import { toast } from 'react-toastify';
import { PathRoutes } from '../../../../utils/routes/enum';
import Subheader, {
	SubheaderLeft,
	SubheaderSeparator,
} from '../../../../components/layouts/Subheader/Subheader';
import { wrokersSchema } from '../../../../utils/formValidations';
import { useFormik } from 'formik';

const EditWorkerPage = () => {
	const formik = useFormik({
		initialValues: {
			name: '',
			email: '',
			phone: '',
			company: '',
			address_line1: '',
			address_line2: '',
			city: '',
			state: '',
			zipcode: '',
			pancard: '',
		},
		validationSchema: wrokersSchema,
		onSubmit: async (values) => {
			console.log('🚀 ~ onSubmit: ~ values:', values);
			try {
				await post('/workers', values);
				toast.success('Worker added successfully!');
				navigate(PathRoutes.worker);
			} catch (error) {
				console.error('Error saving worker', error);
			}
		},
	});

	const [formData, setFormData] = useState<any>({
		name: '',
		email: '',
		phone: '',
		company: '',
		address_line1: '',
		address_line2: '',
		city: '',
		state: '',
		zipcode: '',
		pancard: '',
	});
	const navigate = useNavigate();

	const handleChange = (e: any) => {
		const { name, value, type, checked } = e.target;
		setFormData((prevState: any) => ({
			...prevState,
			[name]: type === 'checkbox' ? checked : value,
		}));
	};
	const { id } = useParams();
	const fetchWorkerById = async () => {
		try {
			const worker = await get(`/workers/${id}`);
			const {
				name,
				email,
				phone,
				company,
				address_line1,
				address_line2,
				city,
				state,
				zipcode,
				pancard,
			} = worker.data;
			formik.setValues({
				name,
				email,
				phone,
				company,
				address_line1,
				address_line2,
				city,
				state,
				zipcode,
				pancard,
			});
		} catch (error) {
			console.error('Error fetching Worker data:', error);
		}
	};

	useEffect(() => {
		fetchWorkerById();
	}, []);

	const editWorker = async () => {
		const formData = {
			name: formik.values.name,
			email: formik.values.email,
			phone: formik.values.phone,
			address_line1: formik.values.address_line1,
			address_line2: formik.values.address_line2,
			city: formik.values.city,
			state: formik.values.state,
			zipcode: formik.values.zipcode,
			pancard: formik.values.pancard,
		};
		console.log('🚀 ~ editWorker ~ formData:', formData);
		try {
			const editedWorker = await put(`/workers/${id}`, formData);
			console.log('edited worker', editedWorker);
			toast.success('Worker edited Successfully!');
			navigate(PathRoutes.worker);
		} catch (error: any) {
			console.error('Error Updating Worker', error);
			toast.error(error.response.data.message, error);
		}
	};

	return (
		<PageWrapper name='Edit Worker' isProtectedRoute={true}>
			<Subheader>
				<SubheaderLeft>
					<Button
						icon='HeroArrowLeft'
						className='!px-0'
						onClick={() => navigate(`${PathRoutes.worker}`)}>
						{`${window.innerWidth > 425 ? 'Back to List' : ''}`}
					</Button>
					<SubheaderSeparator />
				</SubheaderLeft>
			</Subheader>
			<Container className='flex shrink-0 grow basis-auto flex-col '>
				<Card>
					<CardBody>
						<div className='mt-1 grid grid-cols-12 gap-2'>
							<div className='col-span-12 lg:col-span-4'>
								<Label htmlFor='name' require={true}>Name</Label>
								<Input
									id='name'
									name='name'
									value={formik.values.name}
									onChange={formik.handleChange}
								/>
							</div>
							<div className='col-span-12 lg:col-span-4'>
								<Label htmlFor='email'>Email</Label>
								<Input
									id='email'
									name='email'
									value={formik.values.email}
									onChange={formik.handleChange}
								/>
							</div>
							<div className='col-span-12 lg:col-span-4'>
								<Label htmlFor='phone' require={true}>Phone</Label>
								<Input
									id='phone'
									name='phone'
									value={formik.values.phone}
									onChange={formik.handleChange}
								/>
							</div>
							<div className='col-span-12 lg:col-span-4'>
								<Label htmlFor='company'>Company</Label>
								<Input
									id='company'
									name='company'
									value={formik.values.company}
									onChange={formik.handleChange}
								/>
							</div>
							<div className='col-span-12 lg:col-span-4'>
								<Label htmlFor='address_line1' require={true}>Address Line 1</Label>
								<Input
									id='address_line1'
									name='address_line1'
									value={formik.values.address_line1}
									onChange={formik.handleChange}
								/>
							</div>
							<div className='col-span-12 lg:col-span-4'>
								<Label htmlFor='address_line2'>Address Line 2</Label>
								<Input
									id='address_line2'
									name='address_line2'
									value={formik.values.address_line2}
									onChange={formik.handleChange}
								/>
							</div>
							<div className='col-span-12 lg:col-span-4'>
								<Label htmlFor='city'>City</Label>
								<Input
									id='city'
									name='city'
									value={formik.values.city}
									onChange={formik.handleChange}
								/>
							</div>
							<div className='col-span-12 lg:col-span-4'>
								<Label htmlFor='state'>State</Label>
								<Input
									id='state'
									name='state'
									value={formik.values.state}
									onChange={formik.handleChange}
								/>
							</div>
							<div className='col-span-12 lg:col-span-4'>
								<Label htmlFor='zipcode'>Zipcode</Label>
								<Input
									id='zipcode'
									name='zipcode'
									value={formik.values.zipcode}
									onChange={formik.handleChange}
								/>
							</div>
							<div className='col-span-12 lg:col-span-4'>
								<Label htmlFor='pancard'>Pan Card</Label>
								<Input
									id='pancard'
									name='pancard'
									value={formik.values.pancard}
									onChange={formik.handleChange}
								/>
							</div>
						</div>

						<div className='mt-4 flex gap-2'>
							<Button
								variant='solid'
								isLoading={formik?.isSubmitting}
								isDisable={formik?.isSubmitting}
								color='blue'
								type='button'
								onClick={editWorker}>
								Update Worker
							</Button>
						</div>
					</CardBody>
				</Card>
			</Container>
		</PageWrapper>
	);
};

export default EditWorkerPage;
