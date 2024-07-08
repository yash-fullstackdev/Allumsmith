import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PathRoutes } from '../../../../utils/routes/enum';
import { useFormik } from 'formik';
import Icon from '../../../../components/icon/Icon';
import { debounce } from 'lodash';
import {
	SortingState,
	createColumnHelper,
	getCoreRowModel,
	getFilteredRowModel,
	getSortedRowModel,
	useReactTable,
} from '@tanstack/react-table';
import { get, put } from '../../../../utils/api-helper.util';
import LoaderDotsCommon from '../../../../components/LoaderDots.common';
import TableTemplate, {
	TableCardFooterTemplate,
} from '../../../../templates/common/TableParts.template';
import { toast } from 'react-toastify';
import { Checkbox } from '@mui/material';
import { Container, PageWrapper, Subheader, SubheaderLeft, SubheaderRight, SubheaderSeparator } from '../../../../components/layouts';
import { Badge, Button, Card, CardBody, CardHeader, CardHeaderChild, CardTitle } from '../../../../components/ui';
import { FieldWrap, Input, Label } from '../../../../components/form';

const EditBulkProductPage = () => {
	const navigate = useNavigate();
	const columnHelper = createColumnHelper<any>();
	const [globalFilter, setGlobalFilter] = useState<string>('');
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [sorting, setSorting] = useState<SortingState>([]);
	const [mainData, setMainData] = useState<any[]>([]);
	const [apiData, setApiData] = useState<any[]>([]);
	const [tableCount, setTableCount] = useState<number>(0);
	const [pageSize, setPageSize] = useState(10);
	const [currentPage, setCurrentPage] = useState(0);
	const [isUpdateLoding, setUpdateLoading] = useState(false);

	const formik: any = useFormik({
		initialValues: {
			entries: [
				{
					premium_rate: '',
					wooden_rate: '',
					commercial_rate: '',
					anodize_rate: '',
				},
			],
		},
		onSubmit: async () => {
			handelUpdate();
		},
	});

	const handelUpdate = async () => {
		try {
			setUpdateLoading(true);
			// Filter mainData to get only the items with isRemoved true
			const removedItems = mainData.filter((item) => item.isRemoved === false);
			// Extract the IDs of the removed items
			const updateDataIdList = removedItems.map((item) => item._id);

			if (updateDataIdList.length === 0) {
				toast.error('Please Select Products To Update.');
				return;
			}

			// Create an object to store the converted values
			const convertedValues: any = {};
			for (const key in formik.values.entries[0]) {
				const value = formik.values.entries[0][key];
				if (value !== '') {
					convertedValues[key] = Number(value);
				}
			}

			
			if (Object.keys(convertedValues).length === 0) {
				toast.error('Please Input Rate To Update!');
				return;
			  }

		

			const dataToUpdate = {
				products: updateDataIdList,
				...convertedValues,
			};

			// Perform the API call to update the products
			await put('/products/bulk-update', dataToUpdate);
			console.log(dataToUpdate, 'Updated data');
			navigate('/product');
			toast.success('Product Updated Successfully!');
		} catch (error: any) {
			console.error('Error Updating Products', error);
			toast.error(error.response.data.message);
		} finally {
			setUpdateLoading(false);
		}
	};

	const checkNagative = (e: any) => {
		return e.target.value === '-0' || e.target.value < 0;
	};

	const fetchData = async (search: string | null = null) => {
		setIsLoading(true);
		try {
			const { data: allProducts } = await get(
				`/products?${!!search ? `name=${search}` : ''}`,
			);
			// Add a flag indicating whether data is removed or not
			allProducts?.data.forEach((product: any) => {
				product.isRemoved = false;
			});
			allProducts?.data.sort(
				(a: any, b: any) =>
					new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
			);
			setMainData(allProducts?.data);
			setApiData(allProducts?.data.slice(0, pageSize));
			setTableCount(allProducts?.count);
			setIsLoading(false);
		} catch (error: any) {
			setIsLoading(false);
		}
	};

	const debouncedFetchData = useCallback(
		debounce((query: string) => {
			fetchData(query);
		}, 500),
		[],
	);

	const handleChangePageSize = (pageSizeValue: number) => {
		setPageSize(pageSizeValue);
		handleChangePage(currentPage, pageSizeValue);
	};

	const handleChangePage = (page: number, pageSizeValue?: number) => {
		let startIndex = 0;
		setCurrentPage(page);
		if (pageSizeValue === undefined) {
			pageSizeValue = pageSize;
		}
		if (page !== 0) {
			startIndex = (page - 1) * pageSizeValue;
		} else {
			startIndex = page * pageSizeValue;
		}
		const endIndex = startIndex + pageSizeValue;
		setApiData(mainData.slice(startIndex, endIndex));
	};

	const handleToggleRemove = (id: any, isRemoved: boolean) => {
		// Update isRemoved flag in mainData
		const updatedMainData = mainData.map((item) => {
			if (item._id === id) {
				return { ...item, isRemoved };
			}
			return item;
		});
		setMainData(updatedMainData);

		// Update isRemoved flag in apiData
		const updatedApiData = apiData.map((item) => {
			if (item._id === id) {
				return { ...item, isRemoved };
			}
			return item;
		});
		setApiData(updatedApiData);
	};

	const clearData = () => {
		// Reset pagination values
		setPageSize(10);
		setCurrentPage(0);
		setTableCount(0);
		setApiData([]);
		setMainData([]);
		table.resetPagination();
	};

	useEffect(() => {
		if (globalFilter !== '') {
			debouncedFetchData(globalFilter);
		} else {
			clearData();
		}

		return () => {
			debouncedFetchData.cancel();
		};
	}, [globalFilter]);

	useEffect(() => {
		if (globalFilter === '') {
			clearData();
		}
	}, [isLoading]);

	const columns = [
		columnHelper.display({
			cell: (info) => (
				<div className='flex justify-start font-bold'>
					<div className='ml-10 flex w-full'>
						<Checkbox
							id={info.row.original._id}
							size='medium'
							checked={!info.row.original.isRemoved}
							onClick={() => {
								handleToggleRemove(
									info.row.original._id,
									!info.row.original.isRemoved,
								);
							}}
						/>
					</div>
				</div>
			),
			header: 'Select Product',
			size: 120,
		}),
		columnHelper.accessor('name', {
			cell: (info) => <div className=''>{`${info.getValue() || '-'}`}</div>,
			header: 'Name',
		}),
		columnHelper.accessor('productCode', {
			cell: (info) => <div className=''>{`${info.getValue()}`}</div>,
			header: 'Product Code',
		}),
		columnHelper.accessor('premium_rate', {
			cell: (info) => <div className=''>{`${info.getValue() || '-'}`}</div>,
			header: 'Premium Rate',
		}),
		columnHelper.accessor('wooden_rate', {
			cell: (info) => <div className=''>{`${info.getValue() || '-'}`}</div>,
			header: 'Wooden Rate',
		}),
		columnHelper.accessor('commercial_rate', {
			cell: (info) => <div className=''>{`${info.getValue() || '-'}`}</div>,
			header: 'Commercial_Rate',
		}),
		columnHelper.accessor('anodize_rate', {
			cell: (info) => <div className=''>{`${info.getValue() || '-'}`}</div>,
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

	return (
		<PageWrapper name='ADD Branches' isProtectedRoute={true}>
			<Subheader>
				<SubheaderLeft>
					<Button
						icon='HeroArrowLeft'
						className='!px-0'
						onClick={() => navigate(`${PathRoutes.product}`)}>
						{`${window.innerWidth > 425 ? 'Back to List' : ''}`}
					</Button>
					<SubheaderSeparator />
				</SubheaderLeft>
				<SubheaderRight>
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
							className='w-80 pl-8 sm:w-96'
							id='searchBar'
							name='searchBar'
							autoComplete='off'
							placeholder='Search Product Code To Update...'
							value={globalFilter ?? ''}
							onChange={(e) => setGlobalFilter(e.target.value)}
						/>
					</FieldWrap>
				</SubheaderRight>
			</Subheader>

			<Container className='flex shrink-0  basis-auto flex-col pb-0'>
				<div className='flex h-fit flex-wrap content-start'>
					<div className='mb-4 grid w-full grid-cols-6 gap-1'>
						<div className='col-span-12 flex flex-col gap-1 xl:col-span-6'>
							<div className='col-span-12 flex flex-col gap-1 xl:col-span-6'>
								<Card>
									<CardBody>
										<form onSubmit={formik.handleSubmit}>
											{formik.values.entries.map((entry: any, index: any) => (
												<div className='relative py-5' key={index}>
													<div className='mt-1 grid grid-cols-12 gap-2 '>
														<div className='col-span-12 lg:col-span-3'>
															<Label
																htmlFor={`rate-${index}`}
																className='w-[200px] text-base'>
																Wooden Coating Rate(rs)
															</Label>
															<Input
																id={`wooden_rate-${index}`}
																name={`entries[${index}].wooden_rate`}
																type='number'
																value={entry.wooden_rate}
																onBlur={formik.handleBlur}
																min={0}
																onChange={(e: any) => {
																	if (checkNagative(e)) return;
																	const newEntries = [
																		...formik.values.entries,
																	];
																	newEntries[index].wooden_rate =
																		e.target.value;
																	formik.setFieldValue(
																		'entries',
																		newEntries,
																	);
																}}
															/>
															{formik.touched.entries?.[index]
																?.wooden_rate &&
															formik.errors.entries?.[index]
																?.wooden_rate ? (
																<div className='text-red-500'>
																	{
																		formik.errors.entries[index]
																			.wooden_rate
																	}
																</div>
															) : null}
														</div>
														<div className='col-span-12 lg:col-span-3'>
															<Label
																htmlFor={`commercial_rate-${index}`}
																className='w-[200px] text-base'>
																Commercial Coating Rate(rs)
															</Label>
															<Input
																id={`commercial_rate-${index}`}
																name={`entries[${index}].commercial_rate`}
																type='number'
																value={entry.commercial_rate}
																min={0}
																onBlur={formik.handleBlur}
																onChange={(e: any) => {
																	if (checkNagative(e)) return;
																	const newEntries = [
																		...formik.values.entries,
																	];
																	newEntries[
																		index
																	].commercial_rate =
																		e.target.value;
																	formik.setFieldValue(
																		'entries',
																		newEntries,
																	);
																}}
															/>
															{formik.touched.entries?.[index]
																?.commercial_rate &&
															formik.errors.entries?.[index]
																?.commercial_rate ? (
																<div className='text-red-500'>
																	{
																		formik.errors.entries[index]
																			.wooden_rate
																	}
																</div>
															) : null}
														</div>
														<div className='col-span-12 lg:col-span-3'>
															<Label
																htmlFor={`anodize_rate-${index}`}
																className='w-[200px] text-base'>
																Anodize Coating Rate(rs)
															</Label>
															<Input
																id={`anodize_rate-${index}`}
																name={`entries[${index}].anodize_rate`}
																type='number'
																value={entry.anodize_rate}
																min={0}
																onBlur={formik.handleBlur}
																onChange={(e: any) => {
																	if (checkNagative(e)) return;
																	const newEntries = [
																		...formik.values.entries,
																	];
																	newEntries[index].anodize_rate =
																		e.target.value;
																	formik.setFieldValue(
																		'entries',
																		newEntries,
																	);
																}}
															/>
															{formik.touched.entries?.[index]
																?.anodize_rate &&
															formik.errors.entries?.[index]
																?.anodize_rate ? (
																<div className='text-red-500'>
																	{
																		formik.errors.entries[index]
																			.anodize_rate
																	}
																</div>
															) : null}
														</div>
														<div className='col-span-12 lg:col-span-3'>
															<Label
																htmlFor={`premium_rate-${index}`}
																className='w-[200px] text-base'>
																Premium Coating Rate(rs)
															</Label>
															<Input
																id={`premium_rate-${index}`}
																name={`entries[${index}].premium_rate`}
																type='number'
																value={entry.premium_rate}
																onBlur={formik.handleBlur}
																min={0}
																onChange={(e: any) => {
																	if (checkNagative(e)) return;
																	const newEntries = [
																		...formik.values.entries,
																	];
																	newEntries[index].premium_rate =
																		e.target.value;
																	formik.setFieldValue(
																		'entries',
																		newEntries,
																	);
																}}
															/>
															{formik.touched.entries?.[index]
																?.premium_rate &&
															formik.errors.entries?.[index]
																?.premium_rate ? (
																<div className='text-red-500'>
																	{
																		formik.errors.entries[index]
																			.premium_rate
																	}
																</div>
															) : null}
														</div>
													</div>
												</div>
											))}

											<div className='mt-4 flex gap-2'>
												<Button
													type='submit'
													variant='solid'
													isDisable={isUpdateLoding}
													isLoading={isUpdateLoding}
													color='blue'>
													Update
												</Button>
											</div>
										</form>
									</CardBody>
								</Card>
							</div>
						</div>
					</div>
				</div>
			</Container>

			<Container>
				<Card className='h-full'>
					<CardHeader>
						<CardHeaderChild>
							<CardTitle>All Selected Products for Update</CardTitle>
							<Badge
								variant='outline'
								className='border-transparent px-4'
								rounded='rounded-full'>
								{tableCount} items
							</Badge>
						</CardHeaderChild>
					</CardHeader>
					<CardBody className='overflow-auto'>
						{!isLoading && mainData?.length > 0 ? (
							<TableTemplate
								className='table-fixed max-md:min-w-[70rem]'
								table={table}
							/>
						) : (
							!isLoading && (
								<p className='flex h-[29vh] items-center justify-center  text-center text-gray-500'>
									No records found for the specified product code. Please check
									your product search and try again.
								</p>
							)
						)}
						<div className='flex justify-center'>
							{isLoading && <LoaderDotsCommon />}
						</div>
					</CardBody>
					{mainData?.length > 0 && (
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
		</PageWrapper>
	);
};

export default EditBulkProductPage;
