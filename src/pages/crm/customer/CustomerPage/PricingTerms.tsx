import React from 'react';
import Card, { CardBody } from '../../../../components/ui/Card';
import Label from '../../../../components/form/Label';
import Select from '../../../../components/form/Select';
import Collapse from '../../../../components/utils/Collapse';
import Button from '../../../../components/ui/Button';
import Input from '../../../../components/form/Input';
import Textarea from '../../../../components/form/Textarea';
import getUserRights from '../../../../hooks/useUserRights';
import { handleInputChange } from '../../../../utils/capitalizedFunction.util';

const PricingTerms = ({ formik, accordionStates, setAccordionStates, masterSettings }: any) => {
	const privileges = getUserRights('customers');
	return (
		<div>
			<div className='col-span-12 md:col-span-6'>
				<Card>
					<CardBody>
						<div className='flex'>
							<div className='grow'>
								<Button
									variant='outlined'
									className='flex w-full items-center justify-between rounded-none border-b px-[2px] py-[0px] text-lg font-bold'
									onClick={() =>
										setAccordionStates({
											...accordionStates,
											pricingTerms: !accordionStates.pricingTerms,
										})
									}
									rightIcon={
										!accordionStates.pricingTerms
											? 'HeroChevronUp'
											: 'HeroChevronDown'
									}>
									Terms
								</Button>
							</div>
						</div>
						<Collapse isOpen={!accordionStates.pricingTerms}>
							<div className='mt-4 grid grid-cols-12 gap-4'>
								<div className='col-span-12 lg:col-span-4'>
									<Label htmlFor='terms'>
										Payment Terms
										<span className='ml-1 text-red-500'>*</span>
									</Label>
									<div
										style={{
											display: 'flex',
											flexDirection: 'column',
											gap: '0.5rem',
										}}>
										<Select
											id='terms'
											name='terms'
											onChange={formik.handleChange}
											value={formik.values.terms}
											onBlur={formik.handleBlur}
											disabled={!privileges.canWrite()}>
											<option value=''>Select Terms</option>
											{masterSettings.terms &&
												masterSettings.terms.map((option: string) => (
													<option key={option} value={option}>
														{option}
													</option>
												))}
										</Select>
										{formik.touched.terms && formik.errors.terms ? (
											<div className='text-red-500'>
												{formik.errors.terms}
											</div>
										) : null}
									</div>
								</div>
								<div className='col-span-12 lg:col-span-4'>
									<Label htmlFor='pricingTerms'>
										Pricing Terms
										<span className='ml-1 text-red-500'>*</span>
									</Label>
									<Select
										id='pricingTerms'
										name='pricingTerms'
										onChange={formik.handleChange}
										value={formik.values.pricingTerms}
										onBlur={formik.handleBlur}
										disabled={!privileges.canWrite()}>
										<option value='' label='Select Pricing Term' />
										{masterSettings.pricingTerms &&
											masterSettings.pricingTerms.map((option: string) => (
												<option key={option} value={option}>
													{option}
												</option>
											))}
									</Select>
									{formik.touched.pricingTerms && formik.errors.pricingTerms ? (
										<div className='text-red-500'>
											{formik.errors.pricingTerms}
										</div>
									) : null}
								</div>
								<div className='col-span-12 lg:col-span-4'>
									<Label htmlFor='paymentMethod'>Payment Method</Label>
									<Select
										id='paymentMethod'
										name='paymentMethod'
										onChange={formik.handleChange}
										value={formik.values.paymentMethod}
										onBlur={formik.handleBlur}
										disabled={!privileges.canWrite()}>
										<option value='' label='Select Payment Method' />
										{masterSettings.paymentMethod &&
											masterSettings.paymentMethod.map((option: string) => (
												<option key={option} value={option}>
													{option}
												</option>
											))}
									</Select>
									{formik.touched.paymentMethod && formik.errors.paymentMethod ? (
										<div className='text-red-500'>
											{formik.errors.paymentMethod}
										</div>
									) : null}
								</div>
								<div className='col-span-12 lg:col-span-4'>
									<Label htmlFor='shippingInformation'>
										Shipping Information
									</Label>
									<Input
										id='shippingInformation'
										name='shippingInformation'
										onChange={handleInputChange(formik.setFieldValue)(
											'shippingInformation',
										)}
										value={formik.values.shippingInformation}
										onBlur={formik.handleBlur}
										disabled={!privileges.canWrite()}
									/>

									{formik.touched.shippingInformation &&
									formik.errors.shippingInformation ? (
										<div className='text-red-500'>
											{formik.errors.shippingInformation}
										</div>
									) : null}
								</div>

								<div className='col-span-12 lg:col-span-4'>
									<Label htmlFor='pShipMethod'>Ship Method</Label>
									<Select
										id='pShipMethod'
										name='pShipMethod'
										onChange={(e) => {
											formik.handleChange(e);
										}}
										value={formik.values.pShipMethod}
										onBlur={formik.handleBlur}>
										<option value=''>Select</option>
										{masterSettings.shippingMethod &&
											masterSettings.shippingMethod.map((option: string) => (
												<option key={option} value={option}>
													{option}
												</option>
											))}
									</Select>
								</div>
								<div className='col-span-12 lg:col-span-4'>
									<Label htmlFor='pShippingACnumber'>Shipping A/C Number</Label>
									<Input
										id='pShippingACnumber'
										name='pShippingACnumber'
										onChange={handleInputChange(formik.setFieldValue)(
											'pShippingACnumber',
										)}
										value={formik.values.pShippingACnumber}
										onBlur={formik.handleBlur}
									/>
								</div>
								<div className='col-span-12 lg:col-span-4'>
									<Label htmlFor='pAlternateShipMethod'>
										Alternate Ship Method
									</Label>
									<Select
										id='pAlternateShipMethod'
										name='pAlternateShipMethod'
										onChange={(e) => {
											formik.handleChange(e);
										}}
										value={formik.values.pAlternateShipMethod}
										onBlur={formik.handleBlur}>
										<option value=''>Select</option>
										{masterSettings.shippingMethod &&
											masterSettings.shippingMethod.map((option: string) => (
												<option key={option} value={option}>
													{option}
												</option>
											))}
									</Select>
								</div>
								<div className='col-span-12 lg:col-span-4'>
									<Label htmlFor='pAlternateShippingACnumber'>
										Alternate Shipping A/C Number
									</Label>
									<Input
										id='pAlternateShippingACnumber'
										name='pAlternateShippingACnumber'
										onChange={handleInputChange(formik.setFieldValue)(
											'pAlternateShippingACnumber',
										)}
										value={formik.values.pAlternateShippingACnumber}
										onBlur={formik.handleBlur}
									/>
								</div>

								<div className='col-span-12 lg:col-span-12'>
									<Label htmlFor='termsNotes'>Terms Notes</Label>
									<Textarea
										id='termsNotes'
										name='termsNotes'
										onChange={handleInputChange(formik.setFieldValue)(
											'termsNotes',
										)}
										value={formik.values.termsNotes}
										onBlur={formik.handleBlur}
										disabled={!privileges.canWrite()}
									/>
									{formik.touched.termsNotes && formik.errors.termsNotes ? (
										<div className='text-red-500'>
											{formik.errors.termsNotes}
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

export default PricingTerms;