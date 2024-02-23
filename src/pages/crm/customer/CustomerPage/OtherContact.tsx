import React, { useState } from 'react';
import Card, { CardBody } from '../../../../components/ui/Card';
import Label from '../../../../components/form/Label';
import Input from '../../../../components/form/Input';
import Collapse from '../../../../components/utils/Collapse';
import Button from '../../../../components/ui/Button';
import getUserRights from '../../../../hooks/useUserRights';
import { handleInputChange } from '../../../../utils/capitalizedFunction.util';

const OtherContact = ({ formik, accordionStates, setAccordionStates }: any) => {


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
									className='flex w-full items-center justify-between rounded-none border-b text-lg font-bold px-[2px] py-[0px]'
									onClick={() => setAccordionStates({ ...accordionStates, otherContactInfo: !accordionStates.otherContactInfo })}
									rightIcon={!accordionStates.otherContactInfo ? 'HeroChevronUp' : 'HeroChevronDown'}>
									Other Contact Information
								</Button>
							</div>
						</div>
						<Collapse isOpen={!accordionStates.otherContactInfo}>
							<div className='mt-4 grid grid-cols-12 gap-4'>
								<div className='col-span-12 lg:col-span-4'>
									<Label htmlFor='orderConfirmationEmail'>
										Order Confirmation Email
									</Label>
									<Input
										id='orderConfirmationEmail'
										name='orderConfirmationEmail'
										onChange={handleInputChange(formik.setFieldValue)('orderConfirmationEmail')}
										value={formik.values.orderConfirmationEmail}
										onBlur={formik.handleBlur}
										multiple
										disabled={!privileges.canWrite()}
									/>
									{formik.touched.orderConfirmationEmail &&
										formik.errors.orderConfirmationEmail ? (
										<div className='text-red-500'>
											{formik.errors.orderConfirmationEmail}
										</div>
									) : null}
								</div>

								<div className='col-span-12 lg:col-span-4'>
									<Label htmlFor='invoiceEmail'>
										Invoice Email
										<span className='ml-1 text-red-500'>*</span>
									</Label>
									<Input
										id='invoiceEmail'
										name='invoiceEmail'
										onChange={handleInputChange(formik.setFieldValue)('invoiceEmail')}
										value={formik.values.invoiceEmail}
										multiple
										onBlur={formik.handleBlur}
										disabled={!privileges.canWrite()}
									/>
									{formik.touched.invoiceEmail && formik.errors.invoiceEmail ? (
										<div className='text-red-500'>
											{formik.errors.invoiceEmail}
										</div>
									) : null}
								</div>

								<div className='col-span-12 lg:col-span-4'>
									<Label htmlFor='statementsEmail'>Statements Email</Label>
									<Input
										id='statementsEmail'
										name='statementsEmail'
										onChange={handleInputChange(formik.setFieldValue)('statementsEmail')}
										value={formik.values.statementsEmail}
										multiple
										onBlur={formik.handleBlur}
										disabled={!privileges.canWrite()}
									/>
									{formik.touched.statementsEmail &&
										formik.errors.statementsEmail ? (
										<div className='text-red-500'>
											{formik.errors.statementsEmail}
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

export default OtherContact;
