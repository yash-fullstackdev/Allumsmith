/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import React from 'react';
import Label from '../../../../components/form/Label';
import Input from '../../../../components/form/Input';
import Select from '../../../../components/form/Select';
import countryDb from '../../../../mocks/db/country.db';
import statesDb from '../../../../mocks/db/states.db';
import Card, { CardBody } from '../../../../components/ui/Card';
import Button from '../../../../components/ui/Button';
import Collapse from '../../../../components/utils/Collapse';
import getUserRights from '../../../../hooks/useUserRights';
import { handleInputChange } from '../../../../utils/capitalizedFunction.util';

const BillToAddress = ({ formik, accordionStates, setAccordionStates }: any) => {
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

	const privileges = getUserRights('customers');
	return (
		<div>
			<div className='col-span-12 flex flex-col gap-4 xl:col-span-6'>
				<Card>
					<CardBody>
						<div className='flex'>
							<div className='bold w-full'>
								<Button
									variant='outlined'
									className='flex w-full items-center justify-between rounded-none border-b px-[2px] py-[0px] text-lg font-bold'
									onClick={() =>
										setAccordionStates({
											...accordionStates,
											billToAddress: !accordionStates.billToAddress,
										})
									}
									rightIcon={
										!accordionStates.billToAddress
											? 'HeroChevronUp'
											: 'HeroChevronDown'
									}>
									Bill To Address
								</Button>
							</div>
						</div>

						<Collapse isOpen={!accordionStates.billToAddress}>
							<div className='mt-2 grid grid-cols-12 gap-1'>
								<div className='col-span-12 lg:col-span-4'>
									<Label htmlFor='billAddress'>Address 1</Label>
									<Input
										id='billAddress'
										name='billAddress'
										onChange={handleInputChange(formik.setFieldValue)(
											'billAddress',
										)}
										value={formik.values.billAddress}
										onBlur={formik.handleBlur}
										disabled={!privileges.canWrite()}
									/>
									{formik.touched.billAddress && formik.errors.billAddress ? (
										<div className='text-red-500'>
											{formik.errors.billAddress}
										</div>
									) : null}
								</div>
								<div className='col-span-12 lg:col-span-4'>
									<Label htmlFor='billAddress2'>Address 2</Label>
									<Input
										id='billAddress2'
										name='billAddress2'
										onChange={handleInputChange(formik.setFieldValue)(
											'billAddress2',
										)}
										value={formik.values.billAddress2}
										onBlur={formik.handleBlur}
										disabled={!privileges.canWrite()}
									/>
								</div>
								<div className='col-span-12 lg:col-span-4'>
									<Label htmlFor='billAddress3'>Address 3</Label>
									<Input
										id='billAddress3'
										name='billAddress3'
										onChange={handleInputChange(formik.setFieldValue)(
											'billAddress3',
										)}
										value={formik.values.billAddress3}
										onBlur={formik.handleBlur}
										disabled={!privileges.canWrite()}
									/>
								</div>
								<div className='col-span-12 lg:col-span-4'>
									<Label htmlFor='billCity'>City</Label>
									<Input
										id='billCity'
										name='billCity'
										onChange={handleInputChange(formik.setFieldValue)(
											'billCity',
										)}
										value={formik.values.billCity}
										onBlur={formik.handleBlur}
										disabled={!privileges.canWrite()}
									/>
									{formik.touched.billCity && formik.errors.billCity ? (
										<div className='text-red-500'>{formik.errors.billCity}</div>
									) : null}
								</div>
								<div className='col-span-12 lg:col-span-4'>
									<Label htmlFor='billState'>State</Label>
									<Select
										id='billState'
										name='billState'
										value={formik.values.billState}
										onChange={formik.handleChange}
										onBlur={formik.handleBlur}
										disabled={!privileges.canWrite()}>
										<option value='' label='Select State' />
										{statesDb.map((state: any) => (
											<option key={state.id} value={state.name}>
												{state.name}
											</option>
										))}
									</Select>
								</div>
								<div className='col-span-12 lg:col-span-4'>
									<Label htmlFor='billZipcode'>Zip Code</Label>
									<Input
										id='billZipcode'
										name='billZipcode'
										maxLength={10}
										onChange={(e) => {
											// Format zip code as user types
											const formattedZipCode = formatZipCode(e.target.value);
											formik.handleChange(e);
											formik.setFieldValue('billZipcode', formattedZipCode);
										}}
										value={formik.values.billZipcode}
										onBlur={formik.handleBlur}
										disabled={!privileges.canWrite()}
									/>
									{formik.touched.billZipcode && formik.errors.billZipcode ? (
										<div className='text-red-500'>
											{formik.errors.billZipcode}
										</div>
									) : null}
								</div>
								<div className='col-span-12 lg:col-span-4'>
									<Label htmlFor='billCountry'>Country</Label>
									<Select
										id='billCountry'
										name='billCountry'
										value={formik.values.billCountry}
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
								</div>
								<div className='col-span-3 lg:col-span-3'>
									<Label htmlFor='billPhoneNumber'>Phone</Label>
									<Input
										id='billPhoneNumber'
										name='billPhoneNumber'
										maxLength={14}
										onChange={(e) => {
											// Format phone number as user types
											const formattedPhoneNumber = formatPhoneNumber(
												e.target.value,
											);
											formik.handleChange(e);
											formik.setFieldValue(
												'billPhoneNumber',
												formattedPhoneNumber,
											);
										}}
										value={formik.values.billPhoneNumber}
										onBlur={formik.handleBlur}
										disabled={!privileges.canWrite()}
									/>
									{formik.touched.billPhoneNumber &&
									formik.errors.billPhoneNumber ? (
										<div className='text-red-500'>
											{formik.errors.billPhoneNumber}
										</div>
									) : null}
								</div>
								<div className='col-span-1 lg:col-span-1'>
									<Label htmlFor='billPhoneNumberExt'>Ext.</Label>
									<Input
										id='billPhoneNumberExt'
										name='billPhoneNumberExt'
										type='number'
										onChange={formik.handleChange}
										value={formik.values.billPhoneNumberExt}
										onBlur={formik.handleBlur}
										disabled={!privileges.canWrite()}
									/>
								</div>
								<div className='col-span-3 lg:col-span-3'>
									<Label htmlFor='billPhoneNumber2'>Phone 2</Label>
									<Input
										id='billPhoneNumber2'
										name='billPhoneNumber2'
										maxLength={14}
										onChange={(e) => {
											// Format phone number as user types
											const formattedPhoneNumber = formatPhoneNumber(
												e.target.value,
											);
											formik.handleChange(e);
											formik.setFieldValue(
												'billPhoneNumber2',
												formattedPhoneNumber,
											);
										}}
										value={formik.values.billPhoneNumber2}
										onBlur={formik.handleBlur}
										disabled={!privileges.canWrite()}
									/>
									{formik.touched.billPhoneNumber2 &&
									formik.errors.billPhoneNumber2 ? (
										<div className='text-red-500'>
											{formik.errors.billPhoneNumber2}
										</div>
									) : null}
								</div>
								<div className='col-span-1 lg:col-span-1'>
									<Label htmlFor='billPhoneNumber2Ext'>Ext.</Label>
									<Input
										id='billPhoneNumber2Ext'
										name='phoneNumbe2rExt'
										type='number'
										onChange={formik.handleChange}
										value={formik.values.billPhoneNumber2Ext}
										onBlur={formik.handleBlur}
										disabled={!privileges.canWrite()}
									/>
								</div>
								<div className='col-span-4 lg:col-span-4'>
									<Label htmlFor='billFax'>Fax</Label>
									<Input
										id='billFax'
										name='billFax'
										maxLength={14}
										onChange={(e) => {
											// Format phone number as user types
											const formattedPhoneNumber = formatPhoneNumber(
												e.target.value,
											);
											formik.handleChange(e);
											formik.setFieldValue('billFax', formattedPhoneNumber);
										}}
										value={formik.values.billFax}
										onBlur={formik.handleBlur}
										disabled={!privileges.canWrite()}
									/>
									{formik.touched.billFax && formik.errors.billFax ? (
										<div className='text-red-500'>{formik.errors.billFax}</div>
									) : null}
								</div>
								<div className='col-span-12 lg:col-span-4'>
									<Label htmlFor='billEmail'>Email</Label>
									<Input
										id='billEmail'
										name='billEmail'
										onChange={handleInputChange(formik.setFieldValue)(
											'billEmail',
										)}
										value={formik.values.billEmail}
										autoComplete='billEmail'
										onBlur={formik.handleBlur}
										multiple
										required
										disabled={!privileges.canWrite()}
									/>
									{formik.touched.billEmail && formik.errors.billEmail ? (
										<div className='text-red-500'>
											{formik.errors.billEmail}
										</div>
									) : null}
								</div>
							</div>
						</Collapse>
					</CardBody>
				</Card>
			</div>
		</div>
	);
};

export default BillToAddress;
