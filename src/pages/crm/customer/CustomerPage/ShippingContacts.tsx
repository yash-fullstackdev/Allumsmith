import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import Card, { CardBody } from '../../../../components/ui/Card';
import Label from '../../../../components/form/Label';
import Input from '../../../../components/form/Input';
import Select from '../../../../components/form/Select';
import Button from '../../../../components/ui/Button';
import countryDb from '../../../../mocks/db/country.db';
import statesDb from '../../../../mocks/db/states.db';
import Textarea from '../../../../components/form/Textarea';
import { handleInputChange } from '../../../../utils/capitalizedFunction.util';

const ShippingContacts = ({
	formik,
	contacts,
	onSave,
	customerNumber,
	setContacts,
	masterSettings,
}: any) => {
	const formatZipCode = (inputZip: string) => {
		const numericPart = inputZip.replace(/\D/g, '');
		if (numericPart.length <= 5) {
			return numericPart;
		}
		if (numericPart.length <= 9) {
			return `${numericPart.slice(0, 5)}-${numericPart.slice(5, 9)}`;
		}
		return `${numericPart.slice(0, 5)}-${numericPart.slice(5, 9)}${numericPart.slice(9)}`;
	};

	const formatPhoneNumber = (inputNumber: any) => {
		const numericPart = inputNumber.replace(/\D/g, '');

		if (numericPart.length === 0) {
			return '';
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

	const saveDataToFirestore = async () => {
		try {
			const check = await formik.validateForm();

			if (Object.keys(check).length > 0) {
				console.log(check);
				Object.keys(check).forEach((errorField) => {
					formik.setFieldTouched(errorField, true, false);
					formik.setFieldError(errorField, check[errorField]);
				});

				toast.error(`Please fill all the Mandatory fields`);
				return;
			}

			const newContact = formik.values;
			setContacts([...contacts, newContact]);

			onSave(formik.values, customerNumber, formik.values.isEdit); //isEdit is a boolean value to check that user is already existing or new
			formik.resetForm();
		} catch (error: any) {
			console.error('Error saving data to Firestore: ', error);
			toast.error('error', error);
		}
	};

	return (
		<div className='col-span-12 flex flex-col gap-4 xl:col-span-6'>
			<Card>
				<CardBody>
					<div>
						<div className='mt-4 grid grid-cols-12 gap-4'>
							<div className='col-span-12 lg:col-span-4'>
								<Label htmlFor='SCshipToCode'>Ship to Code</Label>
								<Input
									id='SCshipToCode'
									name='SCshipToCode'
									value={formik.values.SCshipToCode}
									disabled
								/>
							</div>
							<div className='col-span-12 lg:col-span-4'>
								<Label htmlFor='SCshippingLocation'>
									Ship to Name
									<span className='ml-1 text-red-500'>*</span>
								</Label>
								<Input
									id='SCshippingLocation'
									name='SCshippingLocation'
									onChange={handleInputChange(formik.setFieldValue)(
										'SCshippingLocation',
									)}
									value={formik.values.SCshippingLocation}
									onBlur={formik.handleBlur}
								/>
								{formik.touched?.SCshippingLocation &&
									formik.errors?.SCshippingLocation && (
										<div className='text-red-500'>
											{formik.errors.SCshippingLocation}
										</div>
									)}
							</div>

							<div className='col-span-12 lg:col-span-4'>
								<Label htmlFor='locationContactPerson'>
									Location Contact Person
								</Label>
								<Input
									id='locationContactPerson'
									name='SClocationContactPerson'
									onChange={handleInputChange(formik.setFieldValue)(
										'SClocationContactPerson',
									)}
									value={formik.values.SClocationContactPerson}
									onBlur={formik.handleBlur}
								/>
								{formik.touched?.SClocationContactPerson &&
									formik.errors?.SClocationContactPerson && (
										<div className='text-red-500'>
											{formik.errors.SClocationContactPerson}
										</div>
									)}
							</div>

							<div className='col-span-12 lg:col-span-3'>
								<Label htmlFor='SCphone'>Phone</Label>
								<Input
									id='SCphone'
									name='SCphone'
									onChange={(e) => {
										const formattedPhoneNumber = formatPhoneNumber(
											e.target.value,
										);
										formik.handleChange(e);
										formik.setFieldValue(`SCphone`, formattedPhoneNumber);
									}}
									value={formik.values.SCphone}
									onBlur={formik.handleBlur}
								/>
								{formik.touched.SCphone && formik.errors.SCphone && (
									<div className='text-red-500'>{formik.errors.SCphone}</div>
								)}
							</div>
							<div className='col-span-1 lg:col-span-1'>
								<Label htmlFor='SCphoneExt'>Ext.</Label>
								<Input
									id='SCphoneExt'
									name='SCphoneExt'
									type='number'
									onChange={formik.handleChange}
									value={formik.values.SCphoneExt}
									onBlur={formik.handleBlur}
								/>
							</div>

							<div className='col-span-12 lg:col-span-4'>
								<Label htmlFor='SCemail'>Email</Label>
								<Input
									id='SCemail'
									name='SCemail'
									onChange={handleInputChange(formik.setFieldValue)('SCemail')}
									value={formik.values.SCemail}
									multiple
									onBlur={formik.handleBlur}
								/>
								{formik.touched.SCemail && formik.errors.SCemail && (
									<div className='text-red-500'>{formik.errors.SCemail}</div>
								)}
							</div>

							<div className='col-span-12 lg:col-span-4'>
								<Label htmlFor='SCcontactAddress1'>
									Address 1<span className='ml-1 text-red-500'>*</span>
								</Label>
								<Input
									id='SCcontactAddress1'
									name='SCcontactAddress1'
									onChange={handleInputChange(formik.setFieldValue)(
										'SCcontactAddress1',
									)}
									value={formik.values.SCcontactAddress1}
									onBlur={formik.handleBlur}
								/>
								{formik.touched.SCcontactAddress1 &&
									formik.errors.SCcontactAddress1 && (
										<div className='text-red-500'>
											{formik.errors.SCcontactAddress1}
										</div>
									)}
							</div>

							<div className='col-span-12 lg:col-span-4'>
								<Label htmlFor='SCcontactAddress2'>Address 2</Label>
								<Input
									id='SCcontactAddress2'
									name='SCcontactAddress2'
									onChange={handleInputChange(formik.setFieldValue)(
										'SCcontactAddress2',
									)}
									value={formik.values.SCcontactAddress2}
									onBlur={formik.handleBlur}
								/>
							</div>

							<div className='col-span-12 lg:col-span-4'>
								<Label htmlFor='SCcontactAddress3'>Address 3</Label>
								<Input
									id='SCcontactAddress3'
									name='SCcontactAddress3'
									onChange={handleInputChange(formik.setFieldValue)(
										'SCcontactAddress3',
									)}
									value={formik.values.SCcontactAddress3}
									onBlur={formik.handleBlur}
								/>
								{formik.touched.SCcontactAddress3 &&
								formik.errors.SCcontactAddress3 ? (
									<div className='text-red-500'>
										{formik.errors.SCcontactAddress3}
									</div>
								) : null}
							</div>
							<div className='col-span-12 lg:col-span-4'>
								<Label htmlFor='SCcity'>
									City
									<span className='ml-1 text-red-500'>*</span>
								</Label>
								<Input
									id='SCcity'
									name='SCcity'
									onChange={handleInputChange(formik.setFieldValue)('SCcity')}
									value={formik.values.SCcity}
									onBlur={formik.handleBlur}
								/>
								{formik.touched.SCcity && formik.errors?.SCcity && (
									<div className='text-red-500'>{formik.errors.SCcity}</div>
								)}
							</div>

							<div className='col-span-12 lg:col-span-4'>
								<Label htmlFor='SCcontactState'>
									State
									<span className='ml-1 text-red-500'>*</span>
								</Label>
								<Select
									id='SCcontactState'
									name='SCstate'
									value={formik.values.SCstate}
									onChange={formik.handleChange}
									onBlur={formik.handleBlur}>
									<option value='' label='Select State' />
									{statesDb.map((state: any) => (
										<option key={state.id} value={state.name}>
											{state.name}
										</option>
									))}
								</Select>

								{formik.touched.SCstate && formik.errors.SCstate && (
									<div className='text-red-500'>{formik.errors.SCstate}</div>
								)}
							</div>

							<div className='col-span-12 lg:col-span-4'>
								<Label htmlFor='zipcode'>
									Zip Code
									<span className='ml-1 text-red-500'>*</span>
								</Label>
								<Input
									id='zipcode'
									name='SCzipcode'
									maxLength={10}
									onChange={(e) => {
										// Format zip code as user types
										const formattedZipCode = formatZipCode(e.target.value);
										formik.handleChange(e);
										formik.setFieldValue(`SCzipcode`, formattedZipCode);
										formik.setFieldValue('');
									}}
									value={formik.values.SCzipcode}
									onBlur={formik.handleBlur}
								/>
								{formik.touched.SCzipcode && formik.errors.SCzipcode ? (
									<div className='text-red-500'>{formik.errors.SCzipcode}</div>
								) : null}
							</div>

							<div className='col-span-12 lg:col-span-4'>
								<Label htmlFor='Sccountry'>
									Country
									<span className='ml-1 text-red-500'>*</span>
								</Label>
								<Select
									id='Sccountry'
									name='SCcountry'
									value={formik.values.SCcountry}
									placeholder='Select Country'
									onChange={formik.handleChange}
									onBlur={formik.handleBlur}>
									{countryDb.map((country: any) => (
										<option key={country.id} value={country.name}>
											{country.name}
										</option>
									))}
								</Select>
								{formik.touched.SCcountry && formik.errors.SCcountry ? (
									<div className='text-red-500'>{formik.errors.SCcountry}</div>
								) : null}
							</div>

							<div className='col-span-12 lg:col-span-4'>
								<Label htmlFor='res/comm'>
									Res/Comm
									<span className='ml-1 text-red-500'>*</span>
								</Label>
								<Select
									id='res/comm'
									name='SCressComm'
									onChange={(e) => {
										formik.handleChange(e);
									}}
									value={formik.values.SCressComm}>
									<option value=''>Select Address Type</option>
									<option
										value='RESIDENTIAL ADDRESS'
										label='RESIDENTIAL ADDRESS'
									/>
									<option value='COMMERCIAL ADDRESS' label='COMMERCIAL ADDRESS' />
								</Select>
								{formik.touched.SCressComm && formik.errors.SCressComm ? (
									<div className='text-red-500'>{formik.errors.SCressComm}</div>
								) : null}
							</div>

							<div className='col-span-12 lg:col-span-4'>
								<Label htmlFor='shipMethod'>Ship Method</Label>
								<Select
									id='shipMethod'
									name='SCshipMethod'
									onChange={(e) => {
										// handleStateChange(e);
										formik.handleChange(e);
									}}
									value={formik.values.SCshipMethod}
									// onBlur={formik.handleBlur}
								>
									<option value=''>Select</option>
									{masterSettings.shippingMethod &&
										masterSettings.shippingMethod.map((option: string) => (
											<option key={option} value={option}>
												{option}
											</option>
										))}
								</Select>
								{formik.touched.SCshipMethod && formik.errors.SCshipMethod ? (
									<div className='text-red-500'>{formik.errors.SCshipMethod}</div>
								) : null}
							</div>
							<div className='col-span-12 lg:col-span-4'>
								<Label htmlFor='shippingACnumber'>Shipping A/C Number</Label>
								<Input
									id='shippingACnumber'
									name='SCshippingACnumber'
									onChange={handleInputChange(formik.setFieldValue)(
										'SCshippingACnumber',
									)}
									value={formik.values.SCshippingACnumber}
									onBlur={formik.handleBlur}
								/>
							</div>
							<div className='col-span-12 lg:col-span-4'>
								<Label htmlFor='alternateShipMethod'>Alternate Ship Method</Label>
								<Select
									id='alternateShipMethod'
									name='SCalternateShipMethod'
									onChange={(e) => {
										// handleStateChange(e);
										formik.handleChange(e);
									}}
									value={formik.values.SCalternateShipMethod}
									onBlur={formik.handleBlur}>
									<option value=''>Select</option>
									{masterSettings.shippingMethod &&
										masterSettings.shippingMethod.map((option: string) => (
											<option key={option} value={option}>
												{option}
											</option>
										))}
								</Select>
								{formik.touched.SCalternateShipMethod &&
								formik.errors.SCalternateShipMethod ? (
									<div className='text-red-500'>
										{formik.errors.SCalternateShipMethod}
									</div>
								) : null}
							</div>
							<div className='col-span-12 lg:col-span-4'>
								<Label htmlFor='alternateShippingACnumber'>
									Alternate Shipping A/C Number
								</Label>
								<Input
									id='alternateShippingACnumber'
									name='SCalternateShippingACnumber'
									onChange={handleInputChange(formik.setFieldValue)(
										'SCalternateShippingACnumber',
									)}
									value={formik.values.SCalternateShippingACnumber}
									onBlur={formik.handleBlur}
								/>
							</div>

							<div className='col-span-12 lg:col-span-4'>
								<Label htmlFor='shipZone'>Ship Zone</Label>
								<Input
									id='shipZone'
									name='SCshipZone'
									onChange={handleInputChange(formik.setFieldValue)('SCshipZone')}
									value={formik.values.SCshipZone}
									onBlur={formik.handleBlur}
								/>
								{formik.touched.SCshipZone && formik.errors.SCshipZone ? (
									<div className='text-red-500'>{formik.errors.SCshipZone}</div>
								) : null}
							</div>

							<div className='col-span-12 lg:col-span-12'>
								<Label htmlFor='shippingNote'>Shipping Note</Label>
								<Textarea
									id='shippingNote'
									name='SCshippingNote'
									onChange={handleInputChange(formik.setFieldValue)(
										'SCshippingNote',
									)}
									value={formik.values.SCshippingNote}
									onBlur={formik.handleBlur}
								/>
							</div>
						</div>

						<hr className='w-90  mx-auto h-1 rounded border-0 bg-gray-100 dark:bg-gray-700 md:my-10' />
					</div>
					<div className='col-span-1 flex items-end justify-end'>
						<Button
							variant='solid'
							color='blue'
							type='button'
							onClick={saveDataToFirestore}>
							Add Shipping Contact
						</Button>
					</div>
				</CardBody>
			</Card>
		</div>
	);
};

export default ShippingContacts;
