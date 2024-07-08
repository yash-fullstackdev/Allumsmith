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
	ModalHeader,
} from '../../../../components/ui/Modal';
import { toast } from 'react-toastify';
import CoatingColors from './CoatingColors';
import DeleteConformationModal from '../../../../components/PageComponets/DeleteConformationModal/DeleteConformationModal';
import PermissionGuard from '../../../../components/buttons/CheckPermission';

const columnHelper = createColumnHelper<any>();

const CoatingListPage = () => {
	const navigate = useNavigate();
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [sorting, setSorting] = useState<SortingState>([]);
	const [coatingList, setCoatingList] = useState<any[]>([]);
	const [colorModal, setColorModal] = useState<boolean>(false);
	const [colors, setColors] = useState<any>([]);

	const [deleteModal, setDeleteModal] = useState<boolean>(false);
	const [deleteId, setDeleteId] = useState<string>('');

	const fetchCoatingData = async () => {
		setIsLoading(true);
		try {
			const { data: coatingList } = await get(`/coatings`);
			coatingList.sort(
				(a: any, b: any) =>
					new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
			);
			setCoatingList(coatingList);
			setIsLoading(false);
		} catch (error: any) {
			console.error('Error fetching users:', error.message);
			setIsLoading(false);
		} finally {
			setIsLoading(false);
		}
	};
	useEffect(() => {
		fetchCoatingData();
	}, []);



	const handleClickDelete = (id: any) => {
		setDeleteModal(true);
		setDeleteId(id);
	};

	const handleDeleteCoating = async (id: any) => {
		try {
			const { data: coating } = await deleted(`/coatings/${id}`);
			console.log('coating', coating);
			toast.success('Coating deleted Successfully');
		} catch (error: any) {
			console.error('Error deleted Coating:', error);
			setIsLoading(false);
			toast.error('Error deleting Coating', error);
		} finally {
			setIsLoading(false);
			fetchCoatingData();
			setDeleteModal(false);
		}
	};

	const columns = [
		columnHelper.accessor('name', {
			cell: (info) => <div className=''>{`${info.getValue()}`}</div>,
			header: 'Name',
		}),
		columnHelper.accessor('code', {
			cell: (info) => <div className=''>{`${info.getValue()}`}</div>,
			header: 'Code',
		}),

		columnHelper.display({
			cell: (info) => (
				<div className='flex justify-center items-center font-bold'>
					<PermissionGuard permissionType='write'>
						<Button
							onClick={() => {
								navigate(`${PathRoutes.edit_coating}/${info.row.original._id}`);
							}}
							icon='HeroPencil'
							className='px-2.5'

						/>
					</PermissionGuard>
					<Button
						onClick={() => {
							setColorModal(true);
							setColors(info.row.original.colors);
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
			size: 80,
		}),
	];

	const table = useReactTable({
		data: coatingList,
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
		<PageWrapper name='Inventory List'>
			<Container>
				<Card className='h-full'>
					<CardHeader>
						<CardHeaderChild>
							<CardTitle>All Coating</CardTitle>
							<Badge
								variant='outline'
								className='border-transparent px-4 '
								rounded='rounded-full'>
								{table.getFilteredRowModel().rows.length} items
							</Badge>
						</CardHeaderChild>
						<PermissionGuard permissionType='write'>
							<CardHeaderChild>
								<Link to={`${PathRoutes.add_coating}`}>
									<Button variant='solid' icon='HeroPlus'>
										New Coating
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
			<Modal isOpen={colorModal} setIsOpen={setColorModal} isScrollable fullScreen>
				<ModalHeader className='m-5 flex items-center justify-between rounded-none border-b text-lg font-bold'>
					Coating
				</ModalHeader>
				<ModalBody>
					<CoatingColors colors={colors} />
				</ModalBody>
			</Modal>
			{deleteModal ? (
				<DeleteConformationModal
					isOpen={deleteModal}
					setIsOpen={setDeleteModal}
					handleConform={() => handleDeleteCoating(deleteId)}
				/>
			) : null}
		</PageWrapper>
	);
};

export default CoatingListPage;
