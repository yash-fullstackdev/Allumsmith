import React, { useEffect, useState } from 'react';
import Container from '../../../../components/layouts/Container/Container';
import PageWrapper from '../../../../components/layouts/PageWrapper/PageWrapper';
import Subheader, {
	SubheaderLeft,
	SubheaderRight,
	SubheaderSeparator,
} from '../../../../components/layouts/Subheader/Subheader';
import Card, { CardBody } from '../../../../components/ui/Card';
import Button from '../../../../components/ui/Button';
import { useNavigate, useParams } from 'react-router-dom';
import { PathRoutes } from '../../../../utils/routes/enum';
import Label from '../../../../components/form/Label';
import Input from '../../../../components/form/Input';
import { get, post } from '../../../../utils/api-helper.util';
import SelectReact from '../../../../components/form/SelectReact';
import { number } from 'yup';
import AllInvoice from './AllInvoice';
import { useFormik } from 'formik';
import AllLedger from './AllLedger';
import Collapse from '../../../../components/utils/Collapse';
import { toast } from 'react-toastify';
import LoaderDotsCommon from '../../../../components/LoaderDots.common';

const optionSelect = [
	{ value: 'credit', label: 'Credit' },
	{ value: 'debit', label: 'Dedit' },
];

const OptionPaymentMode = [
	{ value: 'Cheque', label: 'Cheque' },
	{ value: 'Cash', label: 'Cash' },
	{ value: 'RTGS', label: 'RTGS' },
	{ value: 'UPI', label: 'UPI' },
];

