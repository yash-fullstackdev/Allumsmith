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
import EditWorkerModal from '../WorkerPage/EditWorkerModal';
import AssociatedJobsModal from './AssociatedJobsModal';
import PermissionGuard from '../../../../components/buttons/CheckPermission';
import DeleteConformationModal from '../../../../components/PageComponets/DeleteConformationModal/DeleteConformationModal';
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
import { Container, PageWrapper } from '../../../../components/layouts';

const columnHelper = createColumnHelper<any>();

const WorkerListPage = () => {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [sorting, setSorting] = useState<SortingState>([]);
	const [workerList, setWorkerList] = useState<any[]>([]);
	const [workerId, setWorkerId] = useState('');
	const [isEditModal, setIsEditModal] = useState<boolean>(false);
	const [associatedJobs, setAssociatedJobs] = useState<any>([]);
	const [associatedJobsModal, setAssociatedJobsModal] = useState<boolean>(false);
	const [deleteModal, setDeleteModal] = useState<boolean>(false);
	const [deleteId, setDeleteId] = useState<string>('');
	const navigate = useNavigate();
	const fetchData = async () => {
		setIsLoading(true);
		try {
			const { data: workerData } = await get(`/workers`);
			console.log(workerData);

			workerData.sort(
				(a: any, b: any) =>
					new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
			);
			setWorkerList(workerData);
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

	const handleDeleteWorker = async (id: any) => {
		try {
			const { data: worker } = await deleted(`/workers/${id}`);
			toast.success(`worker deleted successfully!`);
		} catch (error: any) {
			console.error('Error fetching workers:', error);
			toast.error('Error deleting worker', error);
			setIsLoading(false);
		} finally {
			setIsLoading(false);
			fetchData();
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
				<div className='flex justify-center font-bold'>
					<PermissionGuard permissionType='write'>
						<Button
							onClick={() => {
								navigate(`${PathRoutes.edit_worker}/${info.row.original._id}`);
							}}
							icon='HeroPencil'
							className='px-2.5'
						/>
					</PermissionGuard>
					<Button
						onClick={() => {
							setAssociatedJobs(info.row.original?._id);
							setAssociatedJobsModal(true);
						}}
						icon='HeroEye'
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
			size: 150,
		}),
	];

	const table = useReactTable({
		data: workerList,
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
		<PageWrapper name='Worker List'>
			<Container>
				<Card className='h-full'>
					<CardHeader>
						<CardHeaderChild>
							<CardTitle>All Workers</CardTitle>
							<Badge
								variant='outline'
								className='border-transparent px-4 '
								rounded='rounded-full'>
								{table.getFilteredRowModel().rows.length} items
							</Badge>
						</CardHeaderChild>
						<PermissionGuard permissionType='write'>
							<CardHeaderChild>
								<Link to={`${PathRoutes.add_worker}`}>
									<Button variant='solid' icon='HeroPlus'>
										New Worker
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
					Edit Worker
				</ModalHeader>
				<ModalBody>
					<EditWorkerModal
						workerId={workerId}
						setIsEditModal={setIsEditModal}
						fetchData={fetchData}
					/>
				</ModalBody>
			</Modal>

			<Modal
				isOpen={associatedJobsModal}
				setIsOpen={setAssociatedJobsModal}
				isScrollable
				fullScreen>
				<ModalHeader className='m-5 flex items-center justify-between rounded-none border-b text-lg font-bold'>
					Associated Jobs
				</ModalHeader>
				<ModalBody>
					<AssociatedJobsModal
						associatedJobs={associatedJobs}
						setAssociatedJobsModal={setAssociatedJobsModal}
					/>
				</ModalBody>
			</Modal>

			{deleteModal ? (
				<DeleteConformationModal
					isOpen={deleteModal}
					setIsOpen={setDeleteModal}
					handleConform={() => handleDeleteWorker(deleteId)}
				/>
			) : null}
		</PageWrapper>
	);
};

export default WorkerListPage;
