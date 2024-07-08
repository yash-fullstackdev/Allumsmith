import { useCallback, useEffect, useState } from 'react';
import {
	createColumnHelper,
	getCoreRowModel,
	getFilteredRowModel,
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
import Modal, { ModalFooter, ModalFooterChild, ModalHeader } from '../../../../components/ui/Modal';
import { toast } from 'react-toastify';
import Subheader, { SubheaderLeft } from '../../../../components/layouts/Subheader/Subheader';
import FieldWrap from '../../../../components/form/FieldWrap';
import Icon from '../../../../components/icon/Icon';
import Input from '../../../../components/form/Input';
import _, { debounce } from 'lodash';
import OffCanvas, { OffCanvasBody, OffCanvasHeader } from '../../../../components/ui/OffCanvas';
import RoleDetailCanvas from '../RolesListPage/RoleDetailsCanvas';

const columnHelper = createColumnHelper<any>();

const UserListPage = () => {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [sorting, setSorting] = useState<SortingState>([]);
	const [apiData, setApiData] = useState<any[]>([]);
	const [tableCount, setTableCount] = useState<number>(0);
	const [pageSize, setPageSize] = useState(10);
	const [globalFilter, setGlobalFilter] = useState<string>('');
	const [deleteModal, setDeleteModal] = useState<boolean>(false);
	const [deleteId, setDeleteId] = useState<string>('');
	const [roleModal, setRoleModal] = useState<boolean>(false);
	const [roleId, setRoleId] = useState();
	const [roleInfo, setRoleInfo] = useState<any>();

	const router = useNavigate();

	const handleClickDelete = (id: any) => {
		setDeleteModal(true);
		setDeleteId(id);
	};

	const fetchData = async (
		pageSize: number | null = null,
		page: number | null = null,
		search = '',
	) => {
		setIsLoading(true);
		try {
			const pageSizeValue = pageSize || 10;
			const pageValue = page || 1;
			const { data } = await get(
				`/users?page=${pageValue}&limit=${pageSizeValue}
                ${
					!!(globalFilter.trim() || search.trim())
						? `&searchTerm=${search.trim() || globalFilter.trim()}`
						: ''
				} `,
			);
			setApiData(data?.data);
			setTableCount(data?.count);
			setIsLoading(false);
			table.setPageIndex(pageValue - 1);
		} catch (error: any) {
			setIsLoading(false);
		} finally {
			setIsLoading(false);
		}
	};

	const handleProductDelete = async (id: any) => {
		try {
			await deleted(`/users/${id}`);
			toast.success('User deleted Successfully !');
		} catch (error: any) {
			console.error('Error deleting User:', error.message);
			toast.error('Failed to delete userError deleting user');
			setIsLoading(false);
		} finally {
			setIsLoading(false);
			fetchData();
			setDeleteModal(false);
		}
	};

	useEffect(() => {
		fetchData();
	}, []);

	const debouncedFetchData = useCallback(
		debounce((query: string) => {
			fetchData(table?.getState().pagination.pageSize, 1, query);
		}, 1000),
		[],
	);

	useEffect(() => {
		if (globalFilter) {
			debouncedFetchData(globalFilter);
		} else {
			fetchData(table?.getState().pagination.pageSize, 1);
		}

		return () => {
			debouncedFetchData.cancel();
		};
	}, [globalFilter]);

	const columns = [
		columnHelper.accessor('username', {
			cell: (info) => <div className=''>{`${info.getValue()}`}</div>,
			header: 'User Name',
			size: 160,
		}),
		columnHelper.accessor('email', {
			cell: (info) => <div className=''>{`${info.getValue()}`}</div>,
			header: 'Email',
			size: 300,
		}),
		columnHelper.accessor('firstName', {
			cell: (info) => <div className=''>{`${info.getValue()}`}</div>,
			header: 'First Name',
		}),
		columnHelper.accessor('lastName', {
			cell: (info) => <div className=''>{`${info.getValue()}`}</div>,
			header: 'Last Name',
		}),

		columnHelper.accessor('role_id', {
			cell: (info) => <div className=''>{`${info.getValue()?.name}`}</div>,
			header: 'User Role',
			size: 150,
		}),

		columnHelper.display({
			cell: (info) => (
				<div className='flex justify-center font-bold'>
					<Button
						icon='HeroPencil'
						className='px-2.5'
						onClick={() => {
							const queryParams = new URLSearchParams();
							queryParams.set('id', info.row.original['_id']);
							router(`${PathRoutes.add_users}?${queryParams}`);
						}}
					/>
					<Button
						icon='HeroEye'
						className='px-2.5'
						onClick={() => {
							setRoleModal(true),
								setRoleId(info?.row?.original?._id),
								setRoleInfo(info?.row?.original?.role_id);
						}}
					/>
					<Button
						icon='HeroDelete'
						className='px-2.5'
						onClick={() => {
							handleClickDelete(info.row.original._id);
						}}
					/>
				</div>
			),
			header: 'Actions',
			size: 120,
		}),
	];

	const table = useReactTable({
		data: apiData,
		columns,
		state: {
			sorting,
		},
		pageCount: Number(Math.ceil(tableCount ? tableCount / pageSize : tableCount / 10)),
		autoResetPageIndex: false,
		onSortingChange: setSorting,
		enableGlobalFilter: true,
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getSortedRowModel: getSortedRowModel(),
		manualPagination: true,
	});

	const handleChangePageSize = (pageSize: number) => {
		fetchData(pageSize, 1);
		setPageSize(pageSize);
	};
	const handleDebouncedFetchData = useCallback(
		debounce((pageSize, page, query: string) => {
			fetchData(pageSize, page, query);
		}, 700),
		[],
	);

	const handleChangePage = (page: number, isDebounce: boolean = false) => {
		isDebounce
			? handleDebouncedFetchData(pageSize, page, globalFilter)
			: fetchData(table?.getState().pagination.pageSize, page);
	};

	return (
		<PageWrapper name='Users List'>
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
									onClick={() => setGlobalFilter('')}
								/>
							)
						}>
						<Input
							className='pl-8 pr-8'
							id='searchBar'
							name='searchBar'
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
							<CardTitle>All Users</CardTitle>
							<Badge
								variant='outline'
								className='border-transparent px-4'
								rounded='rounded-full'>
								{tableCount} items
							</Badge>
						</CardHeaderChild>

						<CardHeaderChild>
							<Link to={`${PathRoutes.roles}`}>
								<Button variant='solid' icon='HeroClipboardDocumentList'>
									Manage Roles
								</Button>
							</Link>

							<Link to={`${PathRoutes.add_users}`}>
								<Button variant='solid' icon='HeroPlus'>
									New User
								</Button>
							</Link>
						</CardHeaderChild>
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
						<TableCardFooterTemplate
							table={table}
							onChangesPageSize={handleChangePageSize}
							onChangePage={handleChangePage}
							count={tableCount}
							pageSize={pageSize}
						/>
					)}
				</Card>
			</Container>
			<Modal isOpen={deleteModal} setIsOpen={setDeleteModal}>
				<ModalHeader>Are you sure?</ModalHeader>
				<ModalFooter>
					<ModalFooterChild>
						Do you really want to delete these records? This cannot be undone.
					</ModalFooterChild>
					<ModalFooterChild>
						<Button
							onClick={() => setDeleteModal(false)}
							color='blue'
							variant='outlined'>
							Cancel
						</Button>
						<Button
							variant='solid'
							onClick={() => {
								handleProductDelete(deleteId);
							}}>
							Delete
						</Button>
					</ModalFooterChild>
				</ModalFooter>
			</Modal>
			<OffCanvas isOpen={roleModal} setIsOpen={setRoleModal}>
				<OffCanvasHeader>Role Detail</OffCanvasHeader>
				<OffCanvasBody>
					<RoleDetailCanvas RoleDetails={roleInfo} />
				</OffCanvasBody>
			</OffCanvas>
		</PageWrapper>
	);
};

export default UserListPage;
