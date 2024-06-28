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
import { Link } from 'react-router-dom';

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
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import EditColorModal from '../ColorsPage/EditColorModal';
import Subheader, {
	SubheaderLeft,
	SubheaderSeparator,
} from '../../../../components/layouts/Subheader/Subheader';
import { Switch } from '@mui/material';
import Label from '../../../../components/form/Label';
import PermissionGuard from '../../../../components/buttons/CheckPermission';
import DeleteConformationModal from '../../../../components/PageComponets/DeleteConformationModal/DeleteConformationModal';

const columnHelper = createColumnHelper<any>();

const ColorsListPage = () => {
	const navigate = useNavigate();
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [sorting, setSorting] = useState<SortingState>([]);
	const [colorsList, setColorsList] = useState<any[]>([]);
	const [colorId, setColorId] = useState('');
	const [isEditModal, setIsEditModal] = useState(false);
	const [colorState, setColorState] = useState<boolean>(false);
	const [deleteModal, setDeleteModal] = useState<boolean>(false);
	const [deleteId, setDeleteId] = useState<string>('');
	const fetchData = async () => {
		setIsLoading(true);
		try {
			const { data: colorsList } = await get(`/colors`);
			setColorsList(colorsList);
			filterData(colorsList, colorState);
			setIsLoading(false);
		} catch (error: any) {
			console.error('Error fetching users:', error.message);
			setIsLoading(false);
		} finally {
			setIsLoading(false);
		}
	};

	const handleToggleCoatingState = () => {
		setColorState((prevState) => !prevState);
	};

	const filterData = (data: any[], isCoating: boolean) => {
		let filtered;
		if (isCoating) {
			filtered = data.filter((item) => item.type === 'anodize');
		} else {
			filtered = data.filter((item) => item.type === 'coating');
		}
		setColorsList(filtered);
	};

	useEffect(() => {
		console.log('coatingState:', colorState);
		filterData(colorsList, colorState);
	}, [colorState]);

	useEffect(() => {
		fetchData();
	}, [colorState]);

	const handleClickDelete = (id: any) => {
		setDeleteModal(true);
		setDeleteId(id);
	};

	const handleDeleteColor = async (id: any) => {
		console.log('Id', id);
		try {
			const { data: colors } = await deleted(`/colors/${id}`);
			console.log('colors', colors);
			toast.success('Color deleted Successfully');
		} catch (error: any) {
			console.error('Error deleted Color:', error);
			setIsLoading(false);
			toast.error('Error deleting Color', error);
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
		columnHelper.accessor('code', {
			cell: (info) => <div className=''>{`${info.getValue()}`}</div>,
			header: 'Code',
		}),

		columnHelper.display({
			cell: (info) => (
				<div className='font-bold flex justify-center'>
					<PermissionGuard permissionType='write'>
						<Button
							onClick={() => {
								navigate(`${PathRoutes.edit_colors}/${info.row.original._id}`);
							}}
							icon='HeroPencil'
							className='px-2.5'

						/>
					</PermissionGuard>
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
			size: 80,
		}),
	];

	const table = useReactTable({
		data: colorsList,
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
			{/* <Subheader>
				<SubheaderLeft>
					<div className='ml-4 flex items-center justify-center'>
						<h4>Coating</h4>{' '}
						<Switch
							{...Label}
							checked={colorState}
							onClick={handleToggleCoatingState}
						/>
						<h4>Anodize</h4>
					</div>
					<SubheaderSeparator />
				</SubheaderLeft>
			</Subheader> */}
			<Container>
				<Card className='h-full'>
					<CardHeader>
						<CardHeaderChild>
							<CardTitle>All Colors</CardTitle>
							<Badge
								variant='outline'
								className='border-transparent px-4 '
								rounded='rounded-full'>
								{table.getFilteredRowModel().rows.length} items
							</Badge>
						</CardHeaderChild>
						<PermissionGuard permissionType='write'>
							<CardHeaderChild>
								<Link to={`${PathRoutes.add_colors}`}>
									<Button variant='solid' icon='HeroPlus'>
										New Color
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
					Edit Color
				</ModalHeader>
				<ModalBody>
					<EditColorModal
						colorId={colorId}
						fetchData={fetchData}
						setIsEditModal={setIsEditModal}
					/>
				</ModalBody>
			</Modal>
			{deleteModal ? (
				<DeleteConformationModal
					isOpen={deleteModal}
					setIsOpen={setDeleteModal}
					handleConform={() => handleDeleteColor(deleteId)}
				/>
			) : null}
		</PageWrapper>
	);
};

export default ColorsListPage;