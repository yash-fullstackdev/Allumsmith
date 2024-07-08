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
import { Link, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { appPages } from '../../../../../config/pages.config';
import getUserRights from '../../../../../hooks/useUserRights';
import TableTemplate, {
	TableCardFooterTemplate,
} from '../../../../../templates/common/TableParts.template';
import LoaderDotsCommon from '../../../../../components/LoaderDots.common';
import VendorModal from './VendorModal';
import DeleteConformationModal from '../../../../../components/PageComponets/DeleteConformationModal/DeleteConformationModal';
import { PageWrapper } from '../../../../../components/layouts';
import { Badge, Button, Card, CardBody, CardHeader, CardHeaderChild, CardTitle, Modal, ModalBody, ModalHeader } from '../../../../../components/ui';

const columnHelper = createColumnHelper<any>();
const listLinkPath = `../${appPages.crmAppPages.subPages.componentsPage.subPages.rawMaterialsPage.editPageLink.to}/`;
const VendorTable = ({
	formik,
	scModal,
	setScModal,
	vendorData,
	vendorDetails,
	setVendorData,
	handleEditClick,
	onSave,
}: any) => {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [globalFilter, setGlobalFilter] = useState<string>('');
	const [sorting, setSorting] = useState<SortingState>([]);
	const [helperId, setHelperId] = useState<string>('');

	const { id } = useParams();

	const [exModal, setExModal] = useState<boolean>(false);

	const handleClickDelete = (info: any) => {
		setExModal(true);
		setHelperId(info?.row?.original?.vendornum);
	};
	const columns: any[] = [
		columnHelper.accessor('vendornum', {
			cell: (info: any) => <div className='font-bold'>{info.row.original.vendornum}</div>,
			header: 'Vendor Number',
		}),
		columnHelper.accessor('vendorName', {
			cell: (info: any) => (
				<div className=''>
					{info.row.original.vendorName?.split('-')[1] ||
						info.row.original.vendorName?.split('-')[1]}
				</div>
			),
			header: 'Name',
		}),
		columnHelper.accessor('cost', {
			cell: (info: any) => <div className=''>$ {info.row.original.standardPricing}</div>,
			header: 'Cost',
		}),
		columnHelper.accessor('startDate', {
			cell: (info: any) => <div className=''>{info.row.original.startDate}</div>,
			header: 'Start Date',
		}),
		columnHelper.accessor('endDate', {
			cell: (info: any) => <div className=''>{info.row.original.endDate}</div>,
			header: 'End Date',
		}),

		columnHelper.display({
			cell: (info) => (
				<div className='font-bold'>
					{privileges.canWrite() ? (
						// <Link to={`${editLinkPath}${info.row.original.id}`}>
						<Button onClick={() => handleEditClick(info)}>
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
					) : // </Link>
					null}
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
		data: vendorData,
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
	// const getVendors = async () => {
	// 	setIsLoading(true);
	// 	try {
	// 		// TODO: toggle for vendor collection document
	// 		const vendorRef = await getDocs(collection(firestore, firebaseMainKey));
	// 		const allVendors = [];

	// 		for (const vendor of vendorRef.docs) {
	// 			const vendorsWithData = {
	// 				...vendor.data(),
	// 				id: vendor.id,
	// 			};
	// 			allVendors.push(vendorsWithData);
	// 		}

	// 		setVendors(allVendors);

	// 		if (allVendors) setIsLoading(false);
	// 	} catch (error) {
	// 		console.error('Error fetching vendors: ', error);
	// 		setIsLoading(false);
	// 	}
	// };

	const privileges = getUserRights('components');

	const handleDeleteVendor = async (info: any) => {
		const updatedArray = vendorData.filter((item: any) => item.vendornum !== info);
		toast.success('Vendor Data deleted successfully!');
		setExModal(false);

		setVendorData(updatedArray);
	};
	return privileges.canRead() ? (
		<PageWrapper name='Raw Material List'>
			<Card className='h-full'>
				<CardHeader>
					<CardHeaderChild>
						<CardTitle>Component Vendors</CardTitle>
						<Badge
							variant='outline'
							className='border-transparent px-4'
							rounded='rounded-full'>
							{table.getFilteredRowModel().rows.length} items
						</Badge>
					</CardHeaderChild>
					<CardHeaderChild>
						<Link to={id === 'new' ? `${listLinkPath}new` : `${listLinkPath}${id}`}>
							<Button
								variant='solid'
								icon='HeroPlus'
								onClick={() => setScModal(true)}
								isDisable={!privileges.canWrite()}>
								Add Vendor
							</Button>
						</Link>
					</CardHeaderChild>
				</CardHeader>
				<CardBody className='overflow-auto'>
					{!isLoading && (
						<TableTemplate className='table-fixed max-md:min-w-[70rem]' table={table} />
					)}
					<div className='flex justify-center'>{isLoading && <LoaderDotsCommon />}</div>
				</CardBody>
				<TableCardFooterTemplate table={table} />
			</Card>

			<Modal isOpen={scModal} setIsOpen={setScModal} isScrollable fullScreen>
				<ModalHeader
					className='m-5 flex items-center justify-between rounded-none border-b text-lg font-bold'
					onClick={() => formik.resetForm()}>
					Add Vendor
				</ModalHeader>
				<ModalBody>
					<VendorModal
						onSave={onSave}
						formik={formik}
						vendor={vendorDetails}
						vendorData={vendorData}
						setVendorData={setVendorData}
						setScModal={setScModal}
					/>
				</ModalBody>
			</Modal>
			{exModal ? (
				<DeleteConformationModal
					isOpen={exModal}
					setIsOpen={setExModal}
					handleConform={() => handleDeleteVendor(helperId)}
				/>
			) : null}
		</PageWrapper>
	) : (
		<div className='flex h-screen items-center justify-center font-bold'>
			You Dont Have Permission to View the record
		</div>
	);
};

export default VendorTable;
