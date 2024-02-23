import React, { useEffect, useState } from 'react';
import { ref, uploadBytes, getDownloadURL, uploadBytesResumable } from 'firebase/storage';
import { storage } from '../../../../firebase';
import Label from '../../../../components/form/Label';
import Input from '../../../../components/form/Input';
import Button from '../../../../components/ui/Button';
import getUserRights from '../../../../hooks/useUserRights';
import Card, { CardBody } from '../../../../components/ui/Card';
import { useNavigate } from 'react-router-dom';

import Modal, { ModalHeader, ModalFooter, ModalFooterChild } from '../../../../components/ui/Modal';


const PDF = ({
    formik,
    handlePdfFileChange,
    selectedFileNames,
    setSelectedFileNames,
    setPdfFiles,
    pdfFiles,
    setChanged
}: any) => {
    const [previousPdfLength, setPreviousPdfLength] = useState(pdfFiles.length);
    const privileges = getUserRights('vendors');
    const navigation = useNavigate();


    useEffect(() => {
        const currentPdfLength = pdfFiles.length;
        if (currentPdfLength > previousPdfLength) {
            setChanged(true)
        }
        setPreviousPdfLength(currentPdfLength);
    }, [pdfFiles]);


    const handleRemovePdf = (index: any) => {
        setSelectedFileNames((prevNames: any) => prevNames.filter((_: any, i: any) => i !== index));
        setPdfFiles((prevFiles: any) => prevFiles.filter((_: any, i: number) => i !== index));
        const updatedPdfFiles = selectedFileNames.filter((_: any, i: number) => i !== index);
        formik.setFieldValue('pdfFiles', updatedPdfFiles);

        // If using input element to select files, clear the input value
        const inputElement: any = document.getElementById('pdfFiles');
        if (inputElement) {
            inputElement.value = '';
        }
    };

    return (
        <>
            <div className='col-span-12 lg:col-span-4'>
                <Label htmlFor='pdfFiles'>Upload PDFs</Label>
                <div className='file-upload-container'>
                    <input
                        id='pdfFiles'
                        name='pdfFiles'
                        type='file'
                        accept='.pdf'
                        onChange={handlePdfFileChange}
                        onBlur={formik.handleBlur}
                        // multiple
                        className='file-input'
                        style={{ display: 'none' }}
                        disabled={!privileges.canWrite()}
                    />
                    <div className='col-span-12 lg:col-span-4'>
                        <Label
                            htmlFor='pdfFiles'
                            style={{ fontSize: '15px', marginTop: '5px', marginLeft: '5px' }}>
                            {pdfFiles.length > 0
                                ? `Choose Files - File Chosen ${pdfFiles.length}`
                                : 'Choose File - No File Chosen'}
                        </Label>

                        {
                            pdfFiles.map((file: any, index: any) => (
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

        </>
    );
};

export default PDF;
