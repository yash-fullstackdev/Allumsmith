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
import EditVendorModal from '../VendorPage/EditVendorModal';
import { toast } from 'react-toastify';

import VendorDetailCanvas from './VendorDetailCanvas';
import DeleteConformationModal from '../../../../components/PageComponets/DeleteConformationModal/DeleteConformationModal';
import PermissionGuard from '../../../../components/buttons/CheckPermission';
import { Badge, Button, Card, CardBody, CardHeader, CardHeaderChild, CardTitle, Modal, ModalBody, ModalHeader, OffCanvas, OffCanvasBody, OffCanvasHeader } from '../../../../components/ui';
import { Container, PageWrapper } from '../../../../components/layouts';

const columnHelper = createColumnHelper<any>();

const VendorListPage = () => {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [sorting, setSorting] = useState<SortingState>([]);
	const [vendorsList, setVendorsList] = useState<any[]>([]);
	const [vendorId, setVendorId] = useState('')
	const [isEditModal, setIsEditModal] = useState<boolean>(false);
	const [deleteModal, setDeleteModal] = useState<boolean>(false);
	const [deleteId, setDeleteId] = useState<string>('');
	const [vendorDetailModal, setVendorDetailModal] = useState<boolean>(false);
	const [vendorDetails, setVendorDetails] = useState<any>()

	const navigate = useNavigate();
	const fetchData = async () => {
		setIsLoading(true);
		try {
			const { data: vendorList } = await get(`/vendors`);
			console.log('VendorList', vendorList)
			vendorList.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
			setVendorsList(vendorList);
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

	const handleProductDelete = async (id: any) => {
		try {
			const { data: vendor } = await deleted(`/vendors/${id}`);
			console.log('vendor', vendor);
			toast.success(`Vendor deleted successfully!`);
		} catch (error: any) {
			console.error('Error fetching Vendors:', error);
			toast.error('Error deleting Vendor', error);
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
		columnHelper.accessor('addressLine1', {
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
				<div className='font-bold flex justify-center'>
					<PermissionGuard permissionType='write'>
						<Button
							onClick={() => {
								navigate(`${PathRoutes.edit_vendor}/${info.row.original._id}`);
							}}
							icon='HeroPencil'
							className='px-2.5'
						/>
					</PermissionGuard>
					<Button
						icon='HeroInformationCircle'
						onClick={() => {
							setVendorDetails(info.row.original);
							setVendorDetailModal(true);
						}}
						className='px-2.5'
					/>
					<PermissionGuard permissionType='delete'>
						<Button
							onClick={() => {
								handleClickDelete(info.row.original._id);
							}}
							icon='HeroDelete'
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
		data: vendorsList,
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
		<PageWrapper name='Vendor List'>
			<Container>
				<Card className='h-full'>
					<CardHeader>
						<CardHeaderChild>
							<CardTitle>All Vendors</CardTitle>
							<Badge
								variant='outline'
								className='border-transparent px-4 '
								rounded='rounded-full'>
								{table.getFilteredRowModel().rows.length} items
							</Badge>
						</CardHeaderChild>

						<PermissionGuard permissionType='write'>
							<CardHeaderChild>
								<Link to={`${PathRoutes.add_vendor}`}>
									<Button variant='solid' icon='HeroPlus'>
										New Vendor
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
					Edit Vendor
				</ModalHeader>
				<ModalBody>
					<EditVendorModal
						vendorId={vendorId}
						setIsEditModal={setIsEditModal}
						fetchData={fetchData}
					/>
				</ModalBody>
			</Modal>
			{deleteModal ? (
				<DeleteConformationModal
					isOpen={deleteModal}
					setIsOpen={setDeleteModal}
					handleConform={() => handleProductDelete(deleteId)}
				/>
			) : null}
			<OffCanvas isOpen={vendorDetailModal} setIsOpen={setVendorDetailModal}>
				<OffCanvasHeader>Vendor Detail</OffCanvasHeader>
				<OffCanvasBody>
					<VendorDetailCanvas vendorDetails={vendorDetails} />
				</OffCanvasBody>
			</OffCanvas>
		</PageWrapper>
	);
};

export default VendorListPage;
