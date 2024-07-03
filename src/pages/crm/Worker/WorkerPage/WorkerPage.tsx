// import React from 'react'

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { post } from '../../../../utils/api-helper.util';
import { PathRoutes } from '../../../../utils/routes/enum';
import Card, { CardBody } from '../../../../components/ui/Card';
import Button from '../../../../components/ui/Button';
import Label from '../../../../components/form/Label';
import Input from '../../../../components/form/Input';
import PageWrapper from '../../../../components/layouts/PageWrapper/PageWrapper';
import Subheader, {
	SubheaderLeft,
	SubheaderRight,
	SubheaderSeparator,
} from '../../../../components/layouts/Subheader/Subheader';
import Container from '../../../../components/layouts/Container/Container';
import { toast } from 'react-toastify';
import { useFormik } from 'formik';
import { wrokersSchema } from '../../../../utils/formValidations';
import ErrorMessage from '../../../../components/layouts/common/ErrorMessage';

const WorkerPage = () => {
	interface FormValues {
		name: any;
		email: any;
		phone: any;
		company: string;
		address_line1: string;
		address_line2: string;
		city: string;
		state: string;
		zipcode: any;
		pancard: any;
	}

	const formik:any = useFormik<FormValues>({
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
			try {
				await post('/workers', values);
				toast.success('Worker added successfully!');
				navigate(PathRoutes.worker);
			} catch (error) {
				console.error('Error saving worker', error);
			}
		},
	});

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		formik.handleChange(e);
	};

	// const [formData, setFormData] = useState({
	//     name: '',
	//     email: '',
	//     phone: '',
	//     company: '',
	//     address_line1: '',
	//     address_line2: '',
	//     city: '',
	//     state: '',
	//     zipcode: '',
	//     pancard: ''
	// });

	// const handleChange = (e: any) => {
	//     const { name, value, type, checked } = e.target;
	//     formik.handleChange(e);
	//     // setFormData(prevState => ({
	//     //     ...prevState,
	//     //     [name]: type === 'checkbox' ? checked : value
	//     // }));
	// };
	const navigate = useNavigate();

	// const createWorker = async () => {
	// 	console.log('entries', formik);
	// 	await formik.validateForm();
	// 	console.log(formik.errors);
	// 	const handleNestedErrors = (errors: any, prefix = '') => {
	// 		//  logic to touch the field which are not validated
	// 		Object.keys(errors).forEach((errorField) => {
	// 			const fieldName = prefix ? `${prefix}.${errorField}` : errorField;

	// 			if (typeof errors[errorField] === 'object' && errors[errorField] !== null) {
	// 				// Recursive call for nested errors
	// 				handleNestedErrors(errors[errorField], fieldName);
	// 			} else {
	// 				// Set the field as touched and set the error
	// 				formik.setFieldTouched(fieldName, true, false);
	// 				formik.setFieldError(fieldName, errors[errorField]);
	// 			}
	// 		});
	// 	};
	// 	if (Object.keys(formik.errors).length > 0) {
	// 		handleNestedErrors(formik.errors);

	// 		toast.error(`Please fill all the mandatory fields and check all formats`);
	// 		return;
	// 	}
	// 	// const promises = formik.values;
	// 	try {
	// 		formik.validateForm();
	// 		const worker = await post('/workers', formik.values);
	// 		console.log('worker', worker);
	// 		toast.success('worker added Successfully!');
	// 		navigate(PathRoutes.worker);
	// 	} catch (error: any) {
	// 		console.error('Error Saving worker', error);
	// 	}
	// };

	return (
		<PageWrapper name='ADD Worker' isProtectedRoute={true}>
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
			<Container className='flex shrink-0 grow basis-auto flex-col pb-0'>
				<Card>
					<CardBody>
						<div className='flex w-full items-center justify-between rounded-none border-b px-[2px] py-[0px] text-start text-lg font-bold'>
							Add Worker
						</div>
						{/* <form onSubmit={formik.handleSubmit}> */}
						<div className='mt-2 grid grid-cols-12 gap-2'>
							<div className='col-span-12 lg:col-span-3'>
								<Label htmlFor='name' require={true}>
									Name
								</Label>
								<Input
									id='name'
									name='name'
									value={formik.values.name}
									onChange={handleChange} // Use custom handleChange
									onBlur={formik.handleBlur}
								/>
								<ErrorMessage
									touched={formik.touched}
									errors={formik.errors}
									fieldName={`name`}
								/>
							</div>
							<div className='col-span-12 lg:col-span-3'>
								<Label htmlFor='email'>Email</Label>
								<Input
									id='email'
									name='email'
									value={formik.values.email}
									onChange={handleChange}
									onBlur={formik.handleBlur}
								/>

								<ErrorMessage
									touched={formik.touched}
									errors={formik.errors}
									fieldName={`email`}
								/>
							</div>
							<div className='col-span-12 lg:col-span-3'>
								<Label htmlFor='phone' require={true}>
									Phone
								</Label>
								<Input
									id='phone'
									name='phone'
									value={formik.values.phone}
									onChange={handleChange}
								/>
								<ErrorMessage
									touched={formik.touched}
									errors={formik.errors}
									fieldName={`phone`}
								/>
							</div>
							<div className='col-span-12 lg:col-span-3'>
								<Label htmlFor='company'>Company</Label>
								<Input
									id='company'
									name='company'
									value={formik.values.company}
									onChange={handleChange}
								/>
								<ErrorMessage
									touched={formik.touched}
									errors={formik.errors}
									fieldName={`company`}
								/>
							</div>
							<div className='col-span-12 lg:col-span-3'>
								<Label htmlFor='address_line1' require={true}>
									Address Line 1
								</Label>
								<Input
									id='address_line1'
									name='address_line1'
									value={formik.values.address_line1}
									onChange={handleChange}
								/>
								<ErrorMessage
									touched={formik.touched}
									errors={formik.errors}
									fieldName={`address_line1`}
								/>
							</div>
							<div className='col-span-12 lg:col-span-3'>
								<Label htmlFor='address_line2'>Address Line 2</Label>
								<Input
									id='address_line2'
									name='address_line2'
									value={formik.values.address_line2}
									onChange={handleChange}
								/>
								<ErrorMessage
									touched={formik.touched}
									errors={formik.errors}
									fieldName={`address_line2`}
								/>
							</div>
							<div className='col-span-12 lg:col-span-3'>
								<Label htmlFor='city'>City</Label>
								<Input
									id='city'
									name='city'
									value={formik.values.city}
									onChange={handleChange}
								/>
								<ErrorMessage
									touched={formik.touched}
									errors={formik.errors}
									fieldName={`city`}
								/>
							</div>
							<div className='col-span-12 lg:col-span-3'>
								<Label htmlFor='state'>State</Label>
								<Input
									id='state'
									name='state'
									value={formik.values.state}
									onChange={handleChange}
								/>
								<ErrorMessage
									touched={formik.touched}
									errors={formik.errors}
									fieldName={`state`}
								/>
							</div>
							<div className='col-span-12 lg:col-span-3'>
								<Label htmlFor='zipcode'>Zipcode</Label>
								<Input
									id='zipcode'
									name='zipcode'
									value={formik.values.zipcode}
									onChange={handleChange}
								/>
								<ErrorMessage
									touched={formik.touched}
									errors={formik.errors}
									fieldName={`zipcode`}
								/>
							</div>
							<div className='col-span-12 lg:col-span-3'>
								<Label htmlFor='pancard'>Pan Card</Label>
								<Input
									id='pancard'
									name='pancard'
									value={formik.values.pancard}
									onChange={handleChange}
								/>
								<ErrorMessage
									touched={formik.touched}
									errors={formik.errors}
									fieldName={`pancard`}
								/>
							</div>
						</div>

						<div className='mt-2 flex gap-2'>
							<Button
								variant='solid'
								color='blue'
								isLoading={formik?.isSubmitting}
								isDisable={formik?.isSubmitting}
								onClick={formik.handleSubmit}
                                >
								Save Worker
							</Button>
						</div>
						{/* </form> */}
					</CardBody>
				</Card>
			</Container>
		</PageWrapper>
	);
};

export default WorkerPage;
