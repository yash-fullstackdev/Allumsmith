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
import LoaderDotsCommon from '../../../../components/LoaderDots.common';
import { formatDate } from '../../../../utils/date.util';

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
							info.row.original.pending_amount || 0,
							info.row.original.credit_amount || 0,
							'text-red-500',
							'text-green-500',
						).color
					}>
					{
						renderAmount(
							(info.row.original.pending_amount || 0).toFixed(2),
							(info.row.original.credit_amount || 0).toFixed(2),
						).text
					}
				</div>
			),
		}),
		columnHelper.display({
			cell: (info: any) => (
				<div className='font-bold'>
					<Link to={`${PathRoutes.add_ledger}/${info.row.original._id}`}>
						<Button
							onClick={() => setCustomerId(info.row.original)}
							icon={'HeroEye'}
							className='px-2.5'
						/>
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
							<div className='col-span-12 lg:col-span-2'>
								<Label htmlFor='startDate'>Start Date</Label>
								<Input
									type='date'
									id='startDate'
									name='startDate'
									value={formik.values.startDate}
									onChange={formik.handleChange}
									max={formik.values.endDate}
								/>
							</div>
							<div className='col-span-12 lg:col-span-2'>
								<Label htmlFor='endDate'>End Date</Label>
								<Input
									type='date'
									id='endDate'
									name='endDate'
									value={formik.values.endDate}
									onChange={formik.handleChange}
									min={formik.values.startDate}
								/>
							</div>
							<div className='col-span-12 mt-5 w-[150px] sm:col-span-4 lg:col-span-2 lg:ml-2'>
								<Button
									className='mt-2 w-full'
									variant='solid'
									color='blue'
									type='button'
									onClick={resetFilters}>
									Reset PDF Filter
								</Button>
							</div>
							<div className='col-span-12 mt-5 flex md:justify-end sm:col-span-4 lg:col-span-6'>
								<Button
									className='mt-2 h-[33px] w-[150px]'
									variant='solid'
									color='blue'
									type='button'
									isLoading={isPdfLoading}
									isDisable={isPdfLoading}
									onClick={fetchLedgerDetails}>
									Generate PDF
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
