import React from 'react';
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

import PageWrapper from '../../../../components/layouts/PageWrapper/PageWrapper';
import Container from '../../../../components/layouts/Container/Container';
import Card, {
	CardBody,
	CardHeader,
	CardHeaderChild,
	CardTitle,
} from '../../../../components/ui/Card';
import Button from '../../../../components/ui/Button';
import TableTemplate, {
	TableCardFooterTemplate,
} from '../../../../templates/common/TableParts.template';
import Badge from '../../../../components/ui/Badge';
import LoaderDotsCommon from '../../../../components/LoaderDots.common';
import { PathRoutes } from '../../../../utils/routes/enum';
import { deleted, get } from '../../../../utils/api-helper.util';
import Modal, {
	ModalBody,
	ModalFooter,
	ModalFooterChild,
	ModalHeader,
} from '../../../../components/ui/Modal';
import VendorProductList from './ProductList/ProductList';
import { toast } from 'react-toastify';
import PurchaseEntryDetail from './PurchaseEntryDetail';
import Tooltip from '../../../../components/ui/Tooltip';
import DeleteConformationModal from '../../../../components/PageComponets/DeleteConformationModal/DeleteConformationModal';
import PermissionGuard from '../../../../components/buttons/CheckPermission';

const columnHelper = createColumnHelper<any>();

const PurchaseOrderListPage = () => {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [sorting, setSorting] = useState<SortingState>([]);
	const [purchaseOrderList, setPurchaseOrderList] = useState<any[]>([]);
	const [vedorProductModal, setVendorProductModal] = useState<boolean>(false);
	const [vendorId, setVenorId] = useState();
	const [branchesData, setBranchesData] = useState<any>();
	const [vendorInfo, setVendorInfo] = useState<any>();
	const [deleteModal, setDeleteModal] = useState<boolean>(false);
	const [deleteId, setDeleteId] = useState<any>('');

	console.log('vendorInfo', vendorInfo);

	const navigate = useNavigate();

	const fetchData = async () => {
		setIsLoading(true);
		try {
			const { data: purchaseOrderList } = await get(`/purchase-order`);
			purchaseOrderList.sort(
				(a: any, b: any) =>
					new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
			);
			setPurchaseOrderList(purchaseOrderList);
			setIsLoading(false);
		} catch (error: any) {
			console.error('Error fetching users:', error.message);
			setIsLoading(false);
		} finally {
			setIsLoading(false);
		}
	};

	const fetchBranchData = async () => {
		try {
			const { data: allBranchesData } = await get(`/branches`);
			setBranchesData(allBranchesData);
		} catch (error: any) {
			console.error('Error fetching users:', error.message);
		} finally {
		}
	};
	const handleClickDelete = (id: any) => {
		setDeleteModal(true);
		setDeleteId(id);
	};

	const handlePurchaseOrderDelete = async (id: any) => {
		console.log('id', id);
		try {
			const { data } = await deleted(`/purchase-order/${id}`);

			toast.success('Purchase Order  deleted Successfully!');
		} catch (error: any) {
			console.error('Error fetching users:', error.message);
			setIsLoading(false);
			toast.error('Error deleting Purchase Order', error);
		} finally {
			setIsLoading(false);
			fetchData();
			setDeleteModal(false);
		}
	};

	useEffect(() => {
		if (!vedorProductModal) {
			fetchData();
			fetchBranchData();
		}
	}, [vedorProductModal]);

	const columns = [
		columnHelper.accessor('createdAt', {
			cell: (info) => (
				<div className=''>
					{new Intl.DateTimeFormat('en-GB', {
						day: '2-digit',
						month: '2-digit',
						year: 'numeric',
					}).format(new Date(info.getValue())) || '-'}
				</div>
			),
			header: 'Date',
		}),

		columnHelper.accessor('name', {
			cell: (info) => (
				<div className=''>
					{`${info?.row?.original?.vendor?.name}`}
					{`(${info?.row?.original?.po_number})`}
				</div>
			),
			header: 'Name',
		}),

		columnHelper.accessor('status', {
			cell: (info) => <div className=''>{`${info.getValue()}`}</div>,
			header: 'Status',
		}),
		columnHelper.display({
			cell: (info) => (
				<div className='' style={{ display: 'flex', justifyContent: 'center' }}>
					<PermissionGuard permissionType='write'>
						<Button
							onClick={() => {
								navigate(
									`${PathRoutes.edit_purchase_order}/${info.row.original._id}`,
								);
							}}
							isDisable={info.row.original.status !== 'pending'}
							icon='HeroPencil'
							className='px-2.5'
						/>
					</PermissionGuard>
					<Button
						onClick={() => {
							setVendorProductModal(true),
								setVenorId(info?.row?.original?._id),
								setVendorInfo(info?.row?.original);
						}}
						icon={'HeroEye'}
						className='px-2.5'
					/>
					<PermissionGuard permissionType='delete'>
						<Button
							onClick={() => {
								handleClickDelete(info?.row?.original?._id);
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
		data: purchaseOrderList && purchaseOrderList,
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
								<CardTitle>All Purchase Order</CardTitle>
								<Badge
									variant='outline'
									className='border-transparent px-4 '
									rounded='rounded-full'>
									{table.getFilteredRowModel().rows.length} items
								</Badge>
							</CardHeaderChild>
							<PermissionGuard permissionType='write'>
								<CardHeaderChild>
									<Link to={`${PathRoutes.add_purchase_order}`}>
										<Button variant='solid' icon='HeroPlus'>
											New Purchase Order
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
								Vendor Name: {vendorInfo?.vendor?.name}
							</h2>
							<h4 className='mt-2 text-sm italic text-gray-500'>
								Phone Number: {vendorInfo?.vendor?.phone}
							</h4>
							<div>
								<h4 className='text-sm italic text-gray-500'>
									email: {vendorInfo?.vendor?.email}
								</h4>
							</div>
							<h4 className='text-sm italic text-gray-500'>
								GST Number: {vendorInfo?.vendor?.gstNumber}
							</h4>
						</div>
					</ModalHeader>
					<ModalBody>
						<PurchaseEntryDetail branchesData={branchesData} poId={vendorId} />
					</ModalBody>
				</Modal>
				{deleteModal ? (
					<DeleteConformationModal
						isOpen={deleteModal}
						setIsOpen={setDeleteModal}
						handleConform={() => handlePurchaseOrderDelete(deleteId)}
					/>
				) : null}
			</PageWrapper>
		</>
	);
};

export default PurchaseOrderListPage;
