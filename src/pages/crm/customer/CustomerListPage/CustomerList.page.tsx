import { useEffect, useState } from 'react';
import {
	createColumnHelper,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	SortingState,
	useReactTable,
} from '@tanstack/react-table';
import { Link } from 'react-router-dom';
import { collection, deleteDoc, doc, getDocs } from 'firebase/firestore';

import { toast } from 'react-toastify';
import PageWrapper from '../../../../components/layouts/PageWrapper/PageWrapper';
import Container from '../../../../components/layouts/Container/Container';
import { appPages } from '../../../../config/pages.config';
import Card, {
	CardBody,
	CardHeader,
	CardHeaderChild,
	CardTitle,
} from '../../../../components/ui/Card';
import Button from '../../../../components/ui/Button';
import Icon from '../../../../components/icon/Icon';
import Input from '../../../../components/form/Input';
import TableTemplate, {
	TableCardFooterTemplate,
} from '../../../../templates/common/TableParts.template';
import Badge from '../../../../components/ui/Badge';

import Subheader, { SubheaderLeft } from '../../../../components/layouts/Subheader/Subheader';
import FieldWrap from '../../../../components/form/FieldWrap';
import firestore from '../../../../firebase';
import LoaderDotsCommon from '../../../../components/LoaderDots.common';
import Modal, { ModalFooter, ModalFooterChild, ModalHeader } from '../../../../components/ui/Modal';
import getUserRights from '../../../../hooks/useUserRights';

const columnHelper = createColumnHelper<any>();

const editLinkPath = `../${appPages.crmAppPages.subPages.customerPage.subPages.editPageLink.to}/`;

const CustomerListPage = () => {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [sorting, setSorting] = useState<SortingState>([]);
	const [globalFilter, setGlobalFilter] = useState<string>('');
	const [customers, setCustomers] = useState<any[]>([]);
	const [exModal1, setExModal1] = useState<boolean>(false);
	const [helperId, setHelperId] = useState<string>('');
	const privileges = getUserRights('customers');
	useEffect(() => {
		getCustomers();
	}, []);

	const columns = [
		columnHelper.accessor('id', {
			cell: (info) => (
				<Link to={`${editLinkPath}${info.row.original.id}`}>
					<div className='font-bold'>{`${info.row.original.id}`}</div>
				</Link>
			),
			header: 'ID',
			size: 80,
		}),
		columnHelper.accessor('Name', {
			cell: (info) => (
				<Link to={`${editLinkPath}${info.row.original.id}`}>
					<div className=''>{`${info.row.original.Name}`}</div>
				</Link>
			),
			header: 'Name',
			size: 200,
		}),
		columnHelper.accessor('address', {
			cell: (info) => (
				<Link to={`${editLinkPath}${info.row.original.id}`}>
					<div className=''>
						{`${info.row.original.address}` || `${info.row.original.address}`}
					</div>
				</Link>
			),
			header: 'Address',
			size: 200,
		}),
		columnHelper.accessor('state', {
			cell: (info) => (
				<Link to={`${editLinkPath}${info.row.original.id}`}>
					<div className=''>{`${info.row.original.state}`}</div>
				</Link>
			),
			header: 'State',
			size: 150,
		}),
		// columnHelper.accessor('zipcode', {
		// 	cell: (info) => (
		// 		<Link to={`${editLinkPath}${info.row.original.id}`}>
		// 			<div className=''>{`${info.row.original.zipcode}`}</div>
		// 		</Link>
		// 	),
		// 	header: 'Zip Code',
		// }),

		columnHelper.display({
			cell: (info) => (
				<div className='font-bold'>
					{privileges.canWrite() ? (
						<Link to={`${editLinkPath}${info.row.original.id}`}>
							<Button>
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
										d='M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125'
									/>
								</svg>
							</Button>{' '}
						</Link>
					) : null}
					{privileges.canDelete() ? (
						<Button
							onClick={() => {
								handleClickDelete(info);
							}}>
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
									d='M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0'
								/>
							</svg>
						</Button>
					) : null}
				</div>
			),
			header: 'Actions',
			size: 80,
		}),
	];

	const getCustomers = async () => {
		setIsLoading(true);
		try {
			const customersRef = await getDocs(collection(firestore, 'customers'));
			const allCustomers = [];

			for (const customer of customersRef.docs) {
				const customerWithData = {
					...customer.data(),
					id: customer.id,
				};
				allCustomers.push(customerWithData);
			}

			setCustomers(allCustomers);

			setIsLoading(false);
		} catch (error) {
			console.error('Error fetching customers:', error);
			setIsLoading(false);
		}
	};

	const table = useReactTable({
		data: customers,
		columns,
		state: {
			sorting,
			globalFilter,
		},
		onSortingChange: setSorting,
		enableGlobalFilter: true,
		onGlobalFilterChange: setGlobalFilter,
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
	});

	// delete customer
	const handleClickDelete = (info: any) => {
		setExModal1(true);
		setHelperId(info.row.original.id);
	};

	const handleDeleteCustomer = async (customerId: any) => {
		try {
			await deleteDoc(doc(firestore, 'customers', customerId));
			toast.success('Customer deleted successfully!');
			setExModal1(false);
			getCustomers(); // Refresh the data after deletion
		} catch (error) {
			console.error('Error deleting customer:', error);
			toast.error('Error deleting customer');
		}
	};

	return privileges.canRead() ? (
		<PageWrapper name='Customer List'>
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
									onClick={() => {
										setGlobalFilter('');
									}}
								/>
							)
						}>
						<Input
							className='pl-8'
							id='example'
							name='example'
							placeholder='Search...'
							value={globalFilter ?? ''}
							onChange={(e) => setGlobalFilter(e.target.value)}
						/>
					</FieldWrap>
				</SubheaderLeft>
			</Subheader>
			<Container>
				<Card className='h-full'>
					<CardHeader>
						<CardHeaderChild>
							<CardTitle>All Customers</CardTitle>
							<Badge
								variant='outline'
								className='border-transparent px-4 '
								rounded='rounded-full'>
								{table.getFilteredRowModel().rows.length} items
							</Badge>
						</CardHeaderChild>
						{privileges.canWrite() && (
							<CardHeaderChild>
								<Link to={`${editLinkPath}new`}>
									<Button variant='solid' icon='HeroPlus'>
										New Customer
									</Button>
								</Link>
							</CardHeaderChild>
						)}
					</CardHeader>
					<CardBody className='overflow-auto'>
						{!isLoading && (
							<TableTemplate
								className='table-fixed max-md:min-w-[70rem]'
								table={table}
							/>
						)}
						<div className='flex justify-center'>
							{isLoading && <LoaderDotsCommon />}
						</div>
					</CardBody>
					<TableCardFooterTemplate table={table} />
				</Card>
			</Container>
			<Modal isOpen={exModal1} setIsOpen={setExModal1}>
				<ModalHeader>Are you sure?</ModalHeader>
				<ModalFooter>
					<ModalFooterChild>
						Do you really want to delete these records? This cannot be undone.
					</ModalFooterChild>
					<ModalFooterChild>
						<Button onClick={() => setExModal1(false)} color='blue' variant='outlined'>
							Cancel
						</Button>
						<Button
							variant='solid'
							onClick={() => {
								handleDeleteCustomer(helperId);
							}}>
							Delete
						</Button>
					</ModalFooterChild>
				</ModalFooter>
			</Modal>
		</PageWrapper>
	) : (
		<div className='flex h-screen items-center justify-center font-bold'>
			You Dont Have Permission to View the record
		</div>
	);
};

export default CustomerListPage;
