import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik'; // Importing useFormik
import { useNavigate } from 'react-router-dom';
import PageWrapper from '../../../../components/layouts/PageWrapper/PageWrapper';
import Subheader, {
	SubheaderLeft,
	SubheaderSeparator,
} from '../../../../components/layouts/Subheader/Subheader';
import Button from '../../../../components/ui/Button';
import Container from '../../../../components/layouts/Container/Container';
import Card, { CardBody } from '../../../../components/ui/Card';
import { get, post } from '../../../../utils/api-helper.util';
import { PathRoutes } from '../../../../utils/routes/enum';
import { toast } from 'react-toastify';
import { CoatingSchema } from '../../../../utils/formValidations';
import CoatingForm from '../../../../components/PageComponets/CoatingForm/CoatingForm';

const CoatingPage = () => {
	const navigate = useNavigate();

	// Formik initialization
	const formik: any = useFormik({
		initialValues: {
			name: '',
			code: '',
			colors: [],
			type: '',
		},
		validationSchema: CoatingSchema,
		onSubmit: async (values, { setSubmitting }) => {
			try {
				setSubmitting(true);
				await addEntryToDatabase(values);
			} catch (error) {
				console.error('Error Saving Data:', error);
				toast.error('Failed to save data. Please try again.');
			} finally {
				setSubmitting(false);
			}
		},
	});

	const addEntryToDatabase = async (values: any) => {
		try {
			await formik.validateForm();

			const handleNestedErrors = (errors: any, prefix = '') => {
				//  logic to touch the field which are not validated
				Object.keys(errors).forEach((errorField) => {
					const fieldName = prefix ? `${prefix}.${errorField}` : errorField;

					if (typeof errors[errorField] === 'object' && errors[errorField] !== null) {
						// Recursive call for nested errors
						handleNestedErrors(errors[errorField], fieldName);
					} else {
						// Set the field as touched and set the error
						formik.setFieldTouched(fieldName, true, false);
						formik.setFieldError(fieldName, errors[errorField]);
					}
				});
			};

			if (Object.keys(formik.errors).length > 0) {
				handleNestedErrors(formik.errors);

				toast.error('Please fill in all required fields.');
				return;
			}
			const finalData = {
				...values,
			};
			console.log('FinalData', finalData);
			const response = await post('/coatings', finalData);
			toast.success('Data saved Successfully!');
			navigate(PathRoutes.coating);
		} catch (error) {
			console.error('Error Saving Data:', error);
			toast.error('Failed to save data. Please try again.');
		}
	};
	console.log(formik.touched.name && formik.errors.name);
	return (
		<PageWrapper name='ADD Colors' isProtectedRoute={true}>
			<Subheader>
				<SubheaderLeft>
					<Button
						icon='HeroArrowLeft'
						className='!px-0'
						onClick={() => navigate(`${PathRoutes.coating}`)}>
						{`${window.innerWidth > 425 ? 'Back to List' : ''}`}
					</Button>
					<SubheaderSeparator />
				</SubheaderLeft>
			</Subheader>
			<Container className='flex shrink-0 grow basis-auto flex-col pb-0'>
				<Card>
					<CardBody>
						<div className='flex w-full items-center justify-between rounded-none border-b px-[2px] py-[0px] text-start text-lg font-bold'>
							Add Coating
						</div>
						<CoatingForm formik={formik} />
						<div className='mt-2 flex gap-2'>
							<Button
								variant='solid'
								color='blue'
								isLoading={formik?.isSubmitting}
								isDisable={formik?.isSubmitting}
								onClick={formik?.handleSubmit}>
								Save Entries
							</Button>
						</div>
					</CardBody>
				</Card>
			</Container>
		</PageWrapper>
	);
};

export default CoatingPage;
