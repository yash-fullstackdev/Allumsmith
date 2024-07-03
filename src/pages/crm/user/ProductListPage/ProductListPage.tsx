import { useCallback, useEffect, useState } from 'react';
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
import EditProductPage from '../ProductPage/EditProductModal';
import { toast } from 'react-toastify';
import Subheader, { SubheaderLeft } from '../../../../components/layouts/Subheader/Subheader';
import FieldWrap from '../../../../components/form/FieldWrap';
import Icon from '../../../../components/icon/Icon';
import Input from '../../../../components/form/Input';
import OffCanvas, {
	OffCanvasBody,
	OffCanvasFooter,
	OffCanvasHeader,
} from '../../../../components/ui/OffCanvas';
import ProductDetailCanvas from './ProductDetailCanvas';
import _, { debounce } from 'lodash';
import PermissionGuard from '../../../../components/buttons/CheckPermission';
import DeleteConformationModal from '../../../../components/PageComponets/DeleteConformationModal/DeleteConformationModal';


const columnHelper = createColumnHelper<any>();

const ProductListPage = () => {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [sorting, setSorting] = useState<SortingState>([]);
	const [apiData, setApiData] = useState<any[]>([]);
	const [tableCount, setTableCount] = useState<number>(0);
	const [pageSize, setPageSize] = useState(10);
	const [editModal, setEditModal] = useState<boolean>(false);
	const [editProductId, setEditProductId] = useState<any>('');
	const [globalFilter, setGlobalFilter] = useState<string>('');
	const [deleteModal, setDeleteModal] = useState<boolean>(false);
	const [deleteId, setDeleteId] = useState<string>('');
	const [productDetailModal, setProductDetailModal] = useState<boolean>(false);
	const [productDetails, setProductDetails] = useState<any>('');

	const navigate = useNavigate();

	const handleClickDelete = (id: any) => {
		setDeleteModal(true);
		setDeleteId(id);
	};

	const handleProductDelete = async (id: any) => {
		console.log('id', id);
		try {
			const { data: products } = await deleted(`/products/${id}`);
			console.log('products', products);
			toast.success('Product deleted Successfully !');
		} catch (error: any) {
			console.error('Error deleting product:', error.message);
			toast.error('Error deleting Product', error);
			setIsLoading(false);
		} finally {
			setIsLoading(false);
			fetchData();
			setDeleteModal(false);
		}
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
			const { data: allUsers } = await get(
				`/products?page=${pageValue}&limit=${pageSizeValue}${!!(globalFilter || search) ? `&name=${search || globalFilter}` : ''
				} `,
			);
			allUsers?.data.sort(
				(a: any, b: any) =>
					new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
			);
			setApiData(allUsers?.data);
			setTableCount(allUsers?.count);
			setIsLoading(false);
			table.setPageIndex(pageValue - 1);
		} catch (error: any) {
			setIsLoading(false);
		} finally {
			setIsLoading(false);
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
		columnHelper.accessor('name', {
			cell: (info) => <div className=''>{`${info.getValue()}`}</div>,
			header: 'Name',
		}),
		columnHelper.accessor('hsn', {
			cell: (info) => <div className=''>{`${info.getValue()}`}</div>,
			header: 'HSN',
		}),
		columnHelper.accessor('productCode', {
			cell: (info) => <div className=''>{`${info.getValue()}`}</div>,
			header: 'Product Code',
		}),
		columnHelper.accessor('length', {
			cell: (info) => <div className=''>{`${info.getValue()}`}</div>,
			header: 'Length',
		}),
		columnHelper.accessor('thickness', {
			cell: (info) => <div className=''>{`${info.getValue()}`}</div>,
			header: 'Thickness',
		}),
		columnHelper.accessor('weight', {
			cell: (info) => <div className=''>{`${info.getValue()}`}</div>,
			header: 'Weight',
		}),

		columnHelper.display({
			cell: (info) => (
				<div className='flex font-bold justify-center'>
					<PermissionGuard permissionType='write'>
						<Button
							onClick={() => {
								navigate(`${PathRoutes.edit_product}/${info.row.original._id}`);
							}}
							icon='HeroPencil'
							className='px-2.5'
						/>
					</PermissionGuard>
					<Button
						icon='HeroInformationCircle'
						onClick={() => {
							setProductDetails(info.row.original);
							setProductDetailModal(true);
						}}
						className='px-2.5'
					/>
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
			size: 120,
		}),
	];

	const table = useReactTable({
		data: apiData,
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
		<PageWrapper name='Product List'>
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
							className='pl-8'
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
							<CardTitle>All Products</CardTitle>
							<Badge
								variant='outline'
								className='border-transparent px-4'
								rounded='rounded-full'>
								{tableCount} items
							</Badge>
						</CardHeaderChild>

						<CardHeaderChild>
							<PermissionGuard permissionType='write'>
								<Link to={`${PathRoutes.multiple_edit_product}`}>
									<Button variant='solid' icon='DuoPen'>
										Bulk Product Update
									</Button>
								</Link>
							</PermissionGuard>
							<PermissionGuard permissionType="write">
								<Link to={`${PathRoutes.add_product}`}>
									<Button variant='solid' icon='HeroPlus'>
										New Product
									</Button>
								</Link>
							</PermissionGuard>
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
			<Modal isOpen={editModal} setIsOpen={setEditModal} isScrollable fullScreen='2xl'>
				<ModalHeader
					className='m-5 flex items-center justify-between rounded-none border-b text-lg font-bold'
					// onClick={() => formik.resetForm()}
				>
					Edit Product
				</ModalHeader>
				<ModalBody>
					<EditProductPage
						editProductId={editProductId}
						setEditModal={setEditModal}
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
			<OffCanvas isOpen={productDetailModal} setIsOpen={setProductDetailModal}>
				<OffCanvasHeader>Product Detail</OffCanvasHeader>
				<OffCanvasBody>
					<ProductDetailCanvas productDetails={productDetails} />
				</OffCanvasBody>
			</OffCanvas>
		</PageWrapper>
	);
};

export default ProductListPage;
