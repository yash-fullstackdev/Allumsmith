import React, { useCallback, useEffect, useState } from 'react';
import Card, { CardBody } from '../../../../../components/ui/Card';
import Button from '../../../../../components/ui/Button';
import Select from '../../../../../components/form/Select';
import countryDb from '../../../../../mocks/db/country.db';
import Label from '../../../../../components/form/Label';
import Input from '../../../../../components/form/Input';
import getUserRights from '../../../../../hooks/useUserRights';
import FieldWrap from '../../../../../components/form/FieldWrap';
import Textarea from '../../../../../components/form/Textarea';
import { toast } from 'react-toastify';
import { handleInputChange } from '../../../../../utils/capitalizedFunction.util';
import { UomOption } from '../../../../../utils/types/common';
import { useParams } from 'react-router-dom';



const uomOptions: UomOption[] = [
	{ value: 'EA', label: 'EA' },
	{ value: 'BX', label: 'BX' },
	{ value: 'CS', label: 'CS' },
	{ value: 'DZ', label: 'DZ' },
	{ value: 'GR', label: 'GR' },
	{ value: 'M', label: 'M' },
	{ value: 'PK', label: 'PK' },
	{ value: 'RL', label: 'RL' },
];

// Function to check if a value is a number
function isNumeric(value: any) {
	return !isNaN(parseFloat(value)) && isFinite(value);
}

