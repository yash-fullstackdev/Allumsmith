import React, { useEffect, useState } from 'react';
import { get, post } from '../../../../utils/api-helper.util';
import PageWrapper from '../../../../components/layouts/PageWrapper/PageWrapper';
import Container from '../../../../components/layouts/Container/Container';
import Card, {
	CardBody,
	CardHeader,
	CardHeaderChild,
	CardTitle,
} from '../../../../components/ui/Card';
import Button from '../../../../components/ui/Button';
import {
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Typography,
} from '@mui/material';

import _ from 'lodash';
import { useNavigate } from 'react-router';
import { Link } from 'react-router-dom';
import { PathRoutes } from '../../../../utils/routes/enum';
import TableTemplate, {
	TableCardFooterTemplate,
} from '../../../../templates/common/TableParts.template';
import {
	createColumnHelper,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	SortingState,
	useReactTable,
} from '@tanstack/react-table';
import { deleted } from '../../../../utils/api-helper.util';
const columnHelper = createColumnHelper<any>();
import { toast } from 'react-toastify';
import Modal, { ModalBody, ModalHeader } from '../../../../components/ui/Modal';
import Label from '../../../../components/form/Label';
import Input from '../../../../components/form/Input';
import Select from '../../../../components/form/Select';
import Collapse from '../../../../components/utils/Collapse';
// import InvoiceCustomerDetail from './InvoiceCustomerDetail';

const AllLedger = ({
	associatedLedger,
	formik,
	fetchLedgerDetails,
	id,
	accordionStates,
	setAccordionStates,
	resetFilters,
}: any) => {
	const [jobsList, setJobsList] = useState<any>([]);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [isEditModal, setIsEditModal] = useState(false);
	const [productInfo, setProductInfo] = useState<any>();
	const [customerId, setCustomerId] = useState();

	const getInvoiceList = async () => {
		try {
			const { data } = await get('/invoice');
			setJobsList(data);
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
		} catch (error) {
			toast.error('Error Generating PDF');
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		getInvoiceList();
	}, []);

	const columns: any = [
		columnHelper.accessor('createdAt', {
			cell: (info) => {
				const dateString = info?.row?.original?.createdAt.split('T')[0];

				const [year, month, day] = dateString.split('-');
				const formattedDate = `${day.padStart(2, '0')}/${month.padStart(2, '0')}/${year}`;

				return <div className=''>{formattedDate || '-'}</div>;
			},
			header: 'Created Date',
		}),

		columnHelper.accessor('type', {
			cell: (info) => <div className=''>{`${info.getValue() || '-'} `}</div>,
			header: 'Type',
		}),

		columnHelper.accessor('invoice_amount', {
			cell: (info) => <div className=''>{info.getValue() || '-'}</div>,
			header: 'Invoice Amount',
		}),
		columnHelper.accessor('amount_payable', {
			cell: (info) => (
				// <div className=''>
				//     {/* {`${info.getValue() || 'NA'} `} */}
				//     {info.row.original.type === 'credit' ? `${info.getValue()} - (Paid Amount)` : `${info.getValue()} - (Invoice Amount)`}
				// </div>
				<div>{info.getValue() || '-'}</div>
			),
			header: 'Amount Paid',
		}),

		columnHelper.accessor('payment_mode', {
			cell: (info) => <div className=''>{`${info.getValue() || '-'} `}</div>,
			header: 'Payment Mode',
		}),
	];
	console.log('Associated Invoices', associatedLedger);
	const table = useReactTable({
		data: associatedLedger || [],
		columns,
		// state: {
		//     sorting,
		//     globalFilter,
		// },
		// onSortingChange: setSorting,
		enableGlobalFilter: true,
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
	});

	return (
		<Container>
			<div className='flex h-full flex-wrap content-start'>
				<div className='m-5 mb-1 mt-0 grid w-full grid-cols-6 gap-1'>
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
													ledgerDetails: !accordionStates.ledgerDetails,
												})
											}
											rightIcon={
												!accordionStates.ledgerDetails
													? 'HeroChevronUp'
													: 'HeroChevronDown'
											}>
											Ledger List
										</Button>
									</div>
								</div>

								<Collapse isOpen={!accordionStates.ledgerDetails}>
									<div className='mb-2 mt-4 grid grid-cols-12 gap-1'>
										<div className='col-span-12 lg:col-span-2 '>
											<Label htmlFor='startDate'>Start Date</Label>
											<Input
												type='date'
												id={`startDate`}
												name={`startDate`}
												value={formik.values.startDate}
												onChange={formik.handleChange}
											/>
										</div>
										<div className='col-span-12 lg:col-span-2'>
											<Label htmlFor='endDate'>End Date</Label>
											<Input
												type='date'
												id={`endDate`}
												name={`endDate`}
												value={formik.values.endDate}
												onChange={formik.handleChange}
											/>
										</div>
										<div className='col-span-12 lg:col-span-2'>
											<Label htmlFor='typr'>Type</Label>
											<Select
												id='type'
												name='type'
												placeholder='Select Type'
												value={formik.values.type}
												onChange={formik.handleChange}
												onBlur={formik.handleBlur}>
												<option value='credit'>Credit</option>
												<option value='debit'>Debit</option>
											</Select>
										</div>
										<div className='col-span-12 ml-2 mt-4 sm:col-span-1 lg:col-span-1'>
											<Button
												className='mt-2'
												variant='solid'
												color='blue'
												type='submit'
												onClick={() => fetchLedgerDetails(id)}
												icon='HeroFunnel'></Button>
										</div>
										<div className='col-span-12 mt-4 w-[200px] sm:col-span-7 lg:col-span-2 '>
											<Button
												className='mt-2'
												variant='solid'
												color='blue'
												type='submit'
												onClick={resetFilters}>
												Reset Filter
											</Button>
										</div>
										<div className='col-span-12 mt-4 w-[200px] justify-items-end sm:col-span-4 lg:col-span-3 lg:ml-5'>
											<Button
												className='mt-2'
												variant='solid'
												color='blue'
												type='submit'
												isLoading={isLoading}
												isDisable={isLoading}
												onClick={handleGeneratePdf}>
												Generate PDF
											</Button>
										</div>
									</div>
									{!isLoading && table.getFilteredRowModel().rows.length > 0 ? (
										<div>
											<TableTemplate
												className='table-fixed max-md:min-w-[70rem]'
												table={table}
											/>
										</div>
									) : (
										!isLoading && (
											<p className='text-center text-gray-500'>
												No records found
											</p>
										)
									)}

									{table.getFilteredRowModel().rows.length > 0 && (
										<TableCardFooterTemplate table={table} />
									)}
								</Collapse>
							</CardBody>
						</Card>
					</div>
				</div>
			</div>
		</Container>
	);
};

export default AllLedger;
