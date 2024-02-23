import { useState, useEffect } from 'react';
import Card, { CardBody } from '../../../../components/ui/Card';
import PDF from './PDF';
import Input from '../../../../components/form/Input';
import Label from '../../../../components/form/Label';
import Select from '../../../../components/form/Select';
import Collapse from '../../../../components/utils/Collapse';
import Button from '../../../../components/ui/Button';
import getUserRights from '../../../../hooks/useUserRights';
import { handleInputChange } from '../../../../utils/capitalizedFunction.util';

const TaxInfo = ({
	newPdfFiles,
	setNewPdfFiles,
	setAccordionStates,
	formik,
	handlePdfFileChange,
	selectedFileNames,
	setSelectedFileNames,
	accordionStates,
	pdfFiles,
	setChanged,
}: any) => {
	const [isTaxable, setIsTaxable] = useState(false);

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
										taxInfo: !accordionStates.taxInfo,
									})
								}
								rightIcon={
									!accordionStates.taxInfo ? 'HeroChevronUp' : 'HeroChevronDown'
								}>
								Tax Information
							</Button>
						</div>
					</div>
					<Collapse isOpen={!accordionStates.taxInfo}>
						<div className='mt-4 grid grid-cols-12 gap-4'>
							<div className='col-span-12 lg:col-span-4'>
								<Label htmlFor='taxable'>Taxable</Label>
								<Select
									id='taxable'
									name='taxable'
									onChange={(e) => {
										formik.handleChange(e);
										setIsTaxable(e.target.value === 'YES');
									}}
									value={formik.values.taxable}
									onBlur={formik.handleBlur}
									disabled={!privileges.canWrite()}>
									{/* <option value='' label='Select Taxable' /> */}
									<option value='NO' label='NO' />
									<option value='YES' label='YES' />
								</Select>
								{formik.touched.taxable && formik.errors.taxable ? (
									<div className='text-red-500'>{formik.errors.taxable}</div>
								) : null}
							</div>
							{!isTaxable && (
								<>
									<div className='col-span-12 lg:col-span-4'>
										<Label htmlFor='taxJurisdiction'>Tax Jurisdiction</Label>
										<Input
											id='taxJurisdiction'
											name='taxJurisdiction'
											onChange={handleInputChange(formik.setFieldValue)(
												'taxJurisdiction',
											)}
											value={formik.values.taxJurisdiction}
											onBlur={formik.handleBlur}
											disabled={!privileges.canWrite()}
										/>
									</div>
									<div className='col-span-12 lg:col-span-4'>
										<Label htmlFor='certExpiryDate'>Tax Exempt Cert. #</Label>
										<Input
											id='TaxExemptCert'
											name='TaxExemptCert'
											onChange={handleInputChange(formik.setFieldValue)(
												'TaxExemptCert',
											)}
											value={formik.values.TaxExemptCert}
											onBlur={formik.handleBlur}
											disabled={!privileges.canWrite()}
										/>
										{formik.touched.TaxExemptCert &&
											formik.errors.TaxExemptCert ? (
											<div className='text-red-500'>
												{formik.errors.TaxExemptCert}
											</div>
										) : null}
									</div>
									<div className='col-span-12 lg:col-span-4'>
										<Label htmlFor='certExpiryDate'>Cert. Expiry Date</Label>
										<Input
											id='certExpiryDate'
											name='certExpiryDate'
											type='date'
											onChange={formik.handleChange}
											value={formik.values.certExpiryDate}
											onBlur={formik.handleBlur}
											disabled={!privileges.canWrite()}
										/>
										{formik.touched.certExpiryDate &&
											formik.errors.certExpiryDate ? (
											<div className='text-red-500'>
												{formik.errors.certExpiryDate}
											</div>
										) : null}
									</div>
									<div className='col-span-12 lg:col-span-4'>
										<PDF
											formik={formik}
											handlePdfFileChange={handlePdfFileChange}
											selectedFileNames={selectedFileNames}
											setSelectedFileNames={setSelectedFileNames}
											setPdfFiles={setNewPdfFiles}
											pdfFiles={newPdfFiles}
											setChanged={setChanged}
										/>
									</div>
									<div className='col-span-12 lg:col-span-4' style={{ maxHeight: '80px', overflowY: 'scroll' }}>
										<p>File Count: {pdfFiles.length}</p>
										{pdfFiles.length > 0 &&
											[...pdfFiles].reverse().map((pdf: any) => {
												return (
													<div className='file-item' key={pdf.location}>
														<a
															className='file-name text-blue-500'
															target='_blank'
															href={pdf.location}>
															{pdf.originalName}
														</a>
													</div>
												);
											})}
									</div>
								</>
							)}
						</div>
					</Collapse>
				</CardBody>
			</Card>
		</div>
	);
};

export default TaxInfo;
