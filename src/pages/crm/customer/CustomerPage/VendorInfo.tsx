import React from 'react';
import Card, { CardBody } from '../../../../components/ui/Card';
import Input from '../../../../components/form/Input';
import Label from '../../../../components/form/Label';
import Select from '../../../../components/form/Select';
import Button from '../../../../components/ui/Button';
import Collapse from '../../../../components/utils/Collapse';
import getUserRights from '../../../../hooks/useUserRights';
import { handleInputChange } from '../../../../utils/capitalizedFunction.util';

const VendorInfo = ({ formik, accordionStates, setAccordionStates }: any) => {

	const privileges = getUserRights('customers');
	return (
		<div className='col-span-12 flex flex-col gap-4 xl:col-span-6'>
			<Card>
				<CardBody>
					<div className='flex'>
						<div className='grow'>
							<Button
								variant='outlined'
								className='flex w-full items-center justify-between rounded-none border-b text-lg font-bold px-[2px] py-[0px]'
								onClick={() => setAccordionStates({ ...accordionStates, vendorInfo: !accordionStates.vendorInfo })}
								rightIcon={!accordionStates.vendorInfo ? 'HeroChevronUp' : 'HeroChevronDown'}>
								Vendor Information
							</Button>
						</div>
					</div>
					<Collapse isOpen={!accordionStates.vendorInfo}>
						<div className='mt-4 grid grid-cols-12 gap-4'>
							<div className='col-span-12 lg:col-span-4'>
								<Label htmlFor='vendor'>Vendor # in Cust System</Label>
								<Input
									id='vendor'
									name='vendor'
									onChange={handleInputChange(formik.setFieldValue)('vendor')}
									value={formik.values.vendor}
									onBlur={formik.handleBlur}
									disabled={!privileges.canWrite()}
								/>
								{formik.touched.vendor && formik.errors.vendor ? (
									<div className='text-red-500'>{formik.errors.vendor}</div>
								) : null}
							</div>

							<div className='col-span-12 lg:col-span-4'>
								<Label htmlFor='specialInstructions'>Special Instructions</Label>
								<Input
									id='specialInstructions'
									name='specialInstructions'
									onChange={handleInputChange(formik.setFieldValue)('specialInstructions')}
									value={formik.values.specialInstructions}
									onBlur={formik.handleBlur}
									disabled={!privileges.canWrite()}
								/>
								{formik.touched.specialInstructions &&
									formik.errors.specialInstructions ? (
									<div className='text-red-500'>
										{formik.errors.specialInstructions}
									</div>
								) : null}
							</div>
							<div className='col-span-12 lg:col-span-4'>
								<Label htmlFor='custPORequired'>
									Cust PO Required
									<span className='ml-1 text-red-500'>*</span>
								</Label>
								<Select
									id='custPORequired'
									name='custPORequired'
									onChange={formik.handleChange}
									onBlur={formik.handleBlur}
									value={formik.values.custPORequired || 'YES'}
									disabled={!privileges.canWrite()}

								>
									<option value='YES'>YES</option>
									<option value='NO'>NO</option>
								</Select>
								{formik.touched.custPORequired && formik.errors.custPORequired ? (
									<div className='text-red-500'>
										{formik.errors.custPORequired}
									</div>
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
