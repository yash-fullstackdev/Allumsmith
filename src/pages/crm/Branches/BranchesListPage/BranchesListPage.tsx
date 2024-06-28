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
import EditBranchModal from '../BranchesPage/EditBranchModal';
import OffCanvas, {
	OffCanvasBody,
	OffCanvasFooter,
	OffCanvasHeader,
} from '../../../../components/ui/OffCanvas';
import { toast } from 'react-toastify';
import BranchDetailCanvas from './BranchDetailCanvas';
import DeleteConformationModal from '../../../../components/PageComponets/DeleteConformationModal/DeleteConformationModal';


import PermissionGuard from '../../../../components/buttons/CheckPermission';

const columnHelper = createColumnHelper<any>();

const BranchesListPage = () => {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [sorting, setSorting] = useState<SortingState>([]);
	const [branchesList, setBranchesList] = useState<any[]>([]);
	const [branchId, setBranchId] = useState('');
	const [isEditModal, setIsEditModal] = useState(false);
	const [deleteModal, setDeleteModal] = useState<boolean>(false);
	const [deleteId, setDeleteId] = useState<string>('');
	const [branchDetailModal, setBranchDetailModal] = useState<boolean>(false);
	const [branchDetail, setBranchDetail] = useState<any>();

	const navigate = useNavigate();

	const fetchData = async () => {
		setIsLoading(true);
		try {
			const { data: branchesList } = await get(`/branches`);
			branchesList.sort(
				(a: any, b: any) =>
					new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
			);
			setBranchesList(branchesList);
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

	const handleDeleteBranch = async (id: any) => {
		console.log('Id', id);
		try {
			const { data: branches } = await deleted(`/branches/${id}`);

			console.log('branches', branches);
			toast.success('Branch deleted Successfully');
		} catch (error: any) {
			console.error('Error deleted Branches:', error);
			setIsLoading(false);
			toast.error('Error deleting Branch', error);
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
		columnHelper.accessor('contact_name', {
			cell: (info) => <div className=''>{`${info.getValue()}`}</div>,
			header: 'Contact Name',
		}),
		columnHelper.accessor('address_line1', {
			cell: (info) => <div className=''>{`${info.getValue()}`}</div>,
			header: 'Address',
		}),
		columnHelper.accessor('phone', {
			cell: (info) => <div className=''>{`${info.getValue()}`}</div>,
			header: 'Phone',
		}),

		columnHelper.display({
			cell: (info) => (
				<div className='flex justify-center font-bold'>
					<PermissionGuard permissionType='write'>
						<Button
							onClick={() => {
								navigate(`${PathRoutes.edit_branches}/${info.row.original._id}`);
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
									d='M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125'
								/>
							</svg>
						</Button>
					</PermissionGuard>
					<Button
						icon='HeroInformationCircle'
						onClick={() => {
							setBranchDetail(info.row.original);
							setBranchDetailModal(true);
						}}></Button>
					<PermissionGuard permissionType='delete'>
						<Button
							onClick={() => {
								handleClickDelete(info.row.original._id);
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
					</PermissionGuard>
				</div>
			),
			header: 'Actions',
			size: 120,
		}),
	];

	const table = useReactTable({
		data: branchesList,
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
		<PageWrapper name='Branches List'>
			<Container>
				<Card className='h-full'>
					<CardHeader>
						<CardHeaderChild>
							<CardTitle>All Branches</CardTitle>
							<Badge
								variant='outline'
								className='border-transparent px-4 '
								rounded='rounded-full'>
								{table.getFilteredRowModel().rows.length} items
							</Badge>
						</CardHeaderChild>
						<PermissionGuard permissionType='write'>
							<CardHeaderChild>
								<Link to={`${PathRoutes.add_branches}`}>
									<Button variant='solid' icon='HeroPlus'>
										New Branch
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
					Edit Branch
				</ModalHeader>
				<ModalBody>
					<EditBranchModal
						branchId={branchId}
						setIsEditModal={setIsEditModal}
						fetchData={fetchData}
					/>
				</ModalBody>
			</Modal>


			{deleteModal ? (
				<DeleteConformationModal
					isOpen={deleteModal}
					setIsOpen={setDeleteModal}
					handleConform={() => handleDeleteBranch(deleteId)}
				/>
			) : null}
			<OffCanvas isOpen={branchDetailModal} setIsOpen={setBranchDetailModal}>
				<OffCanvasHeader>Branch Detail</OffCanvasHeader>
				<OffCanvasBody>
					<BranchDetailCanvas branchDetails={branchDetail} />
				</OffCanvasBody>
			</OffCanvas>
		</PageWrapper>
	);
};

export default BranchesListPage;
