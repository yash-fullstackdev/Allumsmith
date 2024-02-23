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
import MasterContact from './MasterContact';
import Textarea from '../../../../components/form/Textarea';
import AdditionalContactInfo from './AdditionalContactInfo';
import getUserRights from '../../../../hooks/useUserRights';
import { handleInputChange } from '../../../../utils/capitalizedFunction.util';

const CustomerInfo = ({ formik, accordionStates, setAccordionStates }: any) => {
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
									className='flex w-full items-center justify-between rounded-none border-b text-lg font-bold px-[2px] py-[0px]'
									// style={{
									// 	padding: '0px 0.125rem',
									// }}
									onClick={() =>
										setAccordionStates({
											...accordionStates,
											customerInfo: !accordionStates.customerInfo,
										})
									}
									rightIcon={
										!accordionStates.customerInfo
											? 'HeroChevronUp'
											: 'HeroChevronDown'
									}>
									Customer Information
								</Button>
							</div>
						</div>

						<Collapse isOpen={!accordionStates.customerInfo}>
							<div className='mt-2 grid grid-cols-12 gap-1'>
								<div className=' col-span-12 lg:col-span-6'>
									<Label htmlFor='customerNumber'>Customer Number</Label>
									<Input
										id='customerNumber'
										name='customerNumber'
										value={formik.values.customerNumber}
										disabled
									/>
								</div>
								<div className='col-span-12 lg:col-span-6'>
									<Label htmlFor='status'>Status</Label>
									<Select
										id='status'
										name='status'
										value={formik.values.status}
										placeholder='Select status'
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
								<div className='col-span-12 lg:col-span-6'>
									<Label htmlFor='firstName'>
										Name
										<span className='ml-1 text-red-500'>*</span>
									</Label>
									<Input
										id='Name'
										name='Name'
										onChange={handleInputChange(formik.setFieldValue)('Name')}
										value={formik.values.Name}
										onBlur={formik.handleBlur}
										disabled={!privileges.canWrite()}
									/>
									{formik.touched.Name && formik.errors.Name ? (
										<div className='text-red-500'>{formik.errors.Name}</div>
									) : null}
								</div>
								<div className='col-span-12 lg:col-span-6'>
									<Label htmlFor='firstName'>DBA Name</Label>
									<Input
										id='dbaName'
										name='dbaName'
										onChange={handleInputChange(formik.setFieldValue)(
											'dbaName',
										)}
										value={formik.values.dbaName}
										onBlur={formik.handleBlur}
										disabled={!privileges.canWrite()}
									/>
									{formik.touched.dbaName && formik.errors.dbaName ? (
										<div className='text-red-500'>{formik.errors.dbaName}</div>
									) : null}
								</div>
								<div className='col-span-12 lg:col-span-4'>
									<Label htmlFor='address'>
										Address 1<span className='ml-1 text-red-500'>*</span>
									</Label>
									<Input
										id='address'
										name='address'
										onChange={handleInputChange(formik.setFieldValue)(
											'address',
										)}
										value={formik.values.address}
										onBlur={formik.handleBlur}
										disabled={!privileges.canWrite()}
									/>
									{formik.touched.address && formik.errors.address ? (
										<div className='text-red-500'>{formik.errors.address}</div>
									) : null}
								</div>
								<div className='col-span-12 lg:col-span-4'>
									<Label htmlFor='address2'>Address 2</Label>
									<Input
										id='address2'
										name='address2'
										onChange={handleInputChange(formik.setFieldValue)(
											'address2',
										)}
										value={formik.values.address2}
										onBlur={formik.handleBlur}
										disabled={!privileges.canWrite()}
									/>
								</div>
								<div className='col-span-12 lg:col-span-4'>
									<Label htmlFor='address3'>Address 3</Label>
									<Input
										id='address3'
										name='address3'
										onChange={handleInputChange(formik.setFieldValue)(
											'address3',
										)}
										value={formik.values.address3}
										onBlur={formik.handleBlur}
										disabled={!privileges.canWrite()}
									/>
									{formik.touched.address3 && formik.errors.address3 ? (
										<div className='text-red-500'>{formik.errors.address3}</div>
									) : null}
								</div>
								<div className='col-span-12 lg:col-span-4'>
									<Label htmlFor='city'>
										City
										<span className='ml-1 text-red-500'>*</span>
									</Label>
									<Input
										id='city'
										name='city'
										onChange={handleInputChange(formik.setFieldValue)('city')}
										value={formik.values.city}
										onBlur={formik.handleBlur}
										disabled={!privileges.canWrite()}
									/>
									{formik.touched.city && formik.errors.city ? (
										<div className='text-red-500'>{formik.errors.city}</div>
									) : null}
								</div>
								<div className='col-span-12 lg:col-span-4'>
									<Label htmlFor='state'>
										State
										<span className='ml-1 text-red-500'>*</span>
									</Label>
									<Select
										id='state'
										name='state'
										value={formik.values.state}
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

									{formik.touched.state && formik.errors.state ? (
										<div className='text-red-500'>{formik.errors.state}</div>
									) : null}
								</div>
								<div className='col-span-12 lg:col-span-4'>
									<Label htmlFor='zipcode'>
										Zip Code
										<span className='ml-1 text-red-500'>*</span>
									</Label>
									<Input
										id='zipcode'
										name='zipcode'
										maxLength={10}
										onChange={(e) => {
											// Format zip code as user types
											const formattedZipCode = formatZipCode(e.target.value);
											formik.handleChange(e);
											formik.setFieldValue('zipcode', formattedZipCode);
										}}
										value={formik.values.zipcode}
										onBlur={formik.handleBlur}
										disabled={!privileges.canWrite()}
									/>
									{formik.touched.zipcode && formik.errors.zipcode ? (
										<div className='text-red-500'>{formik.errors.zipcode}</div>
									) : null}
								</div>
								<div className='col-span-12 lg:col-span-4'>
									<Label htmlFor='country'>
										Country
										<span className='ml-1 text-red-500'>*</span>
									</Label>
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
								<div className='col-span-3 lg:col-span-3'>
									<Label htmlFor='phoneNumber'>
										Phone
										<span className='ml-1 text-red-500'>*</span>
									</Label>
									<Input
										id='phoneNumber'
										name='phoneNumber'
										maxLength={14}
										onChange={(e) => {
											// Format phone number as user types
											const formattedPhoneNumber = formatPhoneNumber(
												e.target.value,
											);
											formik.handleChange(e);
											formik.setFieldValue(
												'phoneNumber',
												formattedPhoneNumber,
											);
										}}
										value={formik.values.phoneNumber}
										onBlur={formik.handleBlur}
										disabled={!privileges.canWrite()}
									/>
									{formik.touched.phoneNumber && formik.errors.phoneNumber ? (
										<div className='text-red-500'>
											{formik.errors.phoneNumber}
										</div>
									) : null}
								</div>
								<div className='col-span-1 lg:col-span-1'>
									<Label htmlFor='phoneNumberExt'>Ext.</Label>
									<Input
										id='phoneNumberExt'
										name='phoneNumberExt'
										type='number'
										onChange={formik.handleChange}
										value={formik.values.phoneNumberExt}
										onBlur={formik.handleBlur}
										disabled={!privileges.canWrite()}
									/>
								</div>
								<div className='col-span-3 lg:col-span-3'>
									<Label htmlFor='phoneNumber2'>Phone 2</Label>
									<Input
										id='phoneNumber2'
										name='phoneNumber2'
										maxLength={14}
										onChange={(e) => {
											// Format phone number as user types
											const formattedPhoneNumber = formatPhoneNumber(
												e.target.value,
											);
											formik.handleChange(e);
											formik.setFieldValue(
												'phoneNumber2',
												formattedPhoneNumber,
											);
										}}
										value={formik.values.phoneNumber2}
										onBlur={formik.handleBlur}
										disabled={!privileges.canWrite()}
									/>
									{formik.touched.phoneNumber2 && formik.errors.phoneNumber2 ? (
										<div className='text-red-500'>
											{formik.errors.phoneNumber2}
										</div>
									) : null}
								</div>
								<div className='col-span-1 lg:col-span-1'>
									<Label htmlFor='phoneNumber2Ext'>Ext.</Label>
									<Input
										id='phoneNumber2Ext'
										name='phoneNumbe2rExt'
										type='number'
										onChange={formik.handleChange}
										value={formik.values.phoneNumber2Ext}
										onBlur={formik.handleBlur}
										disabled={!privileges.canWrite()}
									/>
								</div>
								<div className='col-span-4 lg:col-span-4'>
									<Label htmlFor='fax'>Fax</Label>
									<Input
										id='fax'
										name='fax'
										maxLength={14}
										onChange={(e) => {
											// Format phone number as user types
											const formattedPhoneNumber = formatPhoneNumber(
												e.target.value,
											);
											formik.handleChange(e);
											formik.setFieldValue('fax', formattedPhoneNumber);
										}}
										value={formik.values.fax}
										onBlur={formik.handleBlur}
										disabled={!privileges.canWrite()}
									/>
									{formik.touched.fax && formik.errors.fax ? (
										<div className='text-red-500'>{formik.errors.fax}</div>
									) : null}
								</div>
								<div className='col-span-12 lg:col-span-4'>
									<Label htmlFor='url'>URL</Label>
									<Input
										id='url'
										name='URL'
										onChange={formik.handleChange}
										value={formik.values.URL}
										onBlur={formik.handleBlur}
										disabled={!privileges.canWrite()}
									/>
									{formik.touched.URL && formik.errors.URL ? (
										<div className='text-red-500'>{formik.errors.URL}</div>
									) : null}
								</div>
								<div className='col-span-12 lg:col-span-4'>
									<Label htmlFor='email'>
										Email
										<span className='ml-1 text-red-500'>*</span>
									</Label>
									<Input
										id='email'
										name='email'
										onChange={handleInputChange(formik.setFieldValue)('email')}
										value={formik.values.email}
										autoComplete='email'
										onBlur={formik.handleBlur}
										multiple
										required
										disabled={!privileges.canWrite()}
									/>
									{formik.touched.email && formik.errors.email ? (
										<div className='text-red-500'>{formik.errors.email}</div>
									) : null}
								</div>
							</div>
						</Collapse>
					</CardBody>
				</Card>

				<MasterContact
					accordionStates={accordionStates}
					setAccordionStates={setAccordionStates}
					formik={formik}
				/>
				<AdditionalContactInfo
					accordionStates={accordionStates}
					setAccordionStates={setAccordionStates}
					formik={formik}
				/>
				<Card>
					<CardBody>
						<div className='flex'>
							<div className='bold w-full'>
								<Button
									className='flex w-full items-center justify-between rounded-none border-b text-lg font-bold px-[2px] py-[0px]'
									variant='outlined'
									onClick={() =>
										setAccordionStates({
											...accordionStates,
											APContactInfo: !accordionStates.APContactInfo,
										})
									}
									rightIcon={
										!accordionStates.APContactInfo
											? 'HeroChevronUp'
											: 'HeroChevronDown'
									}>
									A/P Contact Information
								</Button>
							</div>
						</div>
						<Collapse isOpen={!accordionStates.APContactInfo}>
							<div className='mt-4 grid grid-cols-12 gap-1'>
								<div className='col-span-12 lg:col-span-4'>
									<Label htmlFor='APcontact'>
										A/P Contact
										<span className='ml-1 text-red-500'>*</span>
									</Label>
									<Input
										id='APcontact'
										name='APcontact'
										onChange={handleInputChange(formik.setFieldValue)(
											'APcontact',
										)}
										value={formik.values.APcontact}
										onBlur={formik.handleBlur}
										disabled={!privileges.canWrite()}
									/>
									{formik.touched.APcontact && formik.errors.APcontact ? (
										<div className='text-red-500'>
											{formik.errors.APcontact}
										</div>
									) : null}
								</div>
								<div className='col-span-3 lg:col-span-3'>
									<Label htmlFor='APphoneNumber'>
										A/P Phone
										<span className='ml-1 text-red-500'>*</span>
									</Label>
									<Input
										id='APphoneNumber'
										name='APphoneNumber'
										onChange={(e) => {
											// Format phone number as user types
											const formattedPhoneNumber = formatPhoneNumber(
												e.target.value,
											);
											formik.handleChange(e);
											formik.setFieldValue(
												'APphoneNumber',
												formattedPhoneNumber,
											);
										}}
										value={formik.values.APphoneNumber}
										onBlur={formik.handleBlur}
										disabled={!privileges.canWrite()}
									/>
									{formik.touched.APphoneNumber && formik.errors.APphoneNumber ? (
										<div className='text-red-500'>
											{formik.errors.APphoneNumber}
										</div>
									) : null}
								</div>
								<div className='col-span-1 lg:col-span-1'>
									<Label htmlFor='APphoneNumberExt'>Ext.</Label>
									<Input
										id='APphoneNumberExt'
										name='APphoneNumberExt'
										type='number'
										onChange={formik.handleChange}
										value={formik.values.APphoneNumberExt}
										onBlur={formik.handleBlur}
										disabled={!privileges.canWrite()}
									/>
								</div>
								<div className='col-span-12 lg:col-span-4'>
									<Label htmlFor='APemail'>
										A/P Email
										<span className='ml-1 text-red-500'>*</span>
									</Label>
									<Input
										id='APemail'
										name='APemail'
										onChange={handleInputChange(formik.setFieldValue)(
											'APemail',
										)}
										value={formik.values.APemail}
										autoComplete='APemail'
										required
										multiple
										onBlur={formik.handleBlur}
										disabled={!privileges.canWrite()}
									/>
									{formik.touched.APemail && formik.errors.APemail ? (
										<div className='text-red-500'>{formik.errors.APemail}</div>
									) : null}
								</div>
								<div className='col-span-12 lg:col-span-12'>
									<Label htmlFor='APnotes'>A/P Notes</Label>
									<Textarea
										id='APnotes'
										name='APnotes'
										onChange={handleInputChange(formik.setFieldValue)(
											'APnotes',
										)}
										value={formik.values.APnotes}
										autoComplete='APnotes'
										onBlur={formik.handleBlur}
										disabled={!privileges.canWrite()}
									/>
								</div>
							</div>
						</Collapse>
					</CardBody>
				</Card>
			</div>
		</div>
	);
};

export default CustomerInfo;
