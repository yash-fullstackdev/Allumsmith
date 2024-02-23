import React from 'react';
import Input from '../../../../components/form/Input';
import Textarea from '../../../../components/form/Textarea';
import Label from '../../../../components/form/Label';
import Button from '../../../../components/ui/Button';
import Collapse from '../../../../components/utils/Collapse';
import Card, { CardBody } from '../../../../components/ui/Card';
import getUserRights from '../../../../hooks/useUserRights';

const AdditionalContactInfo = ({ formik, accordionStates, setAccordionStates }: any) => {
	const handleAddContactClick = () => {
		formik.setValues((prevValues: any) => {
			const newContacts = [
				...prevValues.additionalContactInfo,
				{
					additionalName: '',
					additionalPhone: '',
					additionalPhoneExt: '',
					additionalMobile: '',
					additionalFax: '',
					additionalEmail: '',
					additionalNotes: '',
				},
			];
			return { ...prevValues, additionalContactInfo: newContacts };
		});
	};

	const handleDeleteContact = (index: any) => {
		formik.setValues((prevValues: any) => {
			const newContacts = [...prevValues.additionalContactInfo];
			newContacts.splice(index, 1);
			return { ...prevValues, additionalContactInfo: newContacts };
		});
	};
	const privileges = getUserRights('customers');
	const formatPhoneNumber = (inputNumber: any) => {
		const numericPart = inputNumber.replace(/\D/g, '');

		if (numericPart.length === 0) {
			return ''; // Return an empty string when there are no numeric characters
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

	const handleAdditionalContactChange =
		(index: number, fieldName: string) =>
			(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
				const target = e.target;
				const inputValue = target.value;
				const cursorPosition = target.selectionStart || 0;

				// Capitalize the entire value
				let formattedValue = inputValue.toUpperCase();

				// Use a ref to store and retrieve the cursor position
				const cursorPositionRef: any = React.createRef<
					HTMLTextAreaElement | HTMLInputElement
				>();
				cursorPositionRef.current = target;

				// Schedule a microtask to set the cursor position after the re-render
				Promise.resolve().then(() => {
					if (cursorPositionRef.current !== undefined) {
						cursorPositionRef.current.setSelectionRange(cursorPosition, cursorPosition);
					}
				});

				// Update the formik state
				formik.handleChange(e);
				formik.setFieldValue(`additionalContactInfo[${index}].${fieldName}`, formattedValue);
			};

	return (
		<div className='col-span-12 flex flex-col gap-4 xl:col-span-6'>
			<Card>
				<CardBody>
					<div className='flex'>
						<div className='grow'>
							<Button
								className='flex w-full items-center justify-between rounded-none border-b text-lg font-bold px-[2px] py-[0px]'
								variant='outlined'
								onClick={() =>
									setAccordionStates({
										...accordionStates,
										AddContactInfo: !accordionStates.AddContactInfo,
									})
								}
								rightIcon={
									!accordionStates.AddContactInfo
										? 'HeroChevronUp'
										: 'HeroChevronDown'
								}>
								Additional Contact Information
							</Button>
						</div>
					</div>
					<Collapse isOpen={!accordionStates.AddContactInfo}>
						<div className='mt-4 grid grid-cols-6 gap-4'>
							<div className='col-span-12 lg:col-span-12'>
								{formik?.values?.additionalContactInfo?.map(
									(contact: any, index: number) => (
										<div className='mt-0' key={index}>
											<div className='flex items-end justify-end'>
												{formik.values.additionalContactInfo.length > 1 && (
													<Button
														type='button'
														onClick={() => handleDeleteContact(index)}
														variant='outlined'
														color='red'
														isDisable={!privileges.canWrite()}>
														<svg
															xmlns='http://www.w3.org/2000/svg'
															fill='none'
															viewBox='0 0 24 24'
															strokeWidth='1.5'
															stroke='currentColor'
															data-slot='icon'
															className='h-6 w-6'>
															<path
																strokeLinecap='round'
																strokeLinejoin='round'
																d='M6 18 18 6M6 6l12 12'
															/>
														</svg>
													</Button>
												)}
											</div>
											<div key={index} className='grid grid-cols-12 gap-4'>
												<div className='col-span-12 lg:col-span-4'>
													<Label htmlFor={`additionalName_${index}`}>
														Name
													</Label>
													<Input
														id={`additionalName_${index}`}
														name={`additionalContactInfo[${index}].additionalName`}
														onChange={handleAdditionalContactChange(
															index,
															'additionalName',
														)}
														value={contact.additionalName}
														autoComplete={`additionalName_${index}`}
														required
														onBlur={formik.handleBlur}
														disabled={!privileges.canWrite()}
													/>
													{formik.touched.additionalContactInfo?.[index]
														?.additionalName &&
														formik.errors.additionalContactInfo?.[index]
															?.additionalName ? (
														<div className='text-red-500'>
															{
																formik.errors.additionalContactInfo[
																	index
																].additionalName
															}
														</div>
													) : null}
												</div>
												<div className='col-span-12 lg:col-span-3'>
													<Label htmlFor={`additionalPhone_${index}`}>
														Phone
													</Label>
													<Input
														id={`additionalPhone_${index}`}
														name={`additionalContactInfo[${index}].additionalPhone`}
														onChange={(e) => {
															const formattedContactNumber =
																formatPhoneNumber(e.target.value);
															formik.handleChange(e);
															formik.setFieldValue(
																`additionalContactInfo[${index}].additionalPhone`,
																formattedContactNumber,
															);
														}}
														value={contact.additionalPhone}
														autoComplete={`additionalPhone_${index}`}
														required
														onBlur={formik.handleBlur}
														disabled={!privileges.canWrite()}
													/>
													{formik.touched.additionalContactInfo?.[index]
														?.additionalPhone &&
														formik.errors.additionalContactInfo?.[index]
															?.additionalPhone ? (
														<div className='text-red-500'>
															{
																formik.errors.additionalContactInfo[
																	index
																].additionalPhone
															}
														</div>
													) : null}
												</div>
												<div className='col-span-1 lg:col-span-1'>
													<Label htmlFor={`additionalPhoneExt_${index}`}>
														Ext.
													</Label>
													<Input
														id={`additionalPhoneExt_${index}`}
														name={`additionalContactInfo[${index}].additionalPhoneExt`}
														type='number'
														autoComplete={`additionalPhoneExt_${index}`}
														onChange={handleAdditionalContactChange(
															index,
															'additionalPhoneExt',
														)}
														value={contact.additionalPhoneExt}
														onBlur={formik.handleBlur}
														disabled={!privileges.canWrite()}
													/>
												</div>
												<div className='col-span-12 lg:col-span-4'>
													<Label htmlFor={`additionalMobile_${index}`}>
														Mobile
													</Label>
													<Input
														id={`additionalMobile_${index}`}
														name={`additionalContactInfo[${index}].additionalMobile`}
														onChange={(e) => {
															const formattedMobileNumber =
																formatPhoneNumber(e.target.value);
															formik.handleChange(e);
															formik.setFieldValue(
																`additionalContactInfo[${index}].additionalMobile`,
																formattedMobileNumber,
															);
														}}
														value={contact.additionalMobile}
														autoComplete={`additionalMobile_${index}`}
														required
														onBlur={formik.handleBlur}
														disabled={!privileges.canWrite()}
													/>
													{formik.touched.additionalContactInfo?.[index]
														?.additionalMobile &&
														formik.errors.additionalContactInfo?.[index]
															?.additionalMobile ? (
														<div className='text-red-500'>
															{
																formik.errors.additionalContactInfo[
																	index
																].additionalMobile
															}
														</div>
													) : null}
												</div>
												<div className='col-span-12 lg:col-span-4'>
													<Label htmlFor={`additionalFax_${index}`}>
														Fax
													</Label>
													<Input
														id={`additionalFax_${index}`}
														name={`additionalContactInfo[${index}].additionalFax`}
														onChange={(e) => {
															const formattedFaxNumber =
																formatPhoneNumber(e.target.value);
															formik.handleChange(e);
															formik.setFieldValue(
																`additionalContactInfo[${index}].additionalFax`,
																formattedFaxNumber,
															);
														}}
														value={contact.additionalFax}
														autoComplete={`additionalFax_${index}`}
														required
														onBlur={formik.handleBlur}
														disabled={!privileges.canWrite()}
													/>
													{formik.touched.additionalContactInfo?.[index]
														?.additionalFax &&
														formik.errors.additionalContactInfo?.[index]
															?.additionalFax ? (
														<div className='text-red-500'>
															{
																formik.errors.additionalContactInfo[
																	index
																].additionalFax
															}
														</div>
													) : null}
												</div>
												<div className='col-span-12 lg:col-span-4'>
													<Label htmlFor={`additionalEmail_${index}`}>
														Email
													</Label>
													<Input
														id={`additionalEmail_${index}`}
														name={`additionalContactInfo[${index}].additionalEmail`}
														onChange={handleAdditionalContactChange(
															index,
															'additionalEmail',
														)}
														value={contact.additionalEmail}
														autoComplete={`additionalEmail_${index}`}
														required
														multiple
														onBlur={formik.handleBlur}
														disabled={!privileges.canWrite()}
													/>
													{formik.touched.additionalContactInfo?.[index]
														?.additionalEmail &&
														formik.errors.additionalContactInfo?.[index]
															?.additionalEmail ? (
														<div className='text-red-500'>
															{
																formik.errors.additionalContactInfo[
																	index
																].additionalEmail
															}
														</div>
													) : null}
												</div>
												<div className='col-span-12 mb-5 lg:col-span-12'>
													<Label htmlFor={`additionalNotes_${index}`}>
														Notes
													</Label>
													<Textarea
														id={`additionalNotes_${index}`}
														name={`additionalContactInfo[${index}].additionalNotes`}
														onChange={handleAdditionalContactChange(
															index,
															'additionalNotes',
														)}
														value={contact.additionalNotes}
														autoComplete={`additionalNotes_${index}`}
														required
														onBlur={formik.handleBlur}
														disabled={!privileges.canWrite()}
													/>
												</div>
											</div>
										</div>
									),
								)}
								<Button
									onClick={handleAddContactClick}
									variant='outline'
									color='zinc'
									size='lg'
									className='w-64'
									isDisable={!privileges.canWrite()}>
									Add Contact
								</Button>
							</div>
						</div>
					</Collapse>
				</CardBody>
			</Card>
		</div>
	);
};

export default AdditionalContactInfo;
