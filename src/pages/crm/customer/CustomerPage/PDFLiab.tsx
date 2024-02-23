import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Label from '../../../../components/form/Label';
import Button from '../../../../components/ui/Button';
import getUserRights from '../../../../hooks/useUserRights';

const PDF = ({
	formik,
	handlePdfLiabFileChange,
	selectedPdfLiabFileNames,
	setSelectedPdfLiabFileNames,
	setPdfLiabFiles,
	pdfLiabFiles,
	setChanged,
}: any) => {
	const [previousPdfLength, setPreviousPdfLength] = useState(pdfLiabFiles.length);
	const privileges = getUserRights('vendors');
	const navigation = useNavigate();

	useEffect(() => {
		const currentPdfLength = pdfLiabFiles.length;
		if (currentPdfLength > previousPdfLength) {
			setChanged(true);
		}
		setPreviousPdfLength(currentPdfLength);
	}, [pdfLiabFiles]);

	const handleRemovePdf = (index: any) => {
		setSelectedPdfLiabFileNames((prevNames: any) => prevNames.filter((_: any, i: any) => i !== index));
		setPdfLiabFiles((prevFiles: any) => prevFiles.filter((_: any, i: number) => i !== index));
		const updatedPdfFiles = selectedPdfLiabFileNames.filter((_: any, i: number) => i !== index);
		formik.setFieldValue('pdfLiabFiles', updatedPdfFiles);

		// If using input element to select files, clear the input value
		const inputElement: any = document.getElementById('pdfLiabFiles');
		if (inputElement) {
			inputElement.value = '';
		}
	};

	return (
		<div className='col-span-12 lg:col-span-4'>
			<Label htmlFor='pdfLiabFiles'>Upload PDFs</Label>
			<div className='file-upload-container'>
				<input
					id='pdfLiabFiles'
					name='pdfLiabFiles'
					type='file'
					accept='.pdf'
					onChange={handlePdfLiabFileChange}
					onBlur={formik.handleBlur}
					// multiple
					className='file-input'
					style={{ display: 'none' }}
					disabled={!privileges.canWrite()}
				/>
				<div className='col-span-12 lg:col-span-4'>
					<Label
						htmlFor='pdfLiabFiles'
						style={{ fontSize: '15px', marginTop: '5px', marginLeft: '5px' }}>
						{pdfLiabFiles.length > 0
							? `Choose Files - File Chosen ${pdfLiabFiles.length}`
							: 'Choose File - No File Chosen'}
					</Label>

					{pdfLiabFiles.map((file: any, index: any) => (
						<div key={index} className='file-item'>
							<span className='file-name text-blue-500'>{file.name}</span>
							<Button
								type='button'
								onClick={() => handleRemovePdf(index)}
								variant='outlined'
								color='red'
								style={{ marginLeft: '8px' }}>
								<svg
									xmlns='http://www.w3.org/2000/svg'
									fill='none'
									viewBox='0 0 24 24'
									strokeWidth='1.5'
									strokeLinecap='round'
									strokeLinejoin='round'
									stroke='currentColor'
									data-slot='icon'
									className='h-6 w-6'>
									<path d='M6 18 18 6M6 6l12 12' />
								</svg>
							</Button>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default PDF;
