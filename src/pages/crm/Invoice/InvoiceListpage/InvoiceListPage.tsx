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
import Modal, {
	ModalBody,
	ModalFooter,
	ModalFooterChild,
	ModalHeader,
} from '../../../../components/ui/Modal';
import InvoiceCustomerDetail from './InvoiceCustomerDetail';
import Subheader, { SubheaderLeft } from '../../../../components/layouts/Subheader/Subheader';
import FieldWrap from '../../../../components/form/FieldWrap';
import Icon from '../../../../components/icon/Icon';
import Input from '../../../../components/form/Input';
import LoaderDotsCommon from '../../../../components/LoaderDots.common';
import PermissionGuard from '../../../../components/buttons/CheckPermission';
import DeleteConformationModal from '../../../../components/PageComponets/DeleteConformationModal/DeleteConformationModal';

// import InvoiceCustomerDetail from './InvoiceCustomerDetail';

const InvoiceListPage = () => {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [jobsList, setJobsList] = useState<any>([]);
	const [isEditModal, setIsEditModal] = useState(false);
	const [productInfo, setProductInfo] = useState<any>();
	const [customerId, setCustomerId] = useState();
	const [globalFilter, setGlobalFilter] = useState<string>('');
	const [deleteModal, setDeleteModal] = useState<boolean>(false);
	const [deleteId, setDeleteId] = useState<string>('');
	console.log('JobList', jobsList);
	const getInvoiceList = async () => {
		try {
			const { data } = await get('/invoice');
			data.sort(
				(a: any, b: any) =>
					new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
			);
			setJobsList(data);
		} catch (error) { }
	};

	useEffect(() => {
		getInvoiceList();
	}, []);
	const handleGeneratePDF = async (id: any) => {
		try {
			setIsLoading(true);
			console.log(`PDF GENERATED Sucessfully for ${id}`);
			const response = await post(`/invoice/generatePDF/${id}`, {});
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
			console.error('Error Generating PDF', error);
		}
	};

	const handleClickDelete = (id: any) => {
		setDeleteModal(true);
		setDeleteId(id);
	};

	const handleDeleteInvoice = async (id: any) => {
		try {
			const { data } = await deleted(`/invoice/${id}`);
			toast.success('Invoice deleted Successfully');
		} catch (error: any) {
			console.error('Error deleted Invoice:', error);
			setIsLoading(false);
			toast.error('Error deleting Invoice', error);
		} finally {
			setIsLoading(false);
			getInvoiceList();
			setDeleteModal(false);
		}
	};

	const columns = [
		columnHelper.accessor('customerName.name', {
			cell: (info) => <div className=''>{`${info.getValue() || 'NA'} `}</div>,
			header: 'Name',
		}),
		columnHelper.accessor('invoiceNumber', {
			cell: (info) => <div className=''>{`${info.getValue() || 'NA'} `}</div>,
			header: 'Invoice Number',
		}),
		columnHelper.accessor('customerEmail', {
			cell: (info) => <div className=''>{`${info.getValue() || 'NA'} `}</div>,
			header: 'Email',
		}),
		columnHelper.accessor('customerPhone', {
			cell: (info) => <div className=''>{`${info.getValue() || 'NA'} `}</div>,
			header: 'Phone',
		}),

		columnHelper.display({
			cell: (info) => (
				<div className='font-bold'>
					<Button
						onClick={() => {
							setIsEditModal(true), setCustomerId(info?.row?.original?._id);
							setProductInfo(info?.row?.original.products);
						}}
						icon={'HeroEye'}
						className='px-2.5'

					/>
					<Button
						onClick={() => {
							handleGeneratePDF(info.row.original._id);
						}}
						icon='DuoFile'
						className='px-2.5'

					/>
					<PermissionGuard permissionType='delete'>
						<Button
							onClick={() => {
								handleClickDelete(info.row.original._id);
							}}
							icon={'HeroDelete'}
							className='px-2.5'

						/>
					</PermissionGuard>
				</div>
			),
			header: 'Actions',
			size: 120,
		}),
	];
	const table = useReactTable({
		data: jobsList,
		columns,
		state: {
			globalFilter,
		},
		// onSortingChange: setSorting,
		enableGlobalFilter: true,
		onGlobalFilterChange: setGlobalFilter,
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
	});
	return (
		<PageWrapper name='Invoice List'>
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
					<CardHeader>
						<CardHeaderChild>
							<CardTitle>
								<h1>Invoice List</h1>
							</CardTitle>
						</CardHeaderChild>
						<PermissionGuard permissionType='write'>
							<CardHeaderChild>
								<Link to={`${PathRoutes.add_invoice}`}>
									<Button variant='solid' icon='HeroPlus'>
										New Invoice
									</Button>
								</Link>
							</CardHeaderChild>
						</PermissionGuard>
					</CardHeader>
					{isLoading ? (
						<div className='flex justify-center'>
							{isLoading && <LoaderDotsCommon />}
						</div>
					) : (
						<CardBody>
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
					)}

					{!isLoading && table.getFilteredRowModel().rows.length > 0 && (
						<TableCardFooterTemplate table={table} />
					)}
				</Card>
			</Container>
			<Modal isOpen={isEditModal} setIsOpen={setIsEditModal} isScrollable fullScreen>
				<ModalHeader className='m-5 flex items-center justify-between rounded-none border-b text-lg font-bold'>
					Products
				</ModalHeader>
				<ModalBody>
					<InvoiceCustomerDetail productInfo={productInfo} />
				</ModalBody>
			</Modal>
			{deleteModal ? (
				<DeleteConformationModal
					isOpen={deleteModal}
					setIsOpen={setDeleteModal}
					handleConform={() => handleDeleteInvoice(deleteId)}
				/>
			) : null}
		</PageWrapper>
	);
};

export default InvoiceListPage;
