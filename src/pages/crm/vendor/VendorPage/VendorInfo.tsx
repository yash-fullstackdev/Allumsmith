import Button from '../../../../components/ui/Button';
import Card, { CardBody } from '../../../../components/ui/Card';
import Collapse from '../../../../components/utils/Collapse';
import Label from '../../../../components/form/Label';
import Input from '../../../../components/form/Input';
import Select from '../../../../components/form/Select';
import countryDb from '../../../../mocks/db/country.db';
import statesDb from '../../../../mocks/db/states.db';
import getUserRights from '../../../../hooks/useUserRights';
import { handleInputChange } from '../../../../utils/capitalizedFunction.util';

const VendorInfo = ({ formik, accordionStates, setAccordionStates }: any) => {
	const privileges = getUserRights('vendors');
	const formatZipCode = (inputZip: string) => {
		const numericPart = inputZip.replace(/\D/g, '');

		if (numericPart.length <= 5) {
			return numericPart;
		} else if (numericPart.length <= 9) {
			return `${numericPart.slice(0, 5)}-${numericPart.slice(5, 9)}`;
		} else {
			return `${numericPart.slice(0, 5)}-${numericPart.slice(5, 9)}${numericPart.slice(9)}`;
		}
	};

	const formatPhoneNumber = (inputNumber: string) => {
		const numericPart = inputNumber.replace(/\D/g, '');

		if (numericPart.length === 0) {
			return '';
		} else if (numericPart.length <= 3) {
			return `(${numericPart}`;
		} else if (numericPart.length <= 6) {
			return `(${numericPart.slice(0, 3)}) ${numericPart.slice(3)}`;
		} else {
			return `(${numericPart.slice(0, 3)}) ${numericPart.slice(3, 6)}-${numericPart.slice(
				6,
				10,
			)}`;
		}
	};

	return (
		<div className='col-span-12 flex flex-col gap-4 xl:col-span-6'>
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
										vendorInfo: !accordionStates.vendorInfo,
									})
								}
								rightIcon={
									!accordionStates.vendorInfo
										? 'HeroChevronUp'
										: 'HeroChevronDown'
								}>
								Vendor Information
							</Button>
						</div>
					</div>
					<Collapse isOpen={!accordionStates.vendorInfo}>
						<div className='mt-4 grid grid-cols-12 gap-4'>
							<div className='col-span-12 lg:col-span-6'>
								<Label htmlFor='vendorNumber'>Vendor Number</Label>
								<Input
									className='cursor-not-allowed'
									id='vendorNumber'
									name='vendorNumber'
									value={formik.values.vendorNumber}
									disabled
								/>
							</div>
							<div className='col-span-12 lg:col-span-6'>
								<Label htmlFor='vendorStatus'>
									Status
									<span className='ml-1 text-red-500 '>*</span>
								</Label>
								<Select
									id='vendorStatus'
									name='vendorStatus'
									value={formik.values.vendorStatus}
									placeholder='Select Status'
									onChange={formik.handleChange}
									onBlur={formik.handleBlur}
									disabled={!privileges.canWrite()}>
									<option value=''>Select Status</option>
									<option value='ACTIVE'>ACTIVE</option>
									<option value='INACTIVE'>INACTIVE</option>
								</Select>
								{formik.touched.vendorStatus && formik.errors.vendorStatus ? (
									<div className='text-red-500'>{formik.errors.vendorStatus}</div>
								) : null}
							</div>
						</div>
						<div className='mt-4 grid grid-cols-12 gap-4'>
							<div className='col-span-12 lg:col-span-6'>
								<Label htmlFor='Name'>
									Vendor Name
									<span className='ml-1 text-red-500 '>*</span>
								</Label>
								<Input
									id='Name'
									name='Name'
									onChange={handleInputChange(formik.setFieldValue)('Name')}
									value={formik.values.Name}
									onBlur={formik.handleBlur}
									required
									disabled={!privileges.canWrite()}
								/>
								{formik.touched.Name && formik.errors.Name ? (
									<div className='text-red-500'>{formik.errors.Name}</div>
								) : null}
							</div>
							<div className='col-span-12 lg:col-span-6'>
								<Label htmlFor='dbaName'>DBA Name</Label>
								<Input
									id='dbaName'
									name='dbaName'
									onChange={handleInputChange(formik.setFieldValue)('dbaName')}
									value={formik.values.dbaName}
									onBlur={formik.handleBlur}
									disabled={!privileges.canWrite()}
								/>
							</div>
							<div className='col-span-12 lg:col-span-4'>
								<Label htmlFor='address'>
									Address 1<span className='ml-1 text-red-500 '>*</span>
								</Label>
								<Input
									id='address'
									name='address'
									onChange={handleInputChange(formik.setFieldValue)('address')}
									value={formik.values.address}
									onBlur={formik.handleBlur}
									required
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
									onChange={handleInputChange(formik.setFieldValue)('address2')}
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
									onChange={handleInputChange(formik.setFieldValue)('address3')}
									value={formik.values.address3}
									onBlur={formik.handleBlur}
									disabled={!privileges.canWrite()}
								/>
							</div>
							<div className='col-span-12 lg:col-span-4'>
								<Label htmlFor='city'>
									City
									<span className='ml-1 text-red-500 '>*</span>
								</Label>
								<Input
									id='city'
									name='city'
									onChange={handleInputChange(formik.setFieldValue)('city')}
									value={formik.values.city}
									onBlur={formik.handleBlur}
									required
									disabled={!privileges.canWrite()}
								/>
								{formik.touched.city && formik.errors.city ? (
									<div className='text-red-500'>{formik.errors.city}</div>
								) : null}
							</div>
							<div className='col-span-12 lg:col-span-4'>
								<Label htmlFor='state'>
									State:
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
										const formattedZipCode = formatZipCode(e.target.value);
										formik.handleChange(e);
										formik.setFieldValue('zipcode', formattedZipCode);
									}}
									value={formik.values.zipcode}
									onBlur={formik.handleBlur}
									required
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
							<div className='col-span-12 lg:col-span-3'>
								<Label htmlFor='phoneNumber'>
									Phone
									<span className='ml-1 text-red-500 '>*</span>
								</Label>
								<Input
									id='phoneNumber'
									name='phoneNumber'
									maxLength={14}
									onChange={(e) => {
										const formattedNumber = formatPhoneNumber(e.target.value);
										formik.handleChange(e);
										formik.setFieldValue('phoneNumber', formattedNumber);
									}}
									value={formik.values.phoneNumber}
									onBlur={formik.handleBlur}
									disabled={!privileges.canWrite()}
									required
								/>
								{formik.touched.phoneNumber && formik.errors.phoneNumber ? (
									<div className='text-red-500'>{formik.errors.phoneNumber}</div>
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
							<div className='col-span-12 lg:col-span-3'>
								<Label htmlFor='phoneNumber2'>Phone 2</Label>
								<Input
									id='phoneNumber2'
									name='phoneNumber2'
									maxLength={14}
									onChange={(e) => {
										const formattedNumber = formatPhoneNumber(e.target.value);
										formik.handleChange(e);
										formik.setFieldValue('phoneNumber2', formattedNumber);
									}}
									value={formik.values.phoneNumber2}
									onBlur={formik.handleBlur}
									disabled={!privileges.canWrite()}
								/>
								{formik.touched.phoneNumber2 && formik.errors.phoneNumber2 ? (
									<div className='text-red-500'>{formik.errors.phoneNumber2}</div>
								) : null}
							</div>
							<div className='col-span-1 lg:col-span-1'>
								<Label htmlFor='phoneNumber2Ext'>Ext.</Label>
								<Input
									id='phoneNumber2Ext'
									name='phoneNumber2Ext'
									type='number'
									onChange={formik.handleChange}
									value={formik.values.phoneNumber2Ext}
									onBlur={formik.handleBlur}
									disabled={!privileges.canWrite()}
								/>
							</div>
							<div className='col-span-12 lg:col-span-4'>
								<Label htmlFor='fax'>FAX</Label>
								<Input
									id='fax'
									name='fax'
									maxLength={14}
									onChange={(e) => {
										const formattedNumber = formatPhoneNumber(e.target.value);
										formik.handleChange(e);
										formik.setFieldValue('fax', formattedNumber);
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
								<Label htmlFor='URL'>URL</Label>
								<Input
									id='URL'
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
								<Label htmlFor='email'>Email</Label>
								<Input
									id='email'
									name='email'
									onChange={handleInputChange(formik.setFieldValue)('email')}
									value={formik.values.email}
									autoComplete='email'
									onBlur={formik.handleBlur}
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
		</div>
	);
};

export default VendorInfo;
