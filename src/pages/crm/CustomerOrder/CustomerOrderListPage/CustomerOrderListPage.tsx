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
import TableTemplate, {
	TableCardFooterTemplate,
} from '../../../../templates/common/TableParts.template';
import LoaderDotsCommon from '../../../../components/LoaderDots.common';
import { PathRoutes } from '../../../../utils/routes/enum';
import { deleted, get } from '../../../../utils/api-helper.util';
import { toast } from 'react-toastify';
import CustomerEntryDetail from './CustomerOrderDetail';
import { post } from '../../../../utils/api-helper.util';
import DeleteConformationModal from '../../../../components/PageComponets/DeleteConformationModal/DeleteConformationModal';
import PermissionGuard from '../../../../components/buttons/CheckPermission';
import { Container, PageWrapper } from '../../../../components/layouts';
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
} from '../../../../components/ui';

const columnHelper = createColumnHelper<any>();

const CustomerOrderListPage = () => {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [sorting, setSorting] = useState<SortingState>([]);
	const [customerOrderList, setCustomerOrderList] = useState<any[]>([]);
	const [vedorProductModal, setVendorProductModal] = useState<boolean>(false);
	const [customerId, setCustomerId] = useState();
	const [branchesData, setBranchesData] = useState<any>();
	const [vendorInfo, setVendorInfo] = useState<any>();
	const [deleteModal, setDeleteModal] = useState<boolean>(false);
	const [deleteId, setDeleteId] = useState<string>('');

	const handleClickDelete = (info: any) => {
		setDeleteModal(true);
		setDeleteId(info.row.original._id);
	};

	const handleDeleteCustomerOrder = async (id: any) => {
		console.log('Id', id);
		try {
			const { data: allUsers } = await deleted(`/customer-order/${id}`);
			console.log('allUsers', allUsers);
			toast.success('customer Order  deleted Successfully!');
		} catch (error: any) {
			console.error('Error fetching users:', error.message);
			setIsLoading(false);
			toast.error('Error deleting customer Order', error);
		} finally {
			setIsLoading(false);
			setDeleteModal(false);
			fetchCoData();
		}
	};

	const fetchCoData = async () => {
		setIsLoading(true);
		try {
			const { data: CustomerOrderList } = await get(`/customer-order`);
			CustomerOrderList.sort(
				(a: any, b: any) =>
					new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
			);
			setCustomerOrderList(CustomerOrderList);
			setIsLoading(false);
		} catch (error: any) {
			console.error('Error fetching customer data:', error.message);
			setIsLoading(false);
		} finally {
			setIsLoading(false);
		}
	};

	const handleGeneratePDF = async (id: any) => {
		try {
			setIsLoading(true);
			console.log(`PDF GENERATED Sucessfully for ${id}`);
			const response = await post(`/customer-order/generateReciept/${id}`, {});
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
			console.error('Error Generating PDF', error);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		fetchCoData();
	}, []);

	const columns = [
		columnHelper.accessor('customer.name', {
			cell: (info) => (
				<div className=''>
					{`${info?.row?.original?.customer?.name} (${info?.row?.original?.customerOrderNumber})`}
				</div>
			),
			header: 'Name',
		}),

		columnHelper.accessor('phone', {
			cell: (info) => <div className=''>{`${info?.row?.original?.customer?.phone}`}</div>,
			header: 'Phone',
		}),
		columnHelper.accessor('email', {
			cell: (info) => <div className=''>{`${info?.row?.original?.customer?.email}`}</div>,
			header: 'Email',
		}),
		columnHelper.display({
			cell: (info) => (
				<div className='font-bold'>
					<Button
						onClick={() => {
							setVendorProductModal(true),
								setCustomerId(info?.row?.original?._id),
								setVendorInfo(info?.row?.original);
						}}
						icon='HeroEye'
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
								handleClickDelete(info);
							}}
							icon='HeroDelete'
							className='px-2.5'
						/>
					</PermissionGuard>
				</div>
			),
			header: 'Actions',
			size: 100,
		}),
	];

	const table = useReactTable({
		data: customerOrderList && customerOrderList,
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
		<>
			<PageWrapper name='Product List'>
				<Container>
					<Card className='h-full'>
						<CardHeader>
							<CardHeaderChild>
								<CardTitle>All Customer Order</CardTitle>
								<Badge
									variant='outline'
									className='border-transparent px-4 '
									rounded='rounded-full'>
									{table.getFilteredRowModel().rows.length} items
								</Badge>
							</CardHeaderChild>
							<PermissionGuard permissionType='write'>
								<CardHeaderChild>
									<Link to={`${PathRoutes.add_customer_order}`}>
										<Button variant='solid' icon='HeroPlus'>
											New Customer Order
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
				<Modal
					isOpen={vedorProductModal}
					setIsOpen={setVendorProductModal}
					isScrollable
					fullScreen>
					<ModalHeader className='m-5 flex items-center justify-between rounded-none border-b text-lg font-bold'>
						<div>
							<h2 className='text-xl capitalize italic'>
								Customer Name: {vendorInfo?.customer?.name}
							</h2>
							<h4 className='mt-2 text-sm italic text-gray-500'>
								Phone Number: {vendorInfo?.customer?.phone}
							</h4>
							<div>
								<h4 className='text-sm italic text-gray-500'>
									email: {vendorInfo?.customer?.email}
								</h4>
							</div>
							{/* <h4 className="italic text-sm text-gray-500">
                                GST Number: {vendorInfo?.customer?.gstNumber}
                            </h4> */}
						</div>
					</ModalHeader>
					<ModalBody>
						<CustomerEntryDetail customerId={customerId} />
					</ModalBody>
				</Modal>
				{deleteModal ? (
					<DeleteConformationModal
						isOpen={deleteModal}
						setIsOpen={setDeleteModal}
						handleConform={() => handleDeleteCustomerOrder(deleteId)}
					/>
				) : null}
			</PageWrapper>
		</>
	);
};

export default CustomerOrderListPage;
