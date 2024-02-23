import React, { useState } from 'react';
import Label from '../../../../components/form/Label';
import Input from '../../../../components/form/Input';
import Card, { CardBody } from '../../../../components/ui/Card';
import Button from '../../../../components/ui/Button';
import Collapse from '../../../../components/utils/Collapse';
import Textarea from '../../../../components/form/Textarea';
import getUserRights from '../../../../hooks/useUserRights';
import { handleInputChange } from '../../../../utils/capitalizedFunction.util';

const MasterContact = ({ formik, accordionStates, setAccordionStates }: any) => {
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
								onClick={() =>
									setAccordionStates({
										...accordionStates,
										MCI: !accordionStates.MCI,
									})
								}
								rightIcon={
									!accordionStates.MCI ? 'HeroChevronUp' : 'HeroChevronDown'
								}>
								Master Contact Information
							</Button>
						</div>
					</div>
					<Collapse isOpen={!accordionStates.MCI}>
						<div className='mt-4 grid grid-cols-12 gap-4'>
							<div className='col-span-12 lg:col-span-6'>
								<Label htmlFor='masterContact'>Master Contact</Label>
								<Input
									id='masterContact'
									name='masterContact'
									// onChange={handleInputChange(formik.setFieldValue)('masterContact')}
									onChange={handleInputChange(formik.setFieldValue)(
										'masterContact',
									)}
									value={formik.values.masterContact}
									onBlur={formik.handleBlur}
									disabled={!privileges.canWrite()}
								/>
								{formik.touched.masterContact && formik.errors.masterContact ? (
									<div className='text-red-500'>
										{formik.errors.masterContact}
									</div>
								) : null}
							</div>

							<div className='col-span-12 lg:col-span-6'>
								<Label htmlFor='masterContactEmail'>Master Contact Email</Label>
								<Input
									id='masterContactEmail'
									name='masterContactEmail'
									onChange={handleInputChange(formik.setFieldValue)(
										'masterContactEmail',
									)}
									value={formik.values.masterContactEmail}
									onBlur={formik.handleBlur}
									multiple
									disabled={!privileges.canWrite()}
								/>
								{formik.touched.masterContactEmail &&
									formik.errors.masterContactEmail ? (
									<div className='text-red-500'>
										{formik.errors.masterContactEmail}
									</div>
								) : null}
							</div>

							<div className='col-span-12 lg:col-span-12'>
								<Label htmlFor='masterContactNotes'>Master Contact Notes</Label>
								<Textarea
									id='masterContactNotes'
									name='masterContactNotes'
									onChange={handleInputChange(formik.setFieldValue)(
										'masterContactNotes',
									)}
									value={formik.values.masterContactNotes}
									onBlur={formik.handleBlur}
									disabled={!privileges.canWrite()}
								/>
								{formik.touched.masterContactNotes &&
									formik.errors.masterContactNotes ? (
									<div className='text-red-500'>
										{formik.errors.masterContactNotes}
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

export default MasterContact;
