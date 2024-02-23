import React, { useState } from 'react';
import Input from '../../../../components/form/Input';
import Label from '../../../../components/form/Label';
import Button from '../../../../components/ui/Button';
import Collapse from '../../../../components/utils/Collapse';
import Card, { CardBody } from '../../../../components/ui/Card';
import Textarea from '../../../../components/form/Textarea';
import getUserRights from '../../../../hooks/useUserRights';

const BuyerInfo = ({ formik, accordionStates, setAccordionStates }: any) => {
	const privileges = getUserRights('customers');

	const handleBuyerChange =
		(index: number, fieldName: string) =>
		(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
			const target = e.target;
			const inputValue = target.value;
			const cursorPosition = target.selectionStart || 0;

			let formattedValue = inputValue.toUpperCase(); // Capitalize the entire value

			// Use a ref to store and retrieve the cursor position
			const cursorPositionRef: any = React.createRef<
				HTMLTextAreaElement | HTMLInputElement
			>();
			cursorPositionRef.current = target;

			// Schedule a microtask to set the cursor position after the re-render
			Promise.resolve().then(() => {
				if (cursorPositionRef.current !== undefined) {
					cursorPositionRef.current.setSelectionRange(cursorPosition, cursorPosition);
				}
			});

			formik.handleChange(e);
			formik.setFieldValue(`buyers[${index}].${fieldName}`, formattedValue);
		};

	const handleAddBuyerClick = () => {
		formik.setValues((prevValues: any) => {
			const newBuyers = [
				...prevValues.buyers,
				{
					buyerName: '',
					buyerPhone: '',
					buyerPhoneExt: '',
					buyerEmail: '',
					buyerNotes: '',
				},
			];
			return { ...prevValues, buyers: newBuyers };
		});
	};

	const handleDeleteBuyer = (index: any) => {
		formik.setValues((prevValues: any) => {
			const newBuyers = [...prevValues.buyers];
			newBuyers.splice(index, 1);
			return { ...prevValues, buyers: newBuyers };
		});
	};

	const formatPhoneNumber = (inputNumber: any) => {
		const numericPart = inputNumber.replace(/\D/g, '');

		if (numericPart.length === 0) {
			return ''; // Return an empty string when there are no numeric characters
		}
		if (numericPart.length <= 3) {
			return `(${numericPart}`;
		}
		if (numericPart.length <= 6) {
			return `(${numericPart.slice(0, 3)}) ${numericPart.slice(3)}`;
		}
		return `(${numericPart.slice(0, 3)}) ${numericPart.slice(3, 6)}-${numericPart.slice(
			6,
			10,
		)}`;
	};

	return (
		<div>
			<div className='col-span-12 flex flex-col gap-4 xl:col-span-6'>
				<Card>
					<CardBody>
						<div className='flex'>
							<div className='grow'>
								<Button
									className='flex w-full items-center justify-between rounded-none border-b px-[2px] py-[0px] text-lg font-bold'
									variant='outlined'
									onClick={() =>
										setAccordionStates({
											...accordionStates,
											buyerInfo: !accordionStates.buyerInfo,
										})
									}
									rightIcon={
										!accordionStates.buyerInfo
											? 'HeroChevronUp'
											: 'HeroChevronDown'
									}>
									Buyer Information
								</Button>
							</div>
						</div>
						<Collapse isOpen={!accordionStates.buyerInfo}>
							<div className='mt-4 grid grid-cols-6 gap-4'>
								<div className='col-span-12 lg:col-span-12'>
									{formik?.values?.buyers?.map((buyer: any, index: number) => (
										<div className='mt-0' key={index}>
											<div className='flex items-end justify-end'>
												{formik.values.buyers.length > 1 && (
													<Button
														type='button'
														onClick={() => handleDeleteBuyer(index)}
														variant='outlined'
														color='red'
														isDisable={!privileges.canWrite()}>
														<svg
															xmlns='http://www.w3.org/2000/svg'
															fill='none'
															viewBox='0 0 24 24'
															strokeWidth='1.5'
															stroke='currentColor'
															data-slot='icon'
															className='h-6 w-6'>
															<path
																strokeLinecap='round'
																strokeLinejoin='round'
																d='M6 18 18 6M6 6l12 12'
															/>
														</svg>
													</Button>
												)}
											</div>
											<div key={index} className='grid grid-cols-12 gap-4'>
												<div className='col-span-12 lg:col-span-4'>
													<Label htmlFor={`buyerName_${index}`}>
														Buyer Name
													</Label>
													<Input
														id={`buyerName_${index}`}
														name={`buyers[${index}].buyerName`}
														onChange={handleBuyerChange(
															index,
															'buyerName',
														)}
														value={buyer.buyerName}
														autoComplete={`buyerName_${index}`}
														required
														onBlur={formik.handleBlur}
														disabled={!privileges.canWrite()}
													/>

													{formik.touched.buyers?.[index]?.buyerName &&
													formik.errors.buyers?.[index]?.buyerName ? (
														<div className='text-red-500'>
															{formik.errors.buyers[index].buyerName}
														</div>
													) : null}
												</div>
												<div className='col-span-12 lg:col-span-3'>
													<Label htmlFor={`buyerPhone_${index}`}>
														Buyer Phone
													</Label>
													<Input
														id={`buyerPhone_${index}`}
														name={`buyers[${index}].buyerPhone`}
														onChange={(e) => {
															const formattedPhoneNumber =
																formatPhoneNumber(e.target.value);
															formik.handleChange(e);
															formik.setFieldValue(
																`buyers[${index}].buyerPhone`,
																formattedPhoneNumber,
															);
														}}
														value={buyer.buyerPhone}
														autoComplete={`buyerPhone_${index}`}
														required
														onBlur={formik.handleBlur}
														disabled={!privileges.canWrite()}
													/>
													{formik.touched.buyers?.[index]?.buyerPhone &&
													formik.errors.buyers?.[index]?.buyerPhone ? (
														<div className='text-red-500'>
															{formik.errors.buyers[index].buyerPhone}
														</div>
													) : null}
												</div>
												<div className='col-span-1 lg:col-span-1'>
													<Label htmlFor={`buyerPhoneExt_${index}`}>
														Ext.
													</Label>
													<Input
														id={`buyerPhoneExt_${index}`}
														name={`additionalContactInfo[${index}].buyerPhoneExt`}
														type='number'
														autoComplete={`buyerPhoneExt_${index}`}
														onChange={handleBuyerChange(
															index,
															'buyerPhoneExt',
														)}
														value={buyer.buyerPhoneExt}
														onBlur={formik.handleBlur}
														disabled={!privileges.canWrite()}
													/>
												</div>
												<div className='col-span-12 lg:col-span-4'>
													<Label htmlFor={`buyerEmail_${index}`}>
														Buyer Email
													</Label>
													<Input
														id={`buyerEmail_${index}`}
														name={`buyers[${index}].buyerEmail`}
														onChange={handleBuyerChange(
															index,
															'buyerEmail',
														)}
														value={buyer.buyerEmail}
														autoComplete={`buyerEmail_${index}`}
														required
														multiple
														onBlur={formik.handleBlur}
														disabled={!privileges.canWrite()}
													/>
													{formik.touched.buyers &&
														formik.touched.buyers[index] &&
														formik.errors.buyers &&
														formik.errors.buyers[index]?.buyerEmail && (
															<div className='text-red-500'>
																{
																	formik.errors.buyers[index]
																		.buyerEmail
																}
															</div>
														)}
												</div>
												<div className='col-span-12 mb-5 lg:col-span-12'>
													<Label htmlFor={`buyerNotes_${index}`}>
														Buyer Notes
													</Label>
													<Textarea
														id={`buyerNotes_${index}`}
														name={`buyers[${index}].buyerNotes`}
														onChange={handleBuyerChange(
															index,
															'buyerNotes',
														)}
														value={buyer.buyerNotes}
														autoComplete={`buyerNotes_${index}`}
														required
														onBlur={formik.handleBlur}
														disabled={!privileges.canWrite()}
													/>
												</div>
											</div>
										</div>
									))}
									<Button
										onClick={handleAddBuyerClick}
										variant='outline'
										color='zinc'
										size='lg'
										className='w-64'
										isDisable={!privileges.canWrite()}>
										Add Buyer
									</Button>
								</div>
							</div>
						</Collapse>
					</CardBody>
				</Card>
			</div>
		</div>
	);
};

export default BuyerInfo;
