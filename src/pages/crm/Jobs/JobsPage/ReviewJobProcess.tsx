import React, { useEffect, useMemo, useState, type Dispatch, type SetStateAction } from 'react';
import Modal, { ModalBody, ModalHeader } from '../../../../components/ui/Modal';
import PageWrapper from '../../../../components/layouts/PageWrapper/PageWrapper';
import { get, post } from '../../../../utils/api-helper.util';
import Container from '../../../../components/layouts/Container/Container';
import Button from '../../../../components/ui/Button';
import { toast } from 'react-toastify';
import { PathRoutes } from '../../../../utils/routes/enum';
import { useNavigate } from 'react-router-dom';
import { Input, Label } from '../../../../components/form';
type props = {
	formik: any;
	isOpen: boolean;
	setIsOpen: Dispatch<SetStateAction<boolean>>;
};
const ReviewJobProcess = ({ formik, isOpen, setIsOpen }: props) => {
	const navigate = useNavigate();
	const [branchData, setBranchData] = useState<any>([]);
	const [isSubmitting, setIsSubmitting] = useState<any>(false);

	const selfProducts = useMemo(() => {
		return formik?.values?.self_products?.filter((item: any) => item?.value) || [];
	}, [formik]);

	const getBranchDetails = async () => {
		try {
			const { data } = await get('/branches');
			setBranchData(data?.find((branch: any) => branch?._id)?.name);
		} catch (error) {
			console.error('Error Fetching Branch', error);
		}
	};
	useEffect(() => {
		getBranchDetails();
	}, []);

	const handleSaveEntries = async () => {
		try {
			setIsSubmitting(true);
			const value = formik?.values;
			const batch = value?.batch?.map((item: any) => {
				return {
					coEntry: item?.co_id,
					products: item?.products?.map((product: any) => {
						return {
							product: product?.product?._id,
							quantity: Number(product?.pickQuantity),
							coating: product?.coating?._id,
							color: product?.color?._id,
							mm: product?.mm || null,
						};
					}),
				};
			});
			
			const selfProducts = value?.self_products?.map((item: any) => {
				return {
					product: item?.value,
					quantity: Number(item?.pickQuantity),
					coating: item?.coating,
					color: item?.color,
					mm: item?.mm || null,
				};
			});

			const body: any = {
				name: value?.name,
				branch: value?.branch,
			};
			if (selfProducts[0]?.product) {
				body.selfProducts = selfProducts;
			}

			if(value?.batch[0]?.co_id !== ''){
				body.batch = batch; 
			}

			if (body?.batch) {
				value?.batch.forEach((entry: any) => {
					entry.products.forEach((item: any) => {
						if (
							!item.quantityInBranch ||
							Number(item.quantityInBranch) < Number(item.pickQuantity)
						) {
							toast.error('Quantity can not be greater than pending quantity');
							return
						}
						if (!Number(item.pickQuantity)) {
							toast.error('Please Enter Quantity ');
							return
						}
					});
				});
			}


			if (body?.selfProducts) {
				body.selfProducts.forEach((item: any) => {
					if (!item.quantityInBranch || Number(item.quantityInBranch) < Number(item.quantity)) {
						toast.error('Quantity cannot be greater than available quantity');
						return
					}
					if (!Number(item.quantity)) {
						toast.error('Please Enter Quantity');
						return
					}
				});
			}
			const jobData = await post('/jobs', body);
			toast.success('Job Created Successfully');
			navigate(PathRoutes.jobs);
		} catch (error) {
			toast.error('Please try again review job');
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<Modal isOpen={isOpen} setIsOpen={setIsOpen} isScrollable fullScreen>
			<ModalHeader className='m-5 flex items-center justify-between rounded-none border-b text-lg font-bold'>
				Review Job Process
			</ModalHeader>

			<ModalBody>
				<PageWrapper name='Review Quantity Status' isProtectedRoute={true}>
					<Container className='flex shrink-0 grow basis-auto flex-col pb-0'>
						<h2 className='mb-2 text-lg font-semibold'>Branch Name: {branchData} </h2>

						{formik?.values?.batch?.map((batch: any, index: number) => {
							if (
								!batch?.products?.filter(
									(item: any) => item?.coating?.name && item?.color?.name,
								)?.length
							)
								return;
							return (
								<div key={index} className='mt-4'>
									<h2 className='mb-2 text-lg font-semibold'>
										Customer {index + 1}
									</h2>
									{batch?.products
										?.filter(
											(item: any) => item?.coating?.name && item?.color?.name,
										)
										?.map((product: any, productIndex: number) => {
											return (
												<div
													className='col-span-12 flex gap-3 lg:col-span-12'
													key={productIndex}>
													<div className='col-span-12 lg:col-span-2'>
														<Label htmlFor={`product${productIndex}`}>
															Product {productIndex + 1}
														</Label>
														<Input
															type='text'
															id={`product${productIndex}`}
															name={`product${productIndex}`}
															value={`${product.product.name}`}
															disabled
														/>
													</div>
													<div className='col-span-12 lg:col-span-3'>
														<Label htmlFor={`quantity${productIndex}`}>
															Pending Quantity
														</Label>
														<Input
															type='text'
															id={`quantity${productIndex}`}
															name={`quantity${productIndex}`}
															// value={product.pendingQuantity || product.quantity}
															value={
																product.itemSummary
																	?.pendingQuantity ??
																product.quantity
															}
															disabled
														/>
													</div>
													<div className='col-span-12 lg:col-span-3'>
														<Label htmlFor={`quantity${productIndex}`}>
															Quantity in Branch
														</Label>
														<Input
															type='text'
															id={`quantity${productIndex}`}
															name={`quantity${productIndex}`}
															// value={product.pendingQuantity || product.quantity}
															value={product?.quantityInBranch || 0}
															disabled
														/>
													</div>
													<div className='col-span-12 lg:col-span-2'>
														<Label
															htmlFor={`pickQuantity${productIndex}`}>
															Quantity
														</Label>
														<Input
															type='number'
															id={`pickQuantity${productIndex}`}
															name={`batch[${index}].products[${productIndex}].pickQuantity`}
															value={product.pickQuantity}
															onChange={(e) => {
																formik?.setFieldValue(
																	`batch[${index}].products[${productIndex}].pickQuantity`,
																	e.target.value,
																);
																formik.setFieldTouched(
																	`batch[${index}].products[${productIndex}].pickQuantity`,
																	true,
																	false,
																);
															}}
															min={0}
														/>
													</div>
												</div>
											);
										})}
								</div>
							);
						})}
						{selfProducts?.length ? (
							<div>
								<h2 className='mt-4 text-lg font-semibold'>Self Products</h2>
								{selfProducts?.map((selfProduct: any, selfProductIndex: number) => {
									return (
										<div className='col-span-12 flex gap-3 lg:col-span-12'>
											<div className='col-span-12 lg:col-span-2'>
												<Label
													htmlFor={`selfProductName-${selfProductIndex}`}>
													Product
												</Label>
												<Input
													type='text'
													id={`selfProductName-${selfProductIndex}`}
													name={`selfProductName-${selfProductIndex}`}
													value={selfProduct.name}
													disabled
												/>
											</div>
											<div className='col-span-12 lg:col-span-3'>
												<Label htmlFor={`quantity${selfProductIndex}`}>
													Quantity in Branch
												</Label>
												<Input
													type='text'
													id={`quantity${selfProductIndex}`}
													name={`quantity${selfProductIndex}`}
													// value={product.pendingQuantity || product.quantity}
													value={selfProduct?.quantityInBranch || 0}
													disabled
												/>
											</div>

											<div className='col-span-12 lg:col-span-2'>
												<Label htmlFor={`pickQuantity${selfProductIndex}`}>
													Quantity
												</Label>
												<Input
													type='number'
													id={`pickQuantity${selfProductIndex}`}
													name={`self_products[${selfProductIndex}].pickQuantity`}
													value={selfProduct.pickQuantity}
													onChange={(e) => {
														formik?.setFieldValue(
															`self_products[${selfProductIndex}].pickQuantity`,
															e.target.value,
														);
														formik.setFieldTouched(
															`self_products[${selfProductIndex}].pickQuantity`,
															true,
															false,
														);
													}}
													min={0}
												/>
											</div>
										</div>
									);
								})}
							</div>
						) : null}

						<div className='mt-2 flex'>
							<Button
								variant='solid'
								color='blue'
								isLoading={formik?.isSubmitting}
								isDisable={formik?.isSubmitting}
								onClick={handleSaveEntries}>
								Save Data
							</Button>
						</div>
					</Container>
				</PageWrapper>
			</ModalBody>
		</Modal>
	);
};

export default ReviewJobProcess;
