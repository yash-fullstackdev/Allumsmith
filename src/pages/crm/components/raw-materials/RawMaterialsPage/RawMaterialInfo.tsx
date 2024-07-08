import { FieldWrap, Input, Label, Select, Textarea } from '../../../../../components/form';
import { Button, Card, CardBody } from '../../../../../components/ui';
import Collapse from '../../../../../components/utils/Collapse';
import getUserRights from '../../../../../hooks/useUserRights';
import { handleInputChange } from '../../../../../utils/capitalizedFunction.util';
import VendorTable from './vendorTable';
import { useEffect } from 'react';

const RawMaterialForm = ({
	formik,
	childFormik,
	accordionStates,
	setAccordionStates,
	vendors,
	vendorData,
	setVendorData,
	selectedFile,
	handleFileChange,
	handleEditClick,
	setScModal,
	scModal,
	onSave,
	rawMaterialsType,
	rawMaterialSubTypes,
	setRawMaterialSubTypes,
}: any) => {
	// console.log('formik test', formik)
	const privileges = getUserRights('components');
	const handleChangeNotes = (event: React.ChangeEvent<HTMLTextAreaElement>, index: number) => {
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
		const newNotes = [...formik.values.notes];
		newNotes[index] = formattedValue;
		formik.setFieldValue('notes', newNotes);

		// Schedule a microtask to set the cursor position after the re-render
		Promise.resolve().then(() => {
			if (target !== undefined) {
				target.setSelectionRange(storedCursorPosition, storedCursorPosition);
			}
		});
	};

	const handleAddNote = () => {
		formik.setFieldValue('notes', [...formik.values.notes, '']);
	};

	const handleRawMaterialChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
		const selectedRawMaterial = event.target.value;
		formik.setFieldValue('rawMaterialType', selectedRawMaterial);

		const options = rawMaterialsType[selectedRawMaterial] || [];
		setRawMaterialSubTypes(options);

		formik.setFieldValue('rawMaterialSubType', '');
	};

	const handlePreferredVendorChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
		const preferredVendor = event.target.value;
		console.log(preferredVendor);

		formik.setFieldValue('preferredVendor', preferredVendor);
		recalculateComponentStandardPricing(preferredVendor);
	};

	function recalculateComponentStandardPricing(preferredVendor: string) {
		console.log(preferredVendor);
		console.log(vendorData);

		let componentStandardPricing = 0;
		vendorData.forEach((item: any) => {
			if (item.vendorName === preferredVendor) {
				componentStandardPricing = item.standardPricing;
			}
		});
		console.log(componentStandardPricing);

		formik.setFieldValue('componentStandardPricing', componentStandardPricing);
	}
	useEffect(() => {
		console.log("Vendor data has Changed");
		recalculateComponentStandardPricing(formik.values.preferredVendor); // Call the function to recalculate when vendorData changes
	}, [vendorData]);
	return (
		<div className='col-span-12 flex flex-col gap-1 xl:col-span-6'>
			<Card>
				<CardBody>
					<div className='flex'>
						<div className='bold w-full'>
							<Button
								variant='outlined'
								className='flex w-full items-center justify-between rounded-none border-b px-[2px] py-[0px] text-start text-lg font-bold'
								onClick={() =>
									setAccordionStates({
										...accordionStates,
										rawMaterialInfo: !accordionStates.rawMaterialInfo,
									})
								}
								rightIcon={
									!accordionStates.rawMaterialInfo
										? 'HeroChevronUp'
										: 'HeroChevronDown'
								}>
								Raw Materials Info
							</Button>
						</div>
					</div>
					<Collapse isOpen={!accordionStates.rawMaterialInfo}>
						<div className='mt-4 grid grid-cols-12 gap-1'>
							<div className='col-span-12 lg:col-span-6'>
								<Label htmlFor='componentID' require={true}>
									Component ID
								</Label>
								<Input
									id='componentID'
									name='componentID'
									value={formik.values.componentID}
									onChange={handleInputChange(formik.setFieldValue)(
										'componentID',
									)}
									onBlur={formik.handleBlur}
									disabled={!privileges.canWrite()}
								/>
								{formik.touched.componentID && formik.errors.componentID ? (
									<div className='text-red-500'>{formik.errors.componentID}</div>
								) : null}
							</div>
							<div className='col-span-12 lg:col-span-3'>
								<Label htmlFor='status'>
									Status
									<span className='ml-1 text-red-500 '>*</span>
								</Label>
								<Select
									id='status'
									name='status'
									value={formik.values.status}
									placeholder='Select Status'
									onChange={formik.handleChange}
									onBlur={formik.handleBlur}
									disabled={!privileges.canWrite()}>
									<option value='ACTIVE'>ACTIVE</option>
									<option value='INACTIVE'>INACTIVE</option>
								</Select>
								{formik.touched.status && formik.errors.status ? (
									<div className='text-red-500'>{formik.errors.status}</div>
								) : null}
							</div>
							<div className='col-span-12 lg:col-span-3 '>
								<Label htmlFor='photoUpload'>Image Upload</Label>
								<input
									id='photoUpload'
									type='file'
									accept='image/*'
									name='photoUpload'
									onChange={handleFileChange}
									value={formik.values.photoUpload}
									disabled={!privileges.canWrite()}
								/>

								{/* {selectedFile && (
									<div>
										{selectedFile.type && selectedFile.type.startsWith('image/') && (
											<img src={URL.createObjectURL(selectedFile)} alt="Preview" className="w-full rounded" />
										)}
									</div>
								)} */}

								{/* {formik.values?.imageFiles && formik.values?.imageFiles.length > 0 && formik.values.imageFiles?.map((image: any, index: number) => {
									return (
										<div className='file-item' key={index}>
											<a
												className='file-name text-blue-500'
												target='_blank'
												href={image.location}>
												{image.originalName}
											</a>
										</div>
									);
								})} */}
							</div>
							<div className='col-span-12 lg:col-span-6'>
								<Label htmlFor='description1'>
									Description 1<span className='ml-1 text-red-500 '>*</span>
								</Label>
								<Input
									id='description1'
									name='description1'
									onChange={handleInputChange(formik.setFieldValue)(
										'description1',
									)}
									value={formik.values.description1}
									onBlur={formik.handleBlur}
									required
									disabled={!privileges.canWrite()}
								/>
								{formik.touched.description1 && formik.errors.description1 ? (
									<div className='text-red-500'>{formik.errors.description1}</div>
								) : null}
							</div>
							<div className='col-span-12 lg:col-span-3'>
								<Label htmlFor='sterileNonSterile'>
									Sterile/Non Sterile
									<span className='ml-1 text-red-500 '>*</span>
								</Label>
								<Select
									id='sterileNonSterile'
									name='sterileNonSterile'
									value={formik.values.sterileNonSterile}
									placeholder='Select Sterile/Non Sterile'
									onChange={formik.handleChange}
									onBlur={formik.handleBlur}
									disabled={!privileges.canWrite()}>
									<option value='STERILE'>STERILE</option>
									<option value='NON STERILE'>NON STERILE</option>
								</Select>
								{formik.touched.sterileNonSterile &&
									formik.errors.sterileNonSterile ? (
									<div className='text-red-500'>
										{formik.errors.sterileNonSterile}
									</div>
								) : null}
							</div>
							<div
								className='col-span-12 row-span-2 lg:col-span-3'
								style={{
									display: 'flex',
									justifyContent: 'center',
									alignItems: 'center',
								}}>
								{selectedFile && (
									<div>
										{selectedFile.type &&
											selectedFile.type.startsWith('image/') && (
												<img
													src={URL.createObjectURL(selectedFile)}
													alt='Preview'
													className='w-full rounded'
													style={{ maxHeight: '100px' }}
												/>
											)}
									</div>
								)}
								{formik.values?.imageFiles &&
									formik.values?.imageFiles.length > 0 &&
									formik.values.imageFiles?.map((image: any, index: number) => {
										return (
											// <div className='file-item' key={index}>
											// 	{!selectedFile && (
											// 		<a
											// 			className='file-name text-blue-500'
											// 			target='_blank'
											// 			href={image.location}>
											// 			{image.originalName}
											// 		</a>
											// 	)}
											// 	{!selectedFile && <img src={image.location} />}
											// </div>
											<div className='file-item' key={index}>
												{!selectedFile && (
													<a
														className='file-name text-blue-500'
														target='_blank'
														href={image.location}
														style={{
															display: 'flex',
															justifyContent: 'center',
															alignItems: 'center',
														}}>
														<img
															src={image.location}
															alt='Image'
															style={{ maxHeight: '100px' }}
														/>{' '}
													</a>
												)}
											</div>
										);
									})}
							</div>

							<div className='col-span-12 lg:col-span-6'>
								<Label htmlFor='description2'>Description 2</Label>
								<Input
									id='description2'
									name='description2'
									onChange={handleInputChange(formik.setFieldValue)(
										'description2',
									)}
									value={formik.values.description2}
									onBlur={formik.handleBlur}
									required
									disabled={!privileges.canWrite()}
								/>
								{formik.touched.description2 && formik.errors.description2 ? (
									<div className='text-red-500'>{formik.errors.description2}</div>
								) : null}
							</div>
							<div className='col-span-12 lg:col-span-3'>
								<Label htmlFor='componentType'>Component Type</Label>
								<Input
									id='componentType'
									name='componentType'
									value='RAW MATERIAL PURCHASE'
									onBlur={formik.handleBlur}
									disabled></Input>
								{formik.touched.componentType && formik.errors.componentType ? (
									<div className='text-red-500'>
										{formik.errors.componentType}
									</div>
								) : null}
							</div>
							<div className='col-span-12 lg:col-span-6'>
								<Label htmlFor='description3'>Description 3</Label>
								<Input
									id='description3'
									name='description3'
									onChange={handleInputChange(formik.setFieldValue)(
										'description3',
									)}
									value={formik.values.description3}
									onBlur={formik.handleBlur}
									disabled={!privileges.canWrite()}
								/>
							</div>
							<div className='col-span-12 lg:col-span-3'>
								<Label htmlFor='rawMaterialType'>Raw Material Type</Label>
								<Select
									id='rawMaterialType'
									name='rawMaterialType'
									value={formik.values.rawMaterialType}
									placeholder='Select Raw Material Type'
									onChange={handleRawMaterialChange}
									onBlur={formik.handleBlur}
									disabled={!privileges.canWrite()}>
									{/* {rawMaterialsType.map((material, index) => (
										<option key={index} value={material}>
											{material}
										</option>
									))} */}
									{Object.keys(rawMaterialsType).map((material, index) => (
										<option key={index} value={material}>
											{material}
										</option>
									))}
								</Select>
								{formik.touched.rawMaterialType && formik.errors.rawMaterialType ? (
									<div className='text-red-500'>
										{formik.errors.rawMaterialType}
									</div>
								) : null}
							</div>
							<div className='col-span-12 lg:col-span-3'>
								<Label htmlFor='rawMaterialSubType'>Sub Type</Label>
								<Select
									id='rawMaterialSubType'
									name='rawMaterialSubType'
									value={formik.values.rawMaterialSubType}
									placeholder='Select Sub Type'
									onChange={formik.handleChange}
									onBlur={formik.handleBlur}
									disabled={!privileges.canWrite()}>
									{rawMaterialSubTypes.map((option: any, index: any) => (
										<option key={index} value={option}>
											{option}
										</option>
									))}
								</Select>
								{/* {formik.touched.rawMaterialSubType && formik.errors.rawMaterialSubType ? (
									<div className='text-red-500'>
										{formik.errors.rawMaterialSubType}
									</div>
								) : null} */}
							</div>

							<div className='col-span-12 lg:col-span-12'>
								<hr className='w-90  mx-auto h-1 rounded border-0 bg-gray-100 dark:bg-gray-700 md:my-2' />
							</div>
							<div className='col-span-12 lg:col-span-4'>
								<Label htmlFor='preferredVendor'>Preferred Vendor</Label>
								<Select
									id='preferredVendor'
									name='preferredVendor'
									value={formik.values.preferredVendor}
									placeholder='Select Vendor'
									onChange={handlePreferredVendorChange}
									onBlur={formik.handleBlur}
									disabled={!privileges.canWrite()}>
									{/* <option value='' disabled>Please Select Vendor</option> */}
									{vendorData &&
										vendorData.length > 0 &&
										vendorData.map((data: any) => (
											<option
												key={`${data?.vendorName}`}
												value={`${data?.vendorName}`}>{`${data?.vendorName?.split(
													'-',
												)[1]}`}</option>
										))}
								</Select>

								{formik.touched.preferredVendor && formik.errors.preferredVendor ? (
									<div className='text-red-500'>
										{formik.errors.preferredVendor}
									</div>
								) : null}
							</div>
							<div className='col-span-12 lg:col-span-4'>
								<Label htmlFor='componentStandardPricing'>
									Component Standard Pricing
								</Label>
								<FieldWrap firstSuffix={<div className='mx-2'>$</div>}>
									<Input
										id='componentStandardPricing'
										className='pl-7'
										name='componentStandardPricing'
										type='number'
										value={formik.values.componentStandardPricing}
										onBlur={formik.handleBlur}
										disabled
									/>
								</FieldWrap>
							</div>
							<div className='col-span-12 lg:col-span-2'>
								<Label htmlFor='invAlert'>Inventory Alert</Label>
								<Select
									id='invAlert'
									name='invAlert'
									value={formik.values.invAlert}
									onChange={formik.handleChange}
									onBlur={formik.handleBlur}
									disabled={!privileges.canWrite()}>
									<option value='YES'>YES</option>
									<option value='NO'>NO</option>
								</Select>
							</div>
							<div className='col-span-12 lg:col-span-2'>
								<Label htmlFor='alertQty'>Alert Quantity</Label>
								<Input
									id='alertQty'
									name='alertQty'
									type='number'
									min={0}
									value={formik.values.alertQty}
									onChange={formik.handleChange}
									disabled={
										formik.values.invAlert !== 'YES' || !privileges.canWrite()
									}
									onBlur={formik.handleBlur}
								/>
								{formik.touched.alertQty && formik.errors.alertQty ? (
									<div className='text-red-500'>{formik.errors.alertQty}</div>
								) : null}
							</div>
							<div className='col-span-12 lg:col-span-4'>
								<Label htmlFor='availableStock'>Available Stock</Label>
								<Input
									id='availableStock'
									name='availableStock'
									value='0'
									onBlur={formik.handleBlur}
									required
									disabled
								/>
								{formik.touched.availableStock && formik.errors.availableStock ? (
									<div className='text-red-500'>
										{formik.errors.availableStock}
									</div>
								) : null}
							</div>
							<div className='col-span-12 lg:col-span-4'>
								<Label htmlFor='inPickStock'>In Pick Stock</Label>
								<Input
									id='inPickStock'
									name='inPickStock'
									onChange={formik.handleChange}
									value='0'
									onBlur={formik.handleBlur}
									disabled
								/>
								{formik.touched.inPickStock && formik.errors.inPickStock ? (
									<div className='text-red-500'>{formik.errors.inPickStock}</div>
								) : null}
							</div>
							<div className='col-span-12 lg:col-span-4'>
								<Label htmlFor='pendingStock'>Pending Stock</Label>
								<Input
									id='pendingStock'
									name='pendingStock'
									onChange={formik.handleChange}
									value='0'
									onBlur={formik.handleBlur}
									disabled
								/>
								{formik.touched.pendingStock && formik.errors.pendingStock ? (
									<div className='text-red-500'>{formik.errors.pendingStock}</div>
								) : null}
							</div>
							<div className='col-span-12 lg:col-span-12'>
								<hr className='w-90  mx-auto h-1 rounded border-0 bg-gray-100 dark:bg-gray-700 md:my-4' />
							</div>
							<div className='col-span-12 flex flex-col gap-1 xl:col-span-12'>
								<Label htmlFor='PurchaseNotes' style={{ fontSize: '16px' }}>
									Purchase Notes
								</Label>
								<div className='mt-1 grid grid-cols-6 gap-1'>
									{formik?.values?.notes?.map((note: any, index: any) => (
										<div key={index} className='col-span-12'>
											<Textarea
												id={`notes[${index}]`}
												name={`notes[${index}]`}
												onChange={(event) =>
													handleChangeNotes(event, index)
												}
												value={note}
												onBlur={formik.handleBlur}
												placeholder={`Note ${index + 1}`}
												className='mr-2'
												disabled={!privileges.canWrite()}
											/>

											{formik.touched.notes &&
												formik.errors.notes &&
												formik.errors.notes[index] && (
													<div className='text-red-500'>
														{formik.errors.notes[index]}
													</div>
												)}
										</div>
									))}
									<Button
										type='button'
										onClick={handleAddNote}
										variant='outline'
										color='zinc'
										size='lg'
										className='w-64'
										isDisable={!privileges.canWrite()}>
										Add Note
									</Button>
								</div>
							</div>
							<div className='col-span-12 lg:col-span-4'>
								<Button variant='solid'>View Recent Purchase</Button>
							</div>
						</div>
					</Collapse>
				</CardBody>
			</Card>
			<div className='mt-4'>
				<VendorTable
					onSave={onSave}
					vendorDetails={vendors}
					formik={childFormik}
					vendorData={vendorData}
					setVendorData={setVendorData}
					handleEditClick={handleEditClick}
					setScModal={setScModal}
					scModal={scModal}
				/>
			</div>
		</div>
	);
};

export default RawMaterialForm;
