import { useEffect, useState } from 'react';
import Card, { CardBody } from '../../../../components/ui/Card';
import Button from '../../../../components/ui/Button';
import Collapse from '../../../../components/utils/Collapse';
import Input from '../../../../components/form/Input';
import Label from '../../../../components/form/Label';
import PDF from './PDF';
import getUserRights from '../../../../hooks/useUserRights';

const LiabilityCertificate = ({
	newpdfFiles,
	setnewpdfFiles,
	setAccordionStates,
	formik,
	handleUploadButtonClick,
	handlePdfFileChange,
	isUploaded,
	selectedFileNames,
	setSelectedFileNames,
	accordionStates,
	pdfFiles,
	setChanged,
}: any) => {

	const privileges = getUserRights('vendors');
	return (
		<Card>
			<CardBody>
				<div className='flex'>
					<div className='bold w-full'>
						<Button
							variant='outlined'
							className='flex w-full items-center justify-between rounded-none border-b text-start text-lg font-bold px-[2px] py-[0px]'
							onClick={() =>
								setAccordionStates({
									...accordionStates,
									liabilityCert: !accordionStates.liabilityCert,
								})
							}
							rightIcon={
								!accordionStates.liabilityCert ? 'HeroChevronUp' : 'HeroChevronDown'
							}>
							Liability Certificate
						</Button>
					</div>
				</div>
				<Collapse isOpen={!accordionStates.liabilityCert}>
					<div className='mt-4 grid grid-cols-12 gap-4'>
						<div className='col-span-12 lg:col-span-6'>
							<PDF
								formik={formik}
								handleUploadButtonClick={handleUploadButtonClick}
								handlePdfFileChange={handlePdfFileChange}
								isUploaded={isUploaded}
								selectedFileNames={selectedFileNames}
								setSelectedFileNames={setSelectedFileNames}
								setPdfFiles={setnewpdfFiles}
								pdfFiles={newpdfFiles}
								setChanged={setChanged}
							/>
						</div>

						<div className='col-span-12 lg:col-span-6'>
							{pdfFiles.length > 0 &&
								[...pdfFiles].reverse().map((pdf: any) => (
									<div className='file-item' key={pdf.location}>
										<a
											className='file-name text-blue-500'
											target='_blank'
											href={pdf.location}>
											{pdf.originalName}
										</a>
									</div>
								))}
						</div>

						<div className='col-span-12 lg:col-span-6'>
							<Label htmlFor='startDate'>Start Date</Label>
							<Input
								id='startDate'
								name='startDate'
								type='date'
								onChange={formik.handleChange}
								value={formik.values.startDate}
								onBlur={formik.handleBlur}
								disabled={!privileges.canWrite()}
							/>
							{formik.touched.startDate && formik.errors.startDate ? (
								<div className='text-red-500'>{formik.errors.startDate}</div>
							) : null}
						</div>
						<div className='col-span-12 lg:col-span-6'>
							<Label htmlFor='endDate'>End Date</Label>
							<Input
								id='endDate'
								name='endDate'
								type='date'
								onChange={formik.handleChange}
								value={formik.values.endDate}
								onBlur={formik.handleBlur}
								disabled={!privileges.canWrite()}
							/>
							{formik.touched.endDate && formik.errors.endDate ? (
								<div className='text-red-500'>{formik.errors.endDate}</div>
							) : null}
						</div>
					</div>
				</Collapse>
			</CardBody>
		</Card>
	);
};

export default LiabilityCertificate;
