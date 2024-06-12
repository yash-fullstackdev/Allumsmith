import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { get, deleted } from '../../../../utils/api-helper.util';
import PageWrapper from '../../../../components/layouts/PageWrapper/PageWrapper';
import Container from '../../../../components/layouts/Container/Container';
import Card, { CardBody } from '../../../../components/ui/Card';
import Button from '../../../../components/ui/Button';
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
import { toast } from 'react-toastify';
import Subheader, { SubheaderLeft } from '../../../../components/layouts/Subheader/Subheader';
import FieldWrap from '../../../../components/form/FieldWrap';
import Icon from '../../../../components/icon/Icon';
import Input from '../../../../components/form/Input';
import renderAmount from '../../../../utils/renderAmount';
import { useFormik } from 'formik';
import Label from '../../../../components/form/Label';
import Select from '../../../../components/form/Select';
import { formatDate } from '@fullcalendar/core/index.js';
import LoaderDotsCommon from '../../../../components/LoaderDots.common';

const columnHelper = createColumnHelper<any>();

const LedgerListPage = () => {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [data, setData] = useState<any>([]);
	const [sorting, setSorting] = useState<SortingState>([]);
	const [transactionListModal, setTransactionModal] = useState<boolean>(false);
	const [customerId, setCustomerId] = useState<any>('');
	const [deleteModal, setDeleteModal] = useState<boolean>(false);
	const [deleteId, setDeleteId] = useState<string>('');
	const [ledgerModal, setLedgerModal] = useState<boolean>(false);
	const [customerData, setCustomerData] = useState<any>();
	const [globalFilter, setGlobalFilter] = useState<string>('');
	const [isPdfLoading, setIsPdfLoading] = useState(false);

	const formik: any = useFormik({
		initialValues: {
			startDate: '',
			endDate: '',
		},
		enableReinitialize: true,

		onSubmit: () => {},
	});

	const fetchLedgerDetails = async () => {
		try {
			setIsPdfLoading(true);
			const formatDate = (dateString: any) => {
				const date = new Date(dateString);
				const day = date.getDate().toString().padStart(2, '0');
				const month = (date.getMonth() + 1).toString().padStart(2, '0');
				const year = date.getFullYear();
				return `${day}-${month}-${year}`;
			};

			const fromDate = formik.values.startDate ? formatDate(formik.values.startDate) : '';
			const toDate = formik.values.endDate ? formatDate(formik.values.endDate) : '';

			const queryParams = new URLSearchParams();
			if (fromDate) queryParams.append('fromDate', fromDate);
			if (toDate) queryParams.append('toDate', toDate);

			const response = await get(`/ledger/allLedger?${queryParams.toString()}`);
			if (response && response.data && response.data.data) {
				const pdfData = response.data.data;

				const url = window.URL.createObjectURL(
					new Blob([new Uint8Array(pdfData).buffer], { type: 'application/pdf' }),
				);
				window.open(url, '_blank');
			} else {
				console.error('Error: PDF data not found in response');
			}
		} catch (error) {
			console.error('Error Fetching Invoices for Customer:', error);
		} finally {
			setIsPdfLoading(false);
			resetFilters();
		}
	};

	const resetFilters = () => {
		formik.values.startDate = '';
		formik.values.endDate = '';
		formik.resetForm();
	};

	const fetchData = async (search = '') => {
		setIsLoading(true);
		try {
			const { data } = await get(`/customers${search ? `/search?search=${search}` : ''}`);
			const filteredData = data.filter(
				(customer: any) => customer.associatedInvoices.length > 0,
			);
			filteredData.sort(
				(a: any, b: any) =>
					new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
			);
			setData(filteredData);
		} catch (error: any) {
			console.error('Error fetching customer:', error.message);
		} finally {
			setIsLoading(false);
		}
	};

	const handleDeleteLedger = async (id: any) => {
		try {
			await deleted(`/ledger/${id}`);
			toast.success('Product deleted Successfully !');
			fetchData();
		} catch (error: any) {
			console.error('Error deleting product:', error.message);
			toast.error('Error deleting Product');
			setIsLoading(false);
		}
	};

	// Custom debounce function`
	const debounce = (func: Function, delay: number) => {
		let timer: NodeJS.Timeout;
		return (...args: any) => {
			clearTimeout(timer);
			timer = setTimeout(() => func(...args), delay);
		};
	};

	const debouncedFetchData = useCallback(debounce(fetchData, 2500), []);

	useEffect(() => {
		fetchData();
	}, []);

	useEffect(() => {
		if (globalFilter) {
			debouncedFetchData(globalFilter);
		} else {
			fetchData();
		}
	}, [globalFilter]);

	const columns = [
		columnHelper.accessor('name', {
			cell: (info) => <div className=''>{`${info.getValue() || 'NA'} `}</div>,
			header: 'Customer Name',
		}),
		columnHelper.accessor('amount', {
			cell: (info) => (
				<div
					className={
						renderAmount(
							info.row.original.credit_amount || 0,
							info.row.original.pending_amount || 0,
							'text-green-500',
							'text-red-500',
						).color
					}>
					{
						renderAmount(
							(info.row.original.credit_amount || 0).toFixed(2),
							(info.row.original.pending_amount || 0).toFixed(2),
						).text
					}
				</div>
			),
		}),
		columnHelper.display({
			cell: (info: any) => (
				<div className='font-bold'>
					<Link to={`${PathRoutes.add_ledger}/${info.row.original._id}`}>
						<Button onClick={() => setCustomerId(info.row.original)}>
							<svg
								xmlns='http://www.w3.org/2000/svg'
								fill='none'
								viewBox='0 0 24 24'
								strokeWidth='1.5'
								stroke='currentColor'
								className='h-6 w-6'>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									d='M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z'
								/>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									d='M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z'
								/>
							</svg>
						</Button>
					</Link>
				</div>
			),
			header: 'Actions',
			size: 80,
		}),
	];

	const table = useReactTable({
		data: data,
		columns,
		state: {
			sorting,
			globalFilter,
		},
		onSortingChange: setSorting,
		enableGlobalFilter: true,
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
	});

	return (
		<PageWrapper name='Ledger List'>
			<Subheader>
				<SubheaderLeft>
					<FieldWrap
						firstSuffix={<Icon className='mx-2' icon='HeroMagnifyingGlass' />}
						lastSuffix={
							globalFilter && (
								<Icon
									icon='HeroXMark'
									color='red'
									className='mx-2 cursor-pointer'
									onClick={() => setGlobalFilter('')}
								/>
							)
						}>
						<Input
							className='pl-8'
							id='searchBar'
							name='searchBar'
							placeholder='Search...'
							value={globalFilter ?? ''}
							onChange={(e) => setGlobalFilter(e.target.value)}
						/>
					</FieldWrap>
				</SubheaderLeft>
			</Subheader>
			<Container>
				<Card>
					<CardBody>
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
									className='mt-2 h-[32px] w-[130px]'
									variant='solid'
									color='blue'
									type='submit'
									onClick={fetchLedgerDetails}>
									{isPdfLoading ? <LoaderDotsCommon /> : 'Generate PDF'}
								</Button>
							</div>
						</div>
						{!isLoading && table.getFilteredRowModel().rows.length > 0 ? (
							<TableTemplate
								className='table-fixed max-md:min-w-[70rem]'
								table={table}
							/>
						) : (
							!isLoading && (
								<p className='text-center text-gray-500'>No records found</p>
							)
						)}
					</CardBody>
					{table.getFilteredRowModel().rows.length > 0 && (
						<TableCardFooterTemplate table={table} />
					)}
				</Card>
			</Container>
		</PageWrapper>
	);
};

export default LedgerListPage;
