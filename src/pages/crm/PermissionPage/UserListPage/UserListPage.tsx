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
	}, [globalFilter]);

	const columns = [
		columnHelper.accessor('username', {
			cell: (info) => <div className=''>{`${info.getValue()}`}</div>,
			header: 'User Name',
			size: 200,
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
		}),
		
		columnHelper.display({
			cell: (info) => (
				<div className='flex justify-center font-bold'>
					<Button
					size='xs'
						onClick={() => {
							const queryParams = new URLSearchParams();
							queryParams.set('id', info.row.original['_id']);
							router(`${PathRoutes.add_users}?${queryParams}`);
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
					<Button
					size='xs'
						onClick={() => {
							setRoleModal(true),
								setRoleId(info?.row?.original?._id),
								setRoleInfo(info?.row?.original?.role_id);
						}}>
						<svg
							xmlns='http://www.w3.org/2000/svg'
							fill='none'
							viewBox='0 0 24 24'
							stroke-width='1.5'
							stroke='currentColor'
							className='h-6 w-6'>
							<path
								stroke-linecap='round'
								stroke-linejoin='round'
								d='M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z'
							/>
							<path
								stroke-linecap='round'
								stroke-linejoin='round'
								d='M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z'
							/>
						</svg>
					</Button>
					<Button
					size='xs'
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
