import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import { get, post } from '../../../utils/api-helper.util';
import { toast } from 'react-toastify';
import Card, { CardBody } from '../../../components/ui/Card';
import Label from '../../../components/form/Label';
import SelectReact from '../../../components/form/SelectReact';
import Input from '../../../components/form/Input';
import Textarea from '../../../components/form/Textarea';
import Button from '../../../components/ui/Button';
import PageWrapper from '../../../components/layouts/PageWrapper/PageWrapper';
import Container from '../../../components/layouts/Container/Container';
import { PaymentSchema } from '../../../utils/formValidations';
import { useNavigate } from 'react-router-dom';
import { PathRoutes } from '../../../utils/routes/enum';
import renderAmount from '../../../utils/renderAmount';
import PermissionGuard from '../../../components/buttons/CheckPermission';
import ErrorMessage from '../../../components/layouts/common/ErrorMessage';

const initialValues = {
	customer_id: '',
	todayDate: new Date().toISOString().split('T')[0],
	amount_payable: 0,
}

const PaymentPage = () => {
	const [customer, setCustomer] = useState<any>([]);
	const [isSubmitting,setIsSubmitting] = useState<any>(false)
	const navigate = useNavigate();
	const OptionPaymentMode = [
		{ value: 'Cheque', label: 'Cheque' },
		{ value: 'Cash', label: 'Cash' },
		{ value: 'RTGS', label: 'RTGS' },
		{ value: 'UPI', label: 'UPI' },
	];
	const formik: any = useFormik({
		initialValues,
		enableReinitialize: true,
		validationSchema: PaymentSchema,
		onSubmit: () => { },
	});
	const getCustomerDetails = async () => {
		try {
			const { data } = await get('/customers');
			const filteredData = data.filter(
				(customer: any) => customer.associatedInvoices.length > 0,
			);
			setCustomer(filteredData);
		} catch (error) {
			console.error('Error Fetching Customer Order');
		}
	};

	console.log(customer);
	const fetchAmount = async () => {
		try {
			const creditedAmount =
				customer.find((value: any) => value._id === formik.values.customer_id)
					?.credit_amount || 0;
			const pendingAmount = customer.find(
				(value: any) => value._id === formik.values.customer_id,
			)?.pending_amount;
			console.log('Credited Amount', creditedAmount);
			console.log('Pending Amount', pendingAmount);
			formik.setFieldValue('creditedAmount', parseFloat(creditedAmount.toFixed(2)) || 0);
			formik.setFieldValue('pendingAmount', parseFloat(pendingAmount.toFixed(2)) || 0);
		} catch (error) { }
	};
	useEffect(() => {
		fetchAmount();
	}, [formik.values.customer_id]);

	useEffect(() => {
		getCustomerDetails();
	}, []);
	const savePaymentDetail = async () => {
		try {
			setIsSubmitting(true)
			const check = await formik.validateForm();

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

			if (Object.keys(check).length > 0) {
				handleNestedErrors(check);

				toast.error(`Please fill all the mandatory fields and check all formats`);
				return;
			}
			const payload = {
				...formik.values,
				type: 'credit',
			};
			if (formik.values.payment_mode === 'Cheque') {
				payload.payment_id = formik.values.chequeNumber;
			} else if (formik.values.payment_mode === 'UPI') {
				payload.payment_id = formik.values.upi;
			} else {
				payload;
			}
			console.log(payload);
			const { data } = await post('/ledger', payload);
			toast.success('ledger created');
			navigate(PathRoutes.ledger_list);
		} catch (error: any) {
			toast.error(error.response.data.message);
		} finally {
			setIsSubmitting(false)
		}
	};
	const today = new Date().toISOString().split('T')[0];

	return (
		<PageWrapper>
			<Container>
				<Card>
					<CardBody>
						<div
							className='flex w-full items-center justify-between rounded-none border-b px-[2px] py-[0px] text-start text-lg font-bold'
						>
							Payment
						</div>
						<div>
							<div className='mt-2 grid grid-cols-12 gap-1'>
								<div className='col-span-12 lg:col-span-4'>
									<Label htmlFor='name'>
										Customer Name
										<span className='ml-1 text-red-500'>*</span>
									</Label>
									<SelectReact
										id={`name`}
										name={`name`}
										options={customer.map((customer: any) => ({
											value: customer._id,
											label: customer.name,
										}))}
										onChange={(value: any) => {
											formik.setFieldValue(
												'customer_id',
												value.value,
											);
											getCustomerDetails();
										}}
									/>

									{formik.touched.customer_id &&
										formik.errors.customer_id ? (
										<div className='text-red-500'>
											{formik.errors.customer_id}
										</div>
									) : null}
								</div>
								<div className='col-span-12 lg:col-span-4'>
									<Label htmlFor='todayDate'>Date</Label>
									<Input
										id='todayDate'
										type='date'
										name='todayDate'
										value={formik.values.todayDate}
										onChange={formik.handleChange}
										max={today}
									/>
									<ErrorMessage
										touched={formik?.touched}
										errors={formik?.errors}
										fieldName={`todayDate`}
									/>
								</div>
								<div className='col-span-12 lg:col-span-4'>
									<Label htmlFor='Amount'>Amount</Label>
									<Input
										id='Amount'
										type='text'
										disabled={true}
										name='Amount'
										value={
											renderAmount(
												formik.values.pendingAmount,
												formik.values.creditedAmount,
											).text
										}
										style={{
											color: renderAmount(
												formik.values.pendingAmount,
												formik.values.creditedAmount,
											).color,
										}}
									/>
								</div>
								<div className='col-span-12 lg:col-span-6'>
									<Label htmlFor='payment_mode'>
										Payment Mode
										<span className='ml-1 text-red-500'>*</span>
									</Label>
									<SelectReact
										id={`payment_mode`}
										name={`payment_mode`}
										options={OptionPaymentMode.map(
											(payment_mode: any) => ({
												value: payment_mode.value,
												label: `${payment_mode.label} `,
											}),
										)}
										// value={{ value: formData.payment_mode, label: formData.payment_mode }}
										onChange={(value: any) =>
											formik.setFieldValue(
												'payment_mode',
												value.value,
											)
										}
									/>
									<ErrorMessage
										touched={formik?.touched}
										errors={formik?.errors}
										fieldName={`payment_mode`}
									/>
								</div>

								{formik &&
									formik?.values?.payment_mode === 'Cheque' && (
										<div className='col-span-12 lg:col-span-6'>
											<Label htmlFor='chequeNumber'>
												Cheque Number
												<span className='ml-1 text-red-500'>
													*
												</span>
											</Label>
											<Input
												type='text'
												id={`chequeNumber`}
												name={`chequeNumber`}
												value={formik.values.chequeNumber}
												onChange={formik.handleChange}
											/>
										</div>
									)}
								{formik &&
									formik?.values?.payment_mode === 'UPI' && (
										<div className='col-span-12 lg:col-span-6'>
											<Label htmlFor='upi'>
												UPI ID
												<span className='ml-1 text-red-500'>
													*
												</span>
											</Label>
											<Input
												type='text'
												id={`upi`}
												name={`upi`}
												value={formik.values.upi}
												onChange={formik.handleChange}
											/>
										</div>
									)}
								<div className='col-span-12 lg:col-span-6'>
									<Label htmlFor='amount_payable'>
										Amount Payable(rs)
										<span className='ml-1 text-red-500'>*</span>
									</Label>
									<Input
										type='number'
										min={0}
										id={`amount_payable`}
										name={`amount_payable`}
										value={formik.values.amount_payable}
										onChange={formik.handleChange}
									/>
									<ErrorMessage
										touched={formik?.touched}
										errors={formik?.errors}
										fieldName={`amount_payable`}
									/>
								</div>

								<div className='col-span-12 lg:col-span-12'>
									<Label htmlFor='description'>
										Description
									</Label>
									<Textarea
										id='description'
										name='description'
										value={formik.values.description}
										onChange={formik.handleChange}
									/>
								</div>
							</div>
						</div>
						<PermissionGuard permissionType='read'>
							<div className='col-span-1 mt-2 flex items-end justify-end'>
								<Button
									variant='solid'
									color='blue'
									type='button'
									isDisable={isSubmitting}
									isLoading={isSubmitting}
									onClick={savePaymentDetail}>
									Payment
								</Button>
							</div>
						</PermissionGuard>
					</CardBody>
				</Card>
			</Container>
		</PageWrapper>
	);
};
export default PaymentPage;
