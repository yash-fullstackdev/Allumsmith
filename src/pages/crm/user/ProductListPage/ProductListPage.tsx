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
import Modal, { ModalBody, ModalHeader } from '../../../../components/ui/Modal';
import EditProductPage from '../ProductPage/EditProductModal';
import { toast } from 'react-toastify';

const columnHelper = createColumnHelper<any>();


const ProductListPage = () => {



	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [sorting, setSorting] = useState<SortingState>([]);
	const [apiData, setApiData] = useState<any[]>([]);
	const [editModal, setEditModal] = useState<boolean>(false);
	const [editProductId, setEditProductId] = useState<any>('')
	const navigate = useNavigate();

	const fetchData = async () => {
		setIsLoading(true);
		try {
			const { data: allUsers } = await get(`/products`);
			allUsers.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
			setApiData(allUsers);
	
			setApiData(allUsers);
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
	}, [])


	const handleClickDelete = async (id: any) => {
		console.log("id", id)
		try {
			const { data: products } = await deleted(`/products/${id}`);
			console.log("products", products);
			toast.success('Product deleted Successfully !');
		} catch (error: any) {
			console.error('Error deleting product:', error.message);
			toast.error('Error deleting Product', error);
			setIsLoading(false);
		} finally {
			setIsLoading(false);
			fetchData();
		}
	}



	const columns = [
		columnHelper.accessor('name', {
			cell: (info) => (

				<div className=''>{`${info.getValue()}`}</div>

			),
			header: 'Name',

		}),
		columnHelper.accessor('hsn', {
			cell: (info) => (

				<div className=''>
					{`${info.getValue()}`}
				</div>

			),
			header: 'HSN',
		}),
		columnHelper.accessor('productCode', {
			cell: (info) => (

				<div className=''>
					{`${info.getValue()}`}
				</div>

			),
			header: 'Product Code',
		}),
		columnHelper.accessor('length', {
			cell: (info) => (

				<div className=''>
					{`${info.getValue()}`}
				</div>
			),
			header: 'Length',

		}),
		columnHelper.accessor('thickness', {
			cell: (info) => (

				<div className=''>{`${info.getValue()}`}</div>
			),
			header: 'Thickness',
		}),
		columnHelper.accessor('weight', {
			cell: (info) => (

				<div className=''>{`${info.getValue()}`}</div>
			),
			header: 'Weight',
		}),
		columnHelper.display({
			cell: (info) => (
				<div className='font-bold flex'>
					<Button onClick={() => {
						navigate(`${PathRoutes.edit_product}/${info.row.original._id}`)
					}
					}>
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
			size: 80,
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
	});



	return (
		<PageWrapper name='Product List'>
			<Container>
				<Card className='h-full'>
					<CardHeader>
						<CardHeaderChild>
							<CardTitle>All Products</CardTitle>
							<Badge
								variant='outline'
								className='border-transparent px-4'
								rounded='rounded-full'>
								{table.getFilteredRowModel().rows.length} items
							</Badge>
						</CardHeaderChild>

						<CardHeaderChild>
							<Link to={`${PathRoutes.add_product}`}>
								<Button variant='solid' icon='HeroPlus'>
									New Product
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
							!isLoading && <p className="text-center text-gray-500">No records found</p>
						)}
						<div className='flex justify-center'>
							{isLoading && <LoaderDotsCommon />}
						</div>
					</CardBody>
					{ table.getFilteredRowModel().rows.length > 0 && 
							<TableCardFooterTemplate table={table} />
					}
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
					<EditProductPage editProductId={editProductId} setEditModal={setEditModal} fetchData={fetchData} />
				</ModalBody>
			</Modal>
		</PageWrapper>
	)

};

export default ProductListPage;