const VendorModal = ({ formik, vendor, vendorData, setVendorData, setScModal, onSave }: any) => {
	const privileges = getUserRights('components');
	let test = { ...formik.values, vendornum: formik.values.vendorName?.split('-')[0] };

	const saveDataToFirestore = async () => {
		try {
			// console.log(modifiedNotes);
			const check = await formik.validateForm();
			await formik.validateForm();
			console.log(formik.values);

			const handleNestedErrors = (errors: any, prefix = '') => {
				//  logic to touch the field which are not validated
				Object.keys(errors).forEach((errorField) => {
					const fieldName = prefix ? `${prefix}.${errorField}` : errorField;

					if (typeof errors[errorField] === 'object' && errors[errorField] !== null) {
						// Recursive call for nested errors
						handleNestedErrors(errors[errorField], fieldName);
					} else {
						// Set the field as touched and set the error
						formik.setFieldTouched(fieldName, true, false);
						formik.setFieldError(fieldName, errors[errorField]);
					}
				});
			};

			if (Object.keys(check).length > 0) {
				handleNestedErrors(check);

				toast.error(`Please fill all the mandatory fields and check all formats`);
				return;
			}

			// Logic to Calculate Standard Pricing - Post Validation

			// procurementUOM [quantity, uom ], pricingUOM, pricingCost, pricingQuantity
			// shippingCost, importDuty, fees, taxes, miscCost
			const {
				shippingCost,
				importDuty,
				fees,
				taxes,
				miscCost,
				pricingUOM,
				pricingQuantity,
				pricingCost,
				procurementUOM,
			} = formik.values;

			// const additionalCost = shippingCost + importDuty + fees + taxes + miscCost;
			const additionalCost =
				(isNumeric(shippingCost) ? shippingCost : 0) +
				(isNumeric(importDuty) ? importDuty : 0) +
				(isNumeric(fees) ? fees : 0) +
				(isNumeric(taxes) ? taxes : 0) +
				(isNumeric(miscCost) ? miscCost : 0);
			console.log(additionalCost);

			let finalQuantity = 1;
			let finalUOMEA = false;

			// procurementUOM.forEach((item: any, index: any) => {
			// 	const { uom, quantity } = item;
			// 	console.log('UOM:', uom);
			// 	console.log('Quantity:', quantity);

			// 	let multiplier = 1;
			// 	if (uom === 'DZ') {
			// 		multiplier = 12;
			// 	} else if (uom === 'GR') {
			// 		multiplier = 144;
			// 	} else if (uom === 'M') {
			// 		multiplier = 1000;
			// 	}

			// 	finalQuantity *= multiplier * quantity;

			// 	// Check if it's the last element and if the uom is "EA"
			// 	if (index === procurementUOM.length - 1 && uom === 'EA') {
			// 		finalUOMEA = true;
			// 	}
			// });

			const lastItem = procurementUOM[procurementUOM.length - 1];
			if (lastItem && lastItem.uom !== 'EA') {
				toast.error('Please make sure the final Procurement UOM is EA...');
				return;
			}
			console.log(finalQuantity, 'finalQuantity');
			console.log(finalUOMEA, 'finalUOMEA');

			// Now find in Pricing UOM
			console.log(pricingUOM, 'pricingUOM');
			console.log(pricingQuantity, 'pricingQuantity');
			console.log(pricingCost, 'pricingCost');

			let uomMatched = false;
			let standardPricing = 0; // Price for EA
			if (pricingUOM === 'EA') {
				standardPricing = (pricingCost + additionalCost) / pricingQuantity;
				uomMatched = true;
			} else if (pricingUOM === 'M') {
				standardPricing = (pricingCost + additionalCost) / (pricingQuantity * 1000);
				uomMatched = true;
			} else if (pricingUOM === 'GR') {
				standardPricing = (pricingCost + additionalCost) / (pricingQuantity * 144);
				uomMatched = true;
			} else {
				procurementUOM.forEach((item: any) => {
					const { uom, quantity } = item;
					if (uom === pricingUOM && !uomMatched) {
						uomMatched = true;
						standardPricing = 1;
					} else if (uomMatched) {
						standardPricing *= quantity;
					}
				});

				if (uomMatched) {
					console.log(standardPricing, 'standardPricing');
					standardPricing =
						(pricingCost + additionalCost) / (standardPricing * pricingQuantity);
				}
			}
			console.log(standardPricing, 'standardPricing');

			if (!uomMatched) {
				toast.error('Please make sure the Procurement UOM matches the Pricing UOM...');
				return;
			}

			standardPricing = parseFloat((Math.round(standardPricing * 10000) / 10000).toFixed(4));
			console.log(standardPricing, 'standardPricing');
			// Logic to Calculate Standard Pricing - Post Validation

			test.standardPricing = standardPricing;

			console.log(test);

			setVendorData([...vendorData, test]);
			// toast.success("Data Added Successfully")
			onSave(test, formik.values.isEdit);
			formik.resetForm();
			setScModal(false);
		} catch (error: any) {
			console.error('Error adding document', error);
			toast.error('Error adding document', error);
		}
	};
	// console.log("Vendor Data", vendorData);
	const handleAddUOMClick = () => {
		formik.setValues((prevValues: any) => {
			const newProcurementUOMs = [...prevValues.procurementUOM, { uom: '', quantity: '' }];
			return { ...prevValues, procurementUOM: newProcurementUOMs };
		});
	};

	const handleDeleteUOM = (index: any) => {
		formik.setValues((prevValues: any) => {
			const newProcurementUOMs = [...prevValues.procurementUOM];
			newProcurementUOMs.splice(index, 1);
			return { ...prevValues, procurementUOM: newProcurementUOMs };
		});
	};

	console.log('Child Formik Values', formik);

	const handleUOMChange =
		(index: any, field: string) =>
			(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
				const target = e.target;
				const inputValue = target.value;
				let formattedValue = inputValue.toUpperCase();
				const cursorPositionRef: any = React.createRef<
					HTMLTextAreaElement | HTMLInputElement
				>();
				cursorPositionRef.current = target;
				formik.setFieldValue(`procurementUOM[${index}].${field}`, formattedValue);
			};

	const handleChangeVendorNotes = (
		event: React.ChangeEvent<HTMLTextAreaElement>,
		index: number,
	) => {
		const target = event.target;
		const inputValue = target.value;
		const cursorPosition = target.selectionStart || 0;

		// Capitalize the entire value
		let formattedValue = inputValue.toUpperCase();

		// Store the current cursor position
		let storedCursorPosition = cursorPosition;

		// Update the formik state
		formik.handleChange(event);

		// Update the notes array with the formatted value
		const newNotes = [...formik.values.vendorNotes];
		newNotes[index] = formattedValue;
		formik.setFieldValue('vendorNotes', newNotes);

		// Schedule a microtask to set the cursor position after the re-render
		Promise.resolve().then(() => {
			if (target !== undefined) {
				target.setSelectionRange(storedCursorPosition, storedCursorPosition);
			}
		});
	};

	const handleAddVendorNote = () => {
		formik.setFieldValue('vendorNotes', [...formik.values.vendorNotes, '']);
	};

	return (
		<div className='col-span-12 flex flex-col gap-1 xl:col-span-6'>
			<Card>
				<CardBody>
					<div>
						<div className='mt-4 grid grid-cols-12 gap-1'>
							<div className='col-span-12 lg:col-span-6'>
								<Label htmlFor='vendorName'>
									Vendor Name
									<span className='ml-1 text-red-500'>*</span>
								</Label>
								<Select
									id='vendorName'
									name='vendorName'
									value={formik.values.vendorName}
									placeholder='Select Vendor'
									onChange={formik.handleChange}
									onBlur={formik.handleBlur}
									disabled={!privileges.canWrite()}>
									{vendor &&
										vendor.length > 0 &&
										vendor.map((data: any) => (
											<option
												key={data?.vendorNumber}
												value={`${data?.vendorNumber}-${data?.Name}`}>{`${data?.Name}`}</option>
										))}
								</Select>

								{formik.touched?.vendorName && formik.errors?.vendorName ? (
									<div className='text-red-500'>{formik.errors.vendorName}</div>
								) : null}
							</div>
							<div className='col-span-12 lg:col-span-3'>
								<Label htmlFor='manufacturerName'>Manufacturer Name</Label>
								<Input
									id='manufacturerName'
									name='manufacturerName'
									onChange={handleInputChange(formik.setFieldValue)(
										'manufacturerName',
									)}
									value={formik.values.manufacturerName}
									onBlur={formik.handleBlur}
									disabled={!privileges.canWrite()}
								/>
								{formik.touched.manufacturerName &&
									formik.errors.manufacturerName ? (
									<div className='text-red-500'>
										{formik.errors.manufacturerName}
									</div>
								) : null}
							</div>
							<div className='col-span-12 lg:col-span-3'>
								<Label htmlFor='leadTime'>Lead Time</Label>
								<Select
									id='leadTime'
									name='leadTime'
									value={formik.values.leadTime}
									placeholder='Select Lead Time'
									onChange={formik.handleChange}
									onBlur={formik.handleBlur}
									disabled={!privileges.canWrite()}>
									<option value='DAYS'>Days</option>
									<option value='WEEKS'>Weeks</option>
									<option value='MONTHS'>Months</option>
								</Select>
								{formik.touched.leadTime && formik.errors.leadTime ? (
									<div className='text-red-500'>{formik.errors.leadTime}</div>
								) : null}
							</div>

							<div className='col-span-12 lg:col-span-6'>
								<Label htmlFor='vendorNumber'>Vendor Number</Label>
								<Input
									id='vendorNumber'
									name='vendorNumber'
									onChange={formik.handleChange}
									value={formik.values.vendorName?.split('-')[0]}
									onBlur={formik.handleBlur}
									disabled
								/>
								{formik.touched.vendorNumber && formik.errors.vendorNumber ? (
									<div className='text-red-500'>{formik.errors.vendorNumber}</div>
								) : null}
							</div>

							<div className='col-span-12 lg:col-span-3'>
								<Label htmlFor='manufacturerItemNo'>Manufacturer Item #</Label>
								<Input
									id='manufacturerItemNo'
									name='manufacturerItemNo'
									onChange={handleInputChange(formik.setFieldValue)(
										'manufacturerItemNo',
									)}
									value={formik.values.manufacturerItemNo}
									onBlur={formik.handleBlur}
									disabled={!privileges.canWrite()}
								/>
								{formik.touched.manufacturerItemNo &&
									formik.errors.manufacturerItemNo ? (
									<div className='text-red-500'>
										{formik.errors.manufacturerItemNo}
									</div>
								) : null}
							</div>

							<div className='col-span-12 lg:col-span-3'>
								<Label htmlFor='leadTimeDuration'>Lead Time Duration</Label>
								<Input
									id='leadTimeDuration'
									type='number'
									min={0}
									name='leadTimeDuration'
									onChange={formik.handleChange}
									value={formik.values.leadTimeDuration}
								/>
							</div>

							<div className='col-span-12 lg:col-span-6'>
								<Label htmlFor='vendorItemNumber'>Vendor Item Number</Label>
								<Input
									id='vendorItemNumber'
									name='vendorItemNumber'
									onChange={handleInputChange(formik.setFieldValue)(
										'vendorItemNumber',
									)}
									value={formik.values.vendorItemNumber}
									onBlur={formik.handleBlur}
									disabled={!privileges.canWrite()}
								/>
								{formik.touched.vendorItemNumber &&
									formik.errors.vendorItemNumber ? (
									<div className='text-red-500'>
										{formik.errors.vendorItemNumber}
									</div>
								) : null}
							</div>

							<div className='col-span-12 lg:col-span-3'>
								<Label htmlFor='manufacturerItemDescription'>
									Manufacturer Item Description
								</Label>
								<Input
									id='manufacturerItemDescription'
									name='manufacturerItemDescription'
									onChange={handleInputChange(formik.setFieldValue)(
										'manufacturerItemDescription',
									)}
									value={formik.values.manufacturerItemDescription}
									onBlur={formik.handleBlur}
									disabled={!privileges.canWrite()}
								/>
								{formik.touched.manufacturerItemDescription &&
									formik.errors.manufacturerItemDescription ? (
									<div className='text-red-500'>
										{formik.errors.manufacturerItemDescription}
									</div>
								) : null}
							</div>

							<div className='col-span-12 lg:col-span-3'>
								<Label htmlFor='minimumPOQty'>Minimum PO Quantity</Label>
								<Input
									id='minimumPOQty'
									type='number'
									min={0}
									name='minimumPOQty'
									onChange={formik.handleChange}
									value={formik.values.minimumPOQty}
								/>
							</div>
							<div className='col-span-12 lg:col-span-6'>
								<Label htmlFor='vendorProductDescription'>
									Vendor Product Description
								</Label>
								<Input
									id='vendorProductDescription'
									name='vendorProductDescription'
									onChange={handleInputChange(formik.setFieldValue)(
										'vendorProductDescription',
									)}
									value={formik.values.vendorProductDescription}
									onBlur={formik.handleBlur}
									disabled={!privileges.canWrite()}
								/>
								{formik.touched.vendorProductDescription &&
									formik.errors.vendorProductDescription ? (
									<div className='text-red-500'>
										{formik.errors.vendorProductDescription}
									</div>
								) : null}
							</div>
							<div className='col-span-12 lg:col-span-3'>
								<Label htmlFor='manufacturerUOM'>Manufacturer UOM</Label>
								<Select
									id='manufacturerUOM'
									name='manufacturerUOM'
									value={formik.values.manufacturerUOM}
									placeholder='Select UOM'
									onChange={formik.handleChange}
									onBlur={formik.handleBlur}
									disabled={!privileges.canWrite()}>
									{uomOptions.map((option) => (
										<option key={option.value} value={option.value}>
											{option.label}
										</option>
									))}
								</Select>
								{formik.touched.manufacturerUOM && formik.errors.manufacturerUOM ? (
									<div className='text-red-500'>
										{formik.errors.manufacturerUOM}
									</div>
								) : null}
							</div>
							<div className='col-span-12 lg:col-span-3'>
								<Label htmlFor='country'>Country Of Origin</Label>
								<Select
									id='country'
									name='country'
									value={formik.values.country}
									placeholder='Select Country'
									onChange={formik.handleChange}
									onBlur={formik.handleBlur}
									disabled={!privileges.canWrite()}>
									{countryDb.map((country: any) => (
										<option key={country.id} value={country.name}>
											{country.name}
										</option>
									))}
								</Select>
								{formik.touched.country && formik.errors.country ? (
									<div className='text-red-500'>{formik.errors.country}</div>
								) : null}
							</div>

							<div className='col-span-12 lg:col-span-12'>
								<hr className='w-90  mx-auto h-1 rounded border-0 bg-gray-100 dark:bg-gray-700 md:my-10' />
							</div>
							<div className='col-span-12 lg:col-span-2'>
								<Label htmlFor='dropShipAllow'>Drop Ship Allow</Label>
								<Select
									id='dropShipAllow'
									name='dropShipAllow'
									value={formik.values.dropShipAllow}
									onChange={formik.handleChange}
									onBlur={formik.handleBlur}
									disabled={!privileges.canWrite()}>
									<option value=''></option>
									<option value='YES'>YES</option>
									<option value='NO'>NO</option>
								</Select>
							</div>
							<div className='col-span-12 lg:col-span-2'>
								<Label htmlFor='discountable'>Discountable</Label>
								<Select
									id='discountable'
									name='discountable'
									value={formik.values.discountable}
									onChange={formik.handleChange}
									onBlur={formik.handleBlur}
									disabled={!privileges.canWrite()}>
									<option value=''></option>
									<option value='YES'>YES</option>
									<option value='NO'>NO</option>
								</Select>
							</div>
							<div className='col-span-12 lg:col-span-2'>
								<Label htmlFor='serial'>Serial Number</Label>
								<Select
									id='serialNumber'
									name='serialNumber'
									value={formik.values.serialNumber}
									onChange={formik.handleChange}
									onBlur={formik.handleBlur}
									disabled={!privileges.canWrite()}>
									<option value=''></option>
									<option value='YES'>YES</option>
									<option value='NO'>NO</option>
								</Select>
							</div>
							<div className='col-span-12 lg:col-span-2'>
								<Label htmlFor='taxable'>Taxable</Label>
								<Select
									id='taxable'
									name='taxable'
									value={formik.values.taxable}
									onChange={formik.handleChange}
									onBlur={formik.handleBlur}
									disabled={!privileges.canWrite()}>
									<option value=''></option>
									<option value='YES'>YES</option>
									<option value='NO'>NO</option>
								</Select>
							</div>
							<div className='col-span-12 lg:col-span-2'>
								<Label htmlFor='lot'>Lot Number</Label>
								<Select
									id='lotNumber'
									name='lotNumber'
									value={formik.values.lotNumber}
									onChange={formik.handleChange}
									onBlur={formik.handleBlur}
									disabled={!privileges.canWrite()}>
									<option value=''></option>
									<option value='YES'>YES</option>
									<option value='NO'>NO</option>
								</Select>
							</div>
							<div className='col-span-12 lg:col-span-2'>
								<Label htmlFor='acceptBO'>Accept B/O</Label>
								<Select
									id='acceptBO'
									name='acceptBO'
									value={formik.values.acceptBO}
									onChange={formik.handleChange}
									onBlur={formik.handleBlur}
									disabled={!privileges.canWrite()}>
									<option value=''></option>
									<option value='YES'>YES</option>
									<option value='NO'>NO</option>
								</Select>
							</div>
							<div className='col-span-12 lg:col-span-2'>
								<Label htmlFor='expireDate'>Expire Date</Label>
								<Select
									id='expireDate'
									name='expireDate'
									value={formik.values.expireDate}
									onChange={formik.handleChange}
									onBlur={formik.handleBlur}
									disabled={!privileges.canWrite()}>
									<option value=''></option>
									<option value='YES'>YES</option>
									<option value='NO'>NO</option>
								</Select>
							</div>
							<div className='col-span-12 lg:col-span-2'>
								<Label htmlFor='partialShip'>Partial Ship</Label>
								<Select
									id='partialShip'
									name='partialShip'
									value={formik.values.partialShip}
									onChange={formik.handleChange}
									onBlur={formik.handleBlur}
									disabled={!privileges.canWrite()}>
									<option value=''></option>
									<option value='YES'>YES</option>
									<option value='NO'>NO</option>
								</Select>
							</div>
							<div className='col-span-12 lg:col-span-2'>
								<Label htmlFor='seasonalItem'>Seasonal Item</Label>
								<Select
									id='seasonalItem'
									name='seasonalItem'
									value={formik.values.seasonalItem}
									onChange={formik.handleChange}
									onBlur={formik.handleBlur}
									disabled={!privileges.canWrite()}>
									<option value=''></option>
									<option value='YES'>YES</option>
									<option value='NO'>NO</option>
								</Select>
							</div>
							<div className='col-span-12 lg:col-span-2'>
								<Label htmlFor='inventoryByPass'>Inventory Bypass</Label>
								<Select
									id='inventoryByPass'
									name='inventoryByPass'
									value={formik.values.inventoryByPass}
									onChange={formik.handleChange}
									onBlur={formik.handleBlur}
									disabled={!privileges.canWrite()}>
									<option value=''></option>
									<option value='YES'>YES</option>
									<option value='NO'>NO</option>
								</Select>
							</div>
							<div className='col-span-12 lg:col-span-2'>
								<Label htmlFor='temporaryItem'>Temporary Item</Label>
								<Select
									id='temporaryItem'
									name='temporaryItem'
									value={formik.values.temporaryItem}
									onChange={formik.handleChange}
									onBlur={formik.handleBlur}
									disabled={!privileges.canWrite()}>
									<option value=''></option>
									<option value='YES'>YES</option>
									<option value='NO'>NO</option>
								</Select>
							</div>
							<div className='col-span-12 lg:col-span-2'>
								<Label htmlFor='stockStatus'>Stock Status</Label>
								<Select
									id='stockStatus'
									name='stockStatus'
									value={formik.values.stockStatus}
									onChange={formik.handleChange}
									onBlur={formik.handleBlur}
									disabled={!privileges.canWrite()}>
									<option value=''></option>
									<option value='YES'>YES</option>
									<option value='NO'>NO</option>
								</Select>
							</div>
							<div className='col-span-12 lg:col-span-12'>
								<hr className='w-90  mx-auto h-1 rounded border-0 bg-gray-100 dark:bg-gray-700 md:my-10' />
							</div>

							<div className='col-span-12 row-span-6 lg:col-span-6 '>
								{/* Render additionalFields div structure */}
								<Label htmlFor='procurmentUOM'>
									Procurement UOM
									<span className='ml-1 text-red-500'>*</span>
								</Label>
								{formik?.values?.procurementUOM?.map((field: any, index: any) => (
									<div key={index} className='mt-2 flex gap-2'>
										<div style={{ width: '100%' }}>
											<Select
												id={`uom${index}`}
												name={`uom${index}`}
												value={field.uom}
												placeholder='Select UOM'
												onChange={handleUOMChange(index, 'uom')}>
												{uomOptions.map((option) => (
													<option value={option.label}>
														{option.label}
													</option>
												))}
											</Select>

											{formik.touched.procurementUOM?.[index]?.uom &&
												formik.errors.procurementUOM?.[index]?.uom && (
													<div className='text-red-500'>
														{formik.errors.procurementUOM[index].uom}
													</div>
												)}
										</div>
										<div style={{ width: '100%' }}>
											<Input
												style={{ marginLeft: '2px' }}
												type='number'
												min={0}
												id={`quantity${index}`}
												name={`quantity${index}`}
												value={field.quantity}
												placeholder='Quantity'
												onChange={handleUOMChange(index, 'quantity')}
											/>

											{formik.touched.procurementUOM?.[index]?.quantity &&
												formik.errors.procurementUOM?.[index]?.quantity && (
													<div className='text-red-500'>
														{
															formik.errors.procurementUOM[index]
																.quantity
														}
													</div>
												)}
										</div>
										<div className='flex items-end justify-end'>
											{formik?.values?.procurementUOM?.length > 1 && (
												<Button
													type='button'
													onClick={() => handleDeleteUOM(index)}
													variant='outlined'
													color='red'
													className='w-24'
													isDisable={!privileges.canWrite()}>
													<svg
														xmlns='http://www.w3.org/2000/svg'
														fill='none'
														viewBox='0 0 24 24'
														strokeWidth='1.5'
														strokeLinecap='round'
														strokeLinejoin='round'
														stroke='currentColor'
														data-slot='icon'
														className='h-6 w-6'>
														<path d='M6 18 18 6M6 6l12 12' />
													</svg>
												</Button>
											)}
										</div>
									</div>
								))}

								{/* Add More Button for additionalFields */}
								<Button
									className='mt-2'
									variant='solid'
									type='button'
									onClick={handleAddUOMClick}
									isDisable={!privileges.canWrite()}>
									Add More
								</Button>
							</div>

							<div className='col-span-12 lg:col-span-2'>
								<Label htmlFor='pricingUOM'>
									Pricing UOM
									<span className='ml-1 text-red-500'>*</span>
								</Label>
								<Select
									id='pricingUOM'
									name='pricingUOM'
									value={formik.values.pricingUOM}
									placeholder='Select UOM'
									onChange={formik.handleChange}
									onBlur={formik.handleBlur}
									disabled={!privileges.canWrite()}>
									{uomOptions.map((option) => (
										<option key={option.value} value={option.value}>
											{option.label}
										</option>
									))}
								</Select>
								{formik.touched.pricingUOM && formik.errors.pricingUOM ? (
									<div className='text-red-500'>{formik.errors.pricingUOM}</div>
								) : null}
							</div>

							<div className='col-span-12 lg:col-span-2'>
								<Label htmlFor='pricingQuantity'>
									Quantity
									<span className='ml-1 text-red-500'>*</span>
								</Label>
								<Input
									type='number'
									min={0}
									id='pricingQuantity'
									name='pricingQuantity'
									onChange={formik.handleChange}
									value={formik.values.pricingQuantity}
									onBlur={formik.handleBlur}
								/>
								{formik.touched.pricingQuantity && formik.errors.pricingQuantity ? (
									<div className='text-red-500'>
										{formik.errors.pricingQuantity}
									</div>
								) : null}
							</div>
							<div className='col-span-12 lg:col-span-2'>
								<Label htmlFor='pricingCost'>
									Cost
									<span className='ml-1 text-red-500'>*</span>
								</Label>
								<FieldWrap firstSuffix={<div className='mx-2'>$</div>}>
									<Input
										type='number'
										min={0}
										id='pricingCost'
										className='pl-7'
										name='pricingCost'
										onChange={formik.handleChange}
										value={formik.values.pricingCost}
										onBlur={formik.handleBlur}
									/>
								</FieldWrap>
								{formik.touched.pricingCost && formik.errors.pricingCost ? (
									<div className='text-red-500'>{formik.errors.pricingCost}</div>
								) : null}
							</div>
							<div className='col-span-12 lg:col-span-6'></div>
							<div className='col-span-12 lg:col-span-3'>
								<Label htmlFor='startDate'>Start Date</Label>
								<Input
									id='startDate'
									name='startDate'
									type='date'
									onChange={formik.handleChange}
									value={formik.values.startDate}
									onBlur={formik.handleBlur}
									disabled={!privileges.canWrite()}
								/>
								{formik.touched.startDate && formik.errors.startDate ? (
									<div className='text-red-500'>{formik.errors.startDate}</div>
								) : null}
							</div>
							<div className='col-span-12 lg:col-span-3'>
								<Label htmlFor='endDate'>End Date</Label>
								<Input
									id='endDate'
									name='endDate'
									type='date'
									onChange={formik.handleChange}
									value={formik.values.endDate}
									onBlur={formik.handleBlur}
									disabled={!privileges.canWrite()}
								/>
								{formik.touched.endDate && formik.errors.endDate ? (
									<div className='text-red-500'>{formik.errors.endDate}</div>
								) : null}
							</div>
							<div className='col-span-12 lg:col-span-12'>
								<hr className='w-90  mx-auto h-1 rounded border-0 bg-gray-100 dark:bg-gray-700 md:my-10' />
							</div>
							<div className='col-span-12 lg:col-span-2'>
								<Label htmlFor='shippingCost'>Shipping Cost</Label>
								<FieldWrap firstSuffix={<div className='mx-2'>$</div>}>
									<Input
										type='number'
										min={0}
										id='shippingCost'
										className='pl-7'
										name='shippingCost'
										onChange={formik.handleChange}
										value={formik.values.shippingCost}
										onBlur={formik.handleBlur}
									/>
								</FieldWrap>
								{formik.touched.shippingCost && formik.errors.shippingCost ? (
									<div className='text-red-500'>{formik.errors.shippingCost}</div>
								) : null}
							</div>
							<div className='col-span-12 lg:col-span-2'>
								<Label htmlFor='importDuty'>Import Duty</Label>
								<FieldWrap firstSuffix={<div className='mx-2'>$</div>}>
									<Input
										type='number'
										min={0}
										id='importDuty'
										className='pl-7'
										name='importDuty'
										onChange={formik.handleChange}
										value={formik.values.importDuty}
										onBlur={formik.handleBlur}
									/>
								</FieldWrap>
								{formik.touched.importDuty && formik.errors.importDuty ? (
									<div className='text-red-500'>{formik.errors.importDuty}</div>
								) : null}
							</div>
							<div className='col-span-12 lg:col-span-2'>
								<Label htmlFor='fees'>Fees</Label>
								<FieldWrap firstSuffix={<div className='mx-2'>$</div>}>
									<Input
										type='number'
										min={0}
										id='fees'
										className='pl-7'
										name='fees'
										onChange={formik.handleChange}
										value={formik.values.fees}
										onBlur={formik.handleBlur}
									/>
								</FieldWrap>
								{formik.touched.fees && formik.errors.fees ? (
									<div className='text-red-500'>{formik.errors.fees}</div>
								) : null}
							</div>
							<div className='col-span-12 lg:col-span-2'>
								<Label htmlFor='taxes'>Taxes</Label>
								<FieldWrap firstSuffix={<div className='mx-2'>$</div>}>
									<Input
										type='number'
										min={0}
										id='taxes'
										className='pl-7'
										name='taxes'
										onChange={formik.handleChange}
										value={formik.values.taxes}
										onBlur={formik.handleBlur}
									/>
								</FieldWrap>
								{formik.touched.taxes && formik.errors.taxes ? (
									<div className='text-red-500'>{formik.errors.taxes}</div>
								) : null}
							</div>
							<div className='col-span-12 lg:col-span-2'>
								<Label htmlFor='miscCost'>Misc</Label>
								<FieldWrap firstSuffix={<div className='mx-2'>$</div>}>
									<Input
										type='number'
										min={0}
										id='miscCost'
										className='pl-7'
										name='miscCost'
										onChange={formik.handleChange}
										value={formik.values.miscCost}
										onBlur={formik.handleBlur}
									/>
								</FieldWrap>
								{formik.touched.miscCost && formik.errors.miscCost ? (
									<div className='text-red-500'>{formik.errors.miscCost}</div>
								) : null}
							</div>
							<div className='col-span-12 lg:col-span-12'>
								<hr className='w-90  mx-auto h-1 rounded border-0 bg-gray-100 dark:bg-gray-700 md:my-10' />
							</div>
							<div className='col-span-12 flex flex-col gap-1 xl:col-span-12'>
								<Label htmlFor='VendorNotes' style={{ fontSize: '16px' }}>
									Vendor Notes
								</Label>
								<div className='mt-1 grid grid-cols-6 gap-1'>
									{formik?.values?.vendorNotes?.map(
										(vendorNote: any, index: any) => (
											<div key={index} className='col-span-12'>
												<Textarea
													id={`vendorNotes[${index}]`}
													name={`vendorNotes[${index}]`}
													onChange={(event) =>
														handleChangeVendorNotes(event, index)
													}
													value={vendorNote}
													onBlur={formik.handleBlur}
													placeholder={`Vendor Note ${index + 1}`}
													className='mr-2'
													disabled={!privileges.canWrite()}
												/>

												{formik.touched.vendorNotes &&
													formik.errors.vendorNotes &&
													formik.errors.vendorNotes[index] && (
														<div className='text-red-500'>
															{formik.errors.vendorNotes[index]}
														</div>
													)}
											</div>
										),
									)}
									<Button
										type='button'
										onClick={handleAddVendorNote}
										variant='outline'
										color='zinc'
										size='lg'
										className='w-64'
										isDisable={!privileges.canWrite()}>
										Add Vendor Note
									</Button>
								</div>
							</div>
						</div>
					</div>
					<div className='col-span-1 flex items-end justify-end'>
						<Button
							variant='solid'
							color='blue'
							type='button'
							onClick={saveDataToFirestore}>
							{formik.values.isEdit === true ? 'Update' : 'Save'}
						</Button>
					</div>
				</CardBody>
			</Card>
		</div>
	);
};

export default VendorModal;
