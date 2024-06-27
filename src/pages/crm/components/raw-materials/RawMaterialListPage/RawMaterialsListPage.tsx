import { useEffect, useState } from 'react';

import {
	CellContext,
	SortingState,
	createColumnHelper,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable,
} from '@tanstack/react-table';
import { Link } from 'react-router-dom';
import { collection, deleteDoc, doc, getDocs, orderBy, query, where } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { ERPVendor } from '../../../../../mocks/db/users.db';
import { appPages } from '../../../../../config/pages.config';
import Button from '../../../../../components/ui/Button';
import getUserRights from '../../../../../hooks/useUserRights';
import PageWrapper from '../../../../../components/layouts/PageWrapper/PageWrapper';
import Subheader, { SubheaderLeft } from '../../../../../components/layouts/Subheader/Subheader';
import FieldWrap from '../../../../../components/form/FieldWrap';
import Input from '../../../../../components/form/Input';
import Container from '../../../../../components/layouts/Container/Container';
import Card, {
	CardBody,
	CardHeader,
	CardHeaderChild,
	CardTitle,
} from '../../../../../components/ui/Card';
import Badge from '../../../../../components/ui/Badge';
import TableTemplate, {
	TableCardFooterTemplate,
} from '../../../../../templates/common/TableParts.template';
import LoaderDotsCommon from '../../../../../components/LoaderDots.common';
import Modal, {
	ModalFooter,
	ModalFooterChild,
	ModalHeader,
} from '../../../../../components/ui/Modal';
import Icon from '../../../../../components/icon/Icon';
import DeleteConformationModal from '../../../../../components/PageComponets/DeleteConformationModal/DeleteConformationModal';

const columnHelper = createColumnHelper<any>();
const listLinkPath = `../${appPages.crmAppPages.subPages.componentsPage.subPages.rawMaterialsPage.editPageLink.to}/`;
const RawMaterialsListPage = () => {
	const [rawMaterialData, setRawMaterialData] = useState<any>([]);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [globalFilter, setGlobalFilter] = useState<string>('');
	const [sorting, setSorting] = useState<SortingState>([]);
	const [deleteModal, setDeleteModal] = useState<boolean>(false);
	const [rawMaterialId, setRawMaterialId] = useState<string>('');
	const firebaseMainKey = 'components'; // replace with vendors when data is available

	useEffect(() => {
		getComponents();
	}, []);

	const columns: any[] = [
		columnHelper.accessor('componentID', {
			cell: (info) => (
				<Link to={`${listLinkPath}${info.row.original.id}`}>
					<div className='font-bold'>{info.row.original.componentID}</div>
				</Link>
			),
			header: 'Component ID',
			enableResizing: true, //disable resizing for just this column
		}),
		columnHelper.accessor('description1', {
			cell: (info: any) => (
				<Link to={`${listLinkPath}${info.row.original.id}`}>
					<div className=''>
						{info.row.original.description1 || info.row.original.description1}
					</div>
				</Link>
			),
			header: 'Description',
			enableResizing: false,
		}),
		columnHelper.accessor('availableStock', {
			cell: (info: any) => (
				<Link to={`${listLinkPath}${info.row.original.id}`}>
					<div className=''>
						{info.row.original.availableStock || info.row.original.availableStock}
					</div>
				</Link>
			),
			header: 'Stock',
		}),
		columnHelper.accessor('componentStandardPricing', {
			cell: (info) => (
				<Link to={`${listLinkPath}${info.row.original.id}`}>
					<div className=''>$ {info.row.original.componentStandardPricing ?? 0}</div>
				</Link>
			),
			header: 'CSP',
		}),
		columnHelper.accessor('sterileNonSterile', {
			cell: (info) => (
				<Link to={`${listLinkPath}${info.row.original.id}`}>
					<div className=''>{info.row.original.sterileNonSterile}</div>
				</Link>
			),
			header: 'Sterile/Non Sterlie',
		}),

		columnHelper.display({
			cell: (info) => (
				<div className='font-bold'>
					{privileges.canWrite() ? (
						<Link to={`${listLinkPath}${info.row.original.id}`}>
							<Button onClick={() => handleEdit(info)}>
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
							</Button>{' '}
						</Link>
					) : null}
					{privileges.canDelete() ? (
						<Button onClick={() => handleClickDelete(info)}>
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
					) : null}
				</div>
			),
			header: 'Actions',
		}),
	];

	const table = useReactTable({
		data: rawMaterialData,
		columns,
		state: {
			sorting,
			globalFilter,
		},
		onSortingChange: setSorting,
		enableGlobalFilter: true,
		onGlobalFilterChange: setGlobalFilter,
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
	});

	const getComponents = async () => {
		setIsLoading(true);
		try {
			// TODO: toggle for vendor collection document
			// const vendorRef = await getDocs(collection(firestore, firebaseMainKey));

			// Define the collection reference

			// const RawMaterialDocRef = await getDocs(
			// 	query(
			// 		componentCollectionRef,
			// 		where('componentType', '==', 'RAW MATERIAL PURCHASE'),
			// 	),
			// );

			const allRawMaterialData = [];

			// for (const rawMaterialData of RawMaterialDocRef.docs) {
			// 	const rawMaterialsWithData = {
			// 		...rawMaterialData.data(),
			// 		id: rawMaterialData.id,
			// 	};
			// 	allRawMaterialData.push(rawMaterialsWithData);
			// }

			// setRawMaterialData(allRawMaterialData);

			// if (allRawMaterialData) setIsLoading(false);
		} catch (error) {
			console.error('Error fetching Raw Material: ', error);
			setIsLoading(false);
		}
	};

	const handleClickDelete = (info: CellContext<ERPVendor, unknown>) => {
		setDeleteModal(true);
		console.log('delete', info);
		setRawMaterialId(info.row.original.id ?? '');
	};

	const handleEdit = (info: any) => {
		console.log('info', info);
	};

	const privileges = getUserRights('components');

	return privileges.canRead() ? (
		<PageWrapper name='Raw Material List'>
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
							<CardTitle>Raw Materials</CardTitle>
							<Badge
								variant='outline'
								className='border-transparent'
								rounded='rounded-full'>
								{table.getFilteredRowModel().rows.length} items
							</Badge>
						</CardHeaderChild>
						<CardHeaderChild>
							{privileges.canWrite() ? (
								<Link to={`${listLinkPath}new`}>
									<Button variant='solid' icon='HeroPlus'>
										New Raw Material
									</Button>
								</Link>
							) : null}
						</CardHeaderChild>
					</CardHeader>
					<CardBody className='overflow-auto'>
						{!isLoading && (
							<TableTemplate
								className='table-fixed max-md:min-w-[70rem]'
								table={table}
							/>
						)}
						<div className='flex justify-center'>
							{isLoading && <LoaderDotsCommon />}
						</div>
					</CardBody>
					<TableCardFooterTemplate table={table} />
				</Card>
			</Container>
			{deleteModal ? (
				<DeleteConformationModal
					isOpen={deleteModal}
					setIsOpen={setDeleteModal}
					handleConform={()=>{}}
				/>
			) : null}
		</PageWrapper>
	) : (
		<div className='flex h-screen items-center justify-center font-bold'>
			You Dont Have Permission to View the record
		</div>
	);
};

export default RawMaterialsListPage;
