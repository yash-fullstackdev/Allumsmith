import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
	createColumnHelper,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	SortingState,
	useReactTable,
} from '@tanstack/react-table';
import { useFormik } from 'formik';
import { collection, getDocs, doc, getDoc, query, where, deleteDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import Container from '../../../../components/layouts/Container/Container';
import { ERPshippingContacts } from '../../../../mocks/db/users.db';

import { CardBody, CardHeader, CardHeaderChild } from '../../../../components/ui/Card';

import Button from '../../../../components/ui/Button';

import Badge from '../../../../components/ui/Badge';

import firestore from '../../../../firebase'; // Import your Firebase configuration

import { customerSchema } from '../../../../utils/formValidations';

import LoaderDotsCommon from '../../../../components/LoaderDots.common';
import TableTemplate, {
	TableCardFooterTemplate,
} from '../../../../templates/common/TableParts.template';
import Modal, { ModalFooter, ModalFooterChild, ModalHeader } from '../../../../components/ui/Modal';
import getUserRights from '../../../../hooks/useUserRights';

const SCTable = ({
	customerNumberid,
	handleEditClick,
	customers,
	setCustomers,
	temporarySCdata,
	id,
	setTempeorarySCData,
}: any) => {
	const [isLoading, setIsLoading] = useState(false);
	const [exModal1, setExModal1] = useState<boolean>(false);
	const [sorting, setSorting] = useState<SortingState>([]);
	const [globalFilter, setGlobalFilter] = useState<string>('');
	const [helperId, setHelperId] = useState<string>('');
	const [searchParam] = useSearchParams();
	const cloneUserId = searchParam.get('cloneUser');
	const columnHelper = createColumnHelper<ERPshippingContacts>();

	useEffect(() => {
		if (id == 'new' && cloneUserId) {
			getCustomerDoc(cloneUserId);
		} else if (id) {
			getCustomerDoc(id);
		}
		// getRoles();
	}, [id]);

	const getCustomerDoc = useCallback(async (customerId: any) => {
		try {
			const customerData = await getDoc(doc(firestore, `customers/${customerId}`));
		} catch { }
	}, []);

	const getCustomers = async () => {
		setIsLoading(true);

		try {
			const customersRef = await getDocs(
				query(
					collection(firestore, 'shipping-contacts'),
					where('customerNumber', '==', customerNumberid),
				),
			);

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
		} catch {
			console.error('Error fetching customers:');
			setIsLoading(false);
		}
	};

	useEffect(() => {
		if (customerNumberid) {
			getCustomers();
		}
	}, [customerNumberid]);
	const privileges = getUserRights('customers');
	const columns = [
		columnHelper.accessor('SCshipToCode', {
			cell: (info: any) => (
				<div className='font-bold'>{`${info.row.original.SCshipToCode}`}</div>
			),
			header: 'Ship To Code',
		}),
		columnHelper.accessor('SCshippingLocation', {
			cell: (info: any) => <div>{`${info.row.original.SCshippingLocation}`}</div>,
			header: 'Shipping Location',
		}),
		columnHelper.accessor('SCcontactAddress1', {
			cell: (info: any) => <div>{`${info.row.original.SCcontactAddress1}`}</div>,
			header: 'Address',
		}),

		columnHelper.accessor('SCcity', {
			cell: (info: any) => <div>{`${info.row.original.SCcity}`}</div>,
			header: 'City',
		}),
		columnHelper.accessor('SCstate', {
			cell: (info: any) => <div>{`${info.row.original.SCstate}`}</div>,
			header: 'State',
		}),

		columnHelper.display({
			cell: (info: any) => (
				<div>
					{privileges.canWrite() ? (
						<Button
							onClick={() =>
								handleEditClick(
									id === 'new'
										? info.row.original.SCshipToCode
										: info.row.original.id,
								)
							}>
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
						</Button>
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
		}),
	];

	const table = useReactTable({
		data: id == 'new' ? temporarySCdata : customers,
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

	const handleClickDelete = (info: any) => {
		setExModal1(true);
		setHelperId(id === 'new' ? info?.row?.original?.SCshipToCode : info?.row?.original?.id);
	};

	const handleDeleteSC = async (SCId: any) => {
		if (id === 'new') {
			const updatedArray = temporarySCdata.filter((item: any) => item.SCshipToCode !== SCId);
			toast.success('Shipping Contact deleted successfully!');
			setExModal1(false);
			setTempeorarySCData(updatedArray);
		} else {
			try {
				await deleteDoc(doc(firestore, 'shipping-contacts', SCId));
				toast.success('Shipping Contact deleted successfully!');
				setExModal1(false);
				getCustomers(); // Refresh the data after deletion
			} catch (error) {
				console.error('Error deleting Shipping Contact:', error);
				toast.error('Error deleting Shipping Contact');
			}
		}
	};

	return (
		<div className='flex shrink-0 grow basis-auto flex-col pb-0'>
			<div className='col-span-12 md:col-span-6'>
				{/* <Card className='h-full'> */}
				<CardHeader>
					<CardHeaderChild>
						<div className='flex  w-full'>
							<div
								style={{ whiteSpace: 'nowrap' }}
								className='flex w-full items-center rounded-none text-lg font-bold'>
								Shipping Location
							</div>
							<Badge
								variant='outline'
								className='mx-2 w-full border-transparent px-4'
								rounded='rounded-full'>
								{table.getFilteredRowModel().rows.length} items
							</Badge>
						</div>
					</CardHeaderChild>
				</CardHeader>
				<CardBody className='overflow-auto'>
					{!isLoading && (
						<TableTemplate className='table-fixed max-md:min-w-[70rem]' table={table} />
					)}
					<div className='flex justify-center'>{isLoading && <LoaderDotsCommon />}</div>
				</CardBody>
				<TableCardFooterTemplate table={table} />
				{/* </Card> */}
			</div>

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
								// console.log(605)
								handleDeleteSC(helperId);
							}}>
							Delete
						</Button>
					</ModalFooterChild>
				</ModalFooter>
			</Modal>
		</div>
	);
};

export default SCTable;
