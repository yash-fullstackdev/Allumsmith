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
import { Link, useNavigate } from 'react-router-dom';
import TableTemplate, {
	TableCardFooterTemplate,
} from '../../../../templates/common/TableParts.template';
import LoaderDotsCommon from '../../../../components/LoaderDots.common';
import { PathRoutes } from '../../../../utils/routes/enum';
import { deleted, get } from '../../../../utils/api-helper.util';
import { toast } from 'react-toastify';
import EditCustomerModal from '../CustomerPage/EditVendorModal';
import CustomerDetailsCanvas from '../CustomerPage/CustomerDetailsCanvas';
import DeleteConformationModal from '../../../../components/PageComponets/DeleteConformationModal/DeleteConformationModal';
import PermissionGuard from '../../../../components/buttons/CheckPermission';
import {
	Badge,
	Button,
	Card,
	CardBody,
	CardHeader,
	CardHeaderChild,
	CardTitle,
	Modal,
	ModalBody,
	ModalHeader,
	OffCanvas,
	OffCanvasBody,
	OffCanvasHeader,
} from '../../../../components/ui';
import { Container, PageWrapper } from '../../../../components/layouts';

const columnHelper = createColumnHelper<any>();

const CustomerListPage = () => {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [sorting, setSorting] = useState<SortingState>([]);
	const [custmoerList, setCustomerList] = useState<any[]>([]);
	const [customerDetailsModal, setCustomerDetailsModal] = useState<boolean>(false);
	const [customerDetails, setCustomerDetails] = useState<any>({});
	const [customerId, setCustomerId] = useState('');
	const [isEditModal, setIsEditModal] = useState<boolean>(false);
	const [deleteModal, setDeleteModal] = useState<boolean>(false);
	const [deleteId, setDeleteId] = useState<string>('');
	const navigate = useNavigate();
	const fetchData = async () => {
		setIsLoading(true);
		try {
			const { data: customerList } = await get(`/customers`);
			customerList.sort(
				(a: any, b: any) =>
					new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
			);
			setCustomerList(customerList);
			setIsLoading(false);
		} catch (error: any) {
			console.error('Error fetching users:', error.message);
			setIsLoading(false);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		fetchData();
	}, []);

	const handleClickDelete = (id: any) => {
		setDeleteModal(true);
		setDeleteId(id);
	};

	const handleDeleteCustomer = async (id: any) => {
		try {
			const { data: customer } = await deleted(`/customers/${id}`);
			console.log('customer', customer);
			toast.success(`customer deleted successfully!`);
		} catch (error: any) {
			console.error('Error fetching customers:', error);
			toast.error('Error deleting customer', error);
			setIsLoading(false);
		} finally {
			setIsLoading(false);
			fetchData();
			setDeleteModal(false);
		}
	};

	const columns = [
		columnHelper.accessor('name', {
			cell: (info) => <div className=''>{`${info.getValue()}`}</div>,
			header: 'Name',
		}),
		columnHelper.accessor('email', {
			cell: (info) => <div className=''>{`${info.getValue()}`}</div>,
			header: 'Email',
		}),
		columnHelper.accessor('address_line1', {
			cell: (info) => <div className=''>{`${info.getValue()}`}</div>,
			header: 'Address',
		}),
		columnHelper.accessor('phone', {
			cell: (info) => <div className=''>{`${info.getValue()}`}</div>,
			header: 'Phone',
		}),
		columnHelper.accessor('company', {
			cell: (info) => <div className=''>{`${info.getValue()}`}</div>,
			header: 'Company',
		}),
		columnHelper.display({
			cell: (info) => (
				<div
					className='justify-center font-bold'
					style={{ display: 'flex', justifyContent: 'center' }}>
					<PermissionGuard permissionType='write'>
						<Button
							onClick={() => {
								navigate(`${PathRoutes.edit_customer}/${info.row.original._id}`);
							}}
							icon='HeroPencil'
							className='px-2.5'
						/>
					</PermissionGuard>
					<Button
						className='px-2.5'
						icon='HeroEye'
						onClick={() => {
							setCustomerDetailsModal(true), setCustomerDetails(info?.row?.original);
						}}
					/>
					<PermissionGuard permissionType='delete'>
						<Button
							className='px-2.5'
							icon='HeroDelete'
							onClick={() => {
								handleClickDelete(info.row.original._id);
							}}
						/>
					</PermissionGuard>
				</div>
			),
			header: 'Actions',
			size: 100,
		}),
	];

	const table = useReactTable({
		data: custmoerList,
		columns,
		state: {
			sorting,
		},
		onSortingChange: setSorting,
		enableGlobalFilter: true,
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
	});

	return (
		<PageWrapper name='Customer List'>
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
						<PermissionGuard permissionType='write'>
							<CardHeaderChild>
								<Link to={`${PathRoutes.add_customer}`}>
									<Button variant='solid' icon='HeroPlus'>
										New Customer
									</Button>
								</Link>
							</CardHeaderChild>
						</PermissionGuard>
					</CardHeader>
					<CardBody className='overflow-auto'>
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
						<div className='flex justify-center'>
							{isLoading && <LoaderDotsCommon />}
						</div>
					</CardBody>
					{table.getFilteredRowModel().rows.length > 0 && (
						<TableCardFooterTemplate table={table} />
					)}
				</Card>
			</Container>
			<Modal isOpen={isEditModal} setIsOpen={setIsEditModal} isScrollable fullScreen='2xl'>
				<ModalHeader
					className='m-5 flex items-center justify-between rounded-none border-b text-lg font-bold'
					// onClick={() => formik.resetForm()}
				>
					Edit Customer
				</ModalHeader>
				<ModalBody>
					<EditCustomerModal
						customerId={customerId}
						setIsEditModal={setIsEditModal}
						fetchData={fetchData}
					/>
				</ModalBody>
			</Modal>
			<OffCanvas isOpen={customerDetailsModal} setIsOpen={setCustomerDetailsModal}>
				<OffCanvasHeader>Customer Detail</OffCanvasHeader>
				<OffCanvasBody>
					<CustomerDetailsCanvas customerDetails={customerDetails} />
				</OffCanvasBody>
			</OffCanvas>

			{deleteModal ? (
				<DeleteConformationModal
					isOpen={deleteModal}
					setIsOpen={setDeleteModal}
					handleConform={() => handleDeleteCustomer(deleteId)}
				/>
			) : null}
		</PageWrapper>
	);
};

export default CustomerListPage;