const LedgerPage = () => {
	const navigate = useNavigate();
	const [customer, setCustomer] = useState<any>([]);
	const [formData, setFormData] = useState<any>({
		customer_id: '',
		customer_name: '',
		payment_mode: '',
		remarks: '',
		grandTotal: 0,
		paidAmount: 0,
		pendingAmount: 0,
		creditedAmount: 0,
		amountPayable: 0,
		chequeNumber: '',
		upi: '',
	});
	const [specificCustomerData, setSpecificCustomerData] = useState<any>([]);
	const [associatedInvoices, setAssociatedInvoices] = useState<any>([]);
	const [associatedLedger, setAssociatedLedger] = useState<any>([]);
	const [collapseAll, setCollapseAll] = useState<boolean>(false);
	const [accordionStates, setAccordionStates] = useState({
		customerInfo: false,
		invoiceDetails: false,
		ledgerDetails: false,
	});
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const { id } = useParams();
	const getCustomerDetails = async () => {
		try {
			const { data } = await get(`/customers/${id}`);
			setCustomer(data);
			formik.setFieldValue('customerName', data?.name);
			formik.setFieldValue('address_line1', data?.address_line1);
			formik.setFieldValue('address_line2', data?.address_line2);
			formik.setFieldValue('phone', data?.phone);
			formik.setFieldValue('email', data?.email);
		} catch (error) {
			console.error('Error Fetching Customer Order');
		}
	};

	console.log('customer', customer);
	const formik: any = useFormik({
		initialValues: {
			startDate: '',
			endDate: '',
			type: '',
		},
		enableReinitialize: true,

		onSubmit: () => {},
	});

	function formatDate(dateString: any) {
		const [year, month, day] = dateString.split('-');
		return `${day}-${month}-${year}`;
	}

	// Example usage:
	const formattedDate = formatDate(formik.values.startDate);
	console.log(formattedDate); // Outputs: 24-05-2024

	const fetchLedgerDetails = async (customerId: any) => {
		try {
			const startDate = formik.values.startDate ? formatDate(formik.values.startDate) : '';
			const endDate = formik.values.endDate ? formatDate(formik.values.endDate) : '';
			const type = formik.values.type || '';
			console.log('Type', type);

			const queryParams = new URLSearchParams();
			if (startDate) queryParams.append('startDate', startDate);
			if (endDate) queryParams.append('endDate', endDate);
			if (type) queryParams.append('type', type);

			const { data } = await get(
				`/ledger/findledger/${customerId}?${queryParams.toString()}`,
			);
			setAssociatedLedger(data);
		} catch (error) {
			console.error('Error Fetching Invoices for Customer:', error);
		}
	};
	const resetFilters = () => {
		formik.values.startDate = '';
		formik.values.endDate = '';
		formik.values.type = '';
		fetchLedgerDetails(id);
	};

	const handleLedgerData = async () => {
		try {
			const { data } = await get(`/ledger/customer/${id}`);
			setAssociatedLedger(data);
		} catch (error) {}
	};

	const handleGeneratePdf = async () => {
		try {
			setIsLoading(true);
			const payload = {
				ledgerData: associatedLedger,
				from: formik.values.startDate,
				to: formik.values.endDate,
			};
			console.log('payload', payload);
			toast.success('Please Wait Pdf is being generated...');
			const response = await post(`/ledger/pdf`, payload);

			console.log(response.data.data);
			if (response && response.status === 201 && response.data && response.data.data) {
				const pdfData = response.data.data;
				console.log('PDF DATA', pdfData);

				const url = window.URL.createObjectURL(
					new Blob([new Uint8Array(pdfData).buffer], { type: 'application/pdf' }),
				);

				window.open(url, '_blank');
			} else {
				console.error('Error: PDF data not found in response');
			}
			setIsLoading(false);
		} catch (error) {
			toast.error('Error Generating PDF');
		}
	};

	useEffect(() => {
		handleLedgerData();
	}, []);
	console.log('data', associatedLedger);

	const collapseAllAccordians = () => {
		setAccordionStates({
			customerInfo: !collapseAll,
			invoiceDetails: !collapseAll,
			ledgerDetails: !collapseAll,
		});
		setCollapseAll(!collapseAll);
	};

	useEffect(() => {
		getCustomerDetails();
	}, []);

	return (
		<PageWrapper name='LEDGER' isProtectedRoute={true}>
			{isLoading ? (
				<div className='flex h-[80vh] items-center justify-center'>
					<LoaderDotsCommon />
				</div>
			) : (
				<>
					<Subheader>
						<SubheaderLeft>
							<Button
								icon='HeroArrowLeft'
								className='!px-0'
								onClick={() => navigate(`${PathRoutes.ledger_list}`)}>
								{`${window.innerWidth > 425 ? 'Back to List' : ''}`}
							</Button>
							<SubheaderSeparator />
						</SubheaderLeft>
						<SubheaderRight>
							<div className='col-span-1'>
								<Button
									variant='solid'
									color='emerald'
									className='mr-5'
									onClick={() => collapseAllAccordians()}>
									{!collapseAll
										? 'Collapse All Information'
										: 'Expand All Information'}
								</Button>
							</div>
						</SubheaderRight>
					</Subheader>

					<Container>
						<div className='flex h-full flex-wrap content-start'>
							<div className='m-5 mb-4 grid w-full grid-cols-6 gap-1'>
								<div className='col-span-12 flex flex-col gap-1 xl:col-span-6'>
									<div className='col-span-12 flex flex-col gap-1 xl:col-span-6'>
										<Card>
											<CardBody>
												<div className='flex'>
													<div className='bold w-full'>
														<Button
															variant='outlined'
															className='flex w-full items-center justify-between rounded-none border-b px-[2px] py-[0px] text-start text-lg font-bold'
															onClick={() =>
																setAccordionStates({
																	...accordionStates,
																	customerInfo:
																		!accordionStates.customerInfo,
																})
															}
															rightIcon={
																!accordionStates.customerInfo
																	? 'HeroChevronUp'
																	: 'HeroChevronDown'
															}>
															Customer Details
														</Button>
													</div>
												</div>
												<Collapse isOpen={!accordionStates.customerInfo}>
													<div className='mt-2 grid grid-cols-12 gap-[10px] '>
														<div className='col-span-12 lg:col-span-4'>
															<Label
																htmlFor='name'
																className='flex gap-1 whitespace-nowrap text-sm font-medium '>
																Customer Name
																<span>
																	<h5>
																		:
																		<span className='mx-[2px]   font-normal'>
																			{
																				formik.values
																					.customerName
																			}
																		</span>
																	</h5>
																</span>
															</Label>
														</div>

														<div className='col-span-12 lg:col-span-4'>
															<Label
																htmlFor='name'
																className='flex gap-1 text-sm font-medium'>
																Phone :
																<span>
																	<h5 className='font-normal'>
																		{formik.values.phone}
																	</h5>
																</span>
															</Label>
														</div>
														<div className='col-span-12 lg:col-span-4'>
															<Label
																htmlFor='email'
																className='flex gap-1 text-sm font-medium '>
																Email
																<span>
																	<h5>
																		:
																		<span className='mx-[2px]  font-normal'>
																			{formik.values.email}
																		</span>
																	</h5>
																</span>
															</Label>
														</div>

														<div className='col-span-12'>
															<Label
																htmlFor='name'
																className='flex gap-1 text-sm font-medium '>
																Address
																<span>
																	<h5>
																		:
																		<span className='mx-[2px]  font-normal'>
																			{formik.values.address_line1?.toUpperCase()}
																		</span>
																	</h5>
																</span>
															</Label>
														</div>

														<div className='col-span-12 '>
															<Label
																htmlFor='name'
																className='flex gap-1 text-sm font-medium'>
																Address Line 2
																<span>
																	<h5>
																		:
																		<span className='mx-[2px] font-normal'>
																			{formik?.values.address_line2?.toUpperCase() ||
																				'NA'}
																		</span>
																	</h5>
																</span>
															</Label>
														</div>
													</div>
												</Collapse>
											</CardBody>
										</Card>
									</div>
								</div>
							</div>
						</div>
					</Container>

					<AllLedger
						associatedLedger={associatedLedger}
						formik={formik}
						fetchLedgerDetails={fetchLedgerDetails}
						id={id}
						setAssociatedLedger={setAssociatedLedger}
						accordionStates={accordionStates}
						setAccordionStates={setAccordionStates}
						handleLedgerData={handleLedgerData}
						handleGeneratePdf={handleGeneratePdf}
						resetFilters={resetFilters}
					/>
				</>
			)}
		</PageWrapper>
	);
};

export default LedgerPage;
