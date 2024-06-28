import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { get, put } from '../../../../utils/api-helper.util';
import Card, { CardBody } from '../../../../components/ui/Card';
import Button from '../../../../components/ui/Button';
import Label from '../../../../components/form/Label';
import Input from '../../../../components/form/Input';
import PageWrapper from '../../../../components/layouts/PageWrapper/PageWrapper';
import Container from '../../../../components/layouts/Container/Container';
import Checkbox from '../../../../components/form/Checkbox';
import { toast } from 'react-toastify';
import { PathRoutes } from '../../../../utils/routes/enum';
import Subheader, {
	SubheaderLeft,
	SubheaderSeparator,
} from '../../../../components/layouts/Subheader/Subheader';
import Textarea from '../../../../components/form/Textarea';
import Tooltip from '../../../../components/ui/Tooltip';
import Icon from '../../../../components/icon/Icon';
import UploadFile from '../../../../components/form/UploadFile';

const EditCustomerPage = () => {
	const [formData, setFormData] = useState<any>({
		name: '',
		email: '',
		phone: '',
		gst_number: '',
		company: '',
		address_line1: '',
		address_line2: '',
		city: '',
		state: '',
		zipcode: '',
		premium_discount: '',
		anodize_discount: '',
		commercial_discount: '',
	});
	const [files, setFiles] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [newFiles, setNewFiles] = useState<any[]>([]);
	const [fileErrors, setFileErrors] = useState<string[]>([]);
	const [selectedFileNames, setSelectedFileNames] = useState<any>([]);

	const navigate = useNavigate();

	const handleChange = (e: any) => {
		const { name, value, type, checked } = e.target;
		setFormData((prevState: any) => ({
			...prevState,
			[name]: type === 'checkbox' ? checked : value,
		}));
	};
	const { id } = useParams();
	const fetchCustomerById = async () => {
		try {
			const customer = await get(`/customers/${id}`);
			const {
				name,
				email,
				phone,
				gst_number,
				company,
				address_line1,
				address_line2,
				city,
				state,
				zipcode,
				premium_discount,
				anodize_discount,
				commercial_discount,
				file,
			} = customer.data;
			setFormData({
				name,
				email,
				phone,
				gst_number,
				company,
				address_line1,
				address_line2,
				city,
				state,
				zipcode,
				premium_discount,
				anodize_discount,
				commercial_discount,
			});
			const files = file?.map((file: any) => {
				return { ...file, add: true };
			});
			setFiles(files);
		} catch (error) {
			console.error('Error fetching Customer data:', error);
		}
	};

	useEffect(() => {
		fetchCustomerById();
	}, []);

	const editCustomer = async () => {
		try {
			setIsLoading(true);
			const formDataValue = new FormData();

			// Append existing formData values
			Object.entries(formData).forEach(([key, value]) => {
				if (value) {
					formDataValue.append(key, value as any);
				}
			});

			// Append new files
			newFiles.forEach((item) => {
				formDataValue.append('file', item);
			});

			// Prepare deleted files
			const deletedFiles = files
				.filter((item: any) => !item.add)
				.map(({ add, ...fileWithoutAdd }: any) => {
					return JSON.stringify(fileWithoutAdd);
				});

			// Append deleted files
			deletedFiles.forEach((item) => {
				formDataValue.append('deletedFiles', item);
			});

			await put(`/customers/${id}`, formDataValue);

			toast.success('Customer edited Successfully!');
		} catch (error: any) {
			console.error('Error Updating Customer', error);
			toast.error('Error Updating Customer', error);
		} finally {
			setIsLoading(false);
			navigate(PathRoutes.customer);
		}
	};

	const validateFiles = (files: FileList) => {
		const allowedTypes = [
			'application/pdf', // PDF files
			'image/jpeg', // JPEG images
			'image/jpg', // JPG images
			'image/png', // PNG images
			'application/msword', // DOC files (Microsoft Word)
			'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // DOCX files (Microsoft Word)
			'application/vnd.apple.pages', // Apple Pages documents
		];
		const errors: string[] = [];
		const selectedNames: string[] = [];
		let fileData: any = [];

		for (let i = 0; i < files.length; i++) {
			const file = files[i];
			if (!selectedFileNames?.includes(file.name)) {
				fileData.push(file);
				selectedNames.push(file.name);
				if (!allowedTypes.includes(file.type)) {
					errors.push(`${file.name} is not a valid file type.`);
				}
			}
		}

		const selectedFilesDate = [...newFiles, ...fileData];
		const selectedFilesName = [...selectedFileNames, ...selectedNames];
		console.log('selectedFilesDate :>> ', selectedFilesDate);
		if (errors.length > 0) {
			setFileErrors(errors);
		} else {
			setFileErrors([]);
			setSelectedFileNames(selectedFilesName);
			setNewFiles(Array.from(selectedFilesDate));
		}
	};

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files;
		if (files) {
			validateFiles(files);
		}
	};

	const removeFiles = () => {
		setSelectedFileNames('');
		setNewFiles([]);
	};

	const editFiles = (fileNameToUpdate: any) => {
		// Find the index of the file in the array based on fileName
		const fileIndex = files.findIndex((file: any) => file.fileName === fileNameToUpdate);

		if (fileIndex !== -1) {
			const updatedFiles: any = [...files];
			updatedFiles[fileIndex] = {
				...updatedFiles[fileIndex],
				add: !updatedFiles[fileIndex].add,
			};
			setFiles(updatedFiles);
		} else {
			console.error(`File with name '${fileNameToUpdate}' not found.`);
		}
	};

	const handleRemoveFile = (index?: number | null) => {
		if (index !== null) {
			const fileArray = formData?.file?.filter((_: any, idx: number) => idx !== index)
			const removeFileNames = selectedFileNames?.filter((_: any, idx: number) => idx !== index)
			setSelectedFileNames(removeFileNames)
			setFormData((prevState: any) => ({
				...prevState,
				file: fileArray,
			}));
		}
	}

	return (
		<PageWrapper name='Edit Customer' isProtectedRoute={true}>
			<Subheader>
				<SubheaderLeft>
					<Button
						icon='HeroArrowLeft'
						className='!px-0'
						onClick={() => navigate(`${PathRoutes.customer}`)}>
						{`${window.innerWidth > 425 ? 'Back to List' : ''}`}
					</Button>
					<SubheaderSeparator />
				</SubheaderLeft>
			</Subheader>
			<Container className='flex shrink-0 grow basis-auto flex-col '>
				<Card>
					<CardBody>
						<div className='mt-1 grid grid-cols-12 gap-2'>
							<div className='col-span-12 lg:col-span-3'>
								<Label htmlFor='name'>Name</Label>
								<Input
									id='name'
									name='name'
									value={formData.name}
									onChange={handleChange}
								/>
							</div>
							<div className='col-span-12 lg:col-span-3'>
								<Label htmlFor='email'>Email</Label>
								<Input
									id='email'
									name='email'
									value={formData.email}
									onChange={handleChange}
								/>
							</div>
							<div className='col-span-12 lg:col-span-3'>
								<Label htmlFor='phone'>Phone</Label>
								<Input
									id='phone'
									name='phone'
									value={formData.phone}
									onChange={handleChange}
								/>
							</div>
							<div className='col-span-12 lg:col-span-3'>
								<Label htmlFor='gst_number'>GST Number</Label>
								<Input
									id='gst_number'
									name='gst_number'
									value={formData.gst_number}
									onChange={handleChange}
								/>
							</div>
							<div className='col-span-12 lg:col-span-3'>
								<Label htmlFor='company'>Company</Label>
								<Input
									id='company'
									name='company'
									value={formData.company}
									onChange={handleChange}
								/>
							</div>

							<div className='col-span-12 lg:col-span-3'>
								<Label htmlFor='city'>City</Label>
								<Input
									id='city'
									name='city'
									value={formData.city}
									onChange={handleChange}
								/>
							</div>

							<div className='col-span-12 lg:col-span-3'>
								<Label htmlFor='state'>State</Label>
								<Input
									id='state'
									name='state'
									value={formData.state}
									onChange={handleChange}
								/>
							</div>
							<div className='col-span-12 lg:col-span-3'>
								<Label htmlFor='zipcode'>Zipcode</Label>
								<Input
									id='zipcode'
									name='zipcode'
									value={formData.zipcode}
									onChange={handleChange}
								/>
							</div>
							<div className='col-span-12 lg:col-span-4'>
								<Label htmlFor='premium_discount'>Premium Discount(%)</Label>
								<Input
									id='premium_discount'
									name='premium_discount'
									value={formData.premium_discount}
									onChange={handleChange}
								/>
								{/* ... Error handling for zipcode field */}
							</div>
							<div className='col-span-12 lg:col-span-4'>
								<Label htmlFor='anodize_discount'>Anodize Discount(%)</Label>
								<Input
									id='anodize_discount'
									name='anodize_discount'
									value={formData.anodize_discount}
									onChange={handleChange}
								/>
								{/* ... Error handling for zipcode field */}
							</div>
							<div className='col-span-12 lg:col-span-4'>
								<Label htmlFor='commercial_discount'>Commercial Discount(%)</Label>
								<Input
									id='commercial_discount'
									name='commercial_discount'
									value={formData.commercial_discount}
									onChange={handleChange}
								/>
								{/* ... Error handling for zipcode field */}
							</div>

							<div className='col-span-12 lg:col-span-6'>
								<Label htmlFor='address_line1'>Address Line 1</Label>
								<Textarea
									id='address_line1'
									name='address_line1'
									value={formData.address_line1}
									onChange={handleChange}
								/>
							</div>
							<div className='col-span-12 lg:col-span-6'>
								<Label htmlFor='address_line2'>Address Line 2</Label>
								<Textarea
									id='address_line2'
									name='address_line2'
									value={formData.address_line2}
									onChange={handleChange}
								/>
							</div>
						</div>

						<div className='col-span-12 mt-2'>
							<div className='flex items-center justify-between'>
								<Label htmlFor='upload Documents'>
									Upload Documents
								</Label>
								{selectedFileNames?.length > 0 ? (
									<Tooltip text={"Remove All Files"} placement='left'>
										<Icon
											className='mx-2 cursor-pointer w-8 h-8'
											icon={'CrossIcon'}
											onClick={removeFiles}
										/>
									</Tooltip>
								) : null}
							</div>
							<UploadFile
								handleFileChange={handleFileChange}
								multiple
								value={selectedFileNames}
								handleRemoveFile={handleRemoveFile}
							/>

							{fileErrors?.length > 0 && (
								<ul className='text-red-500'>
									{fileErrors.map((error, index) => (
										<li key={index}>{error}</li>
									))}
								</ul>
							)}
						</div>
						{files.length > 0 && (
							<div className='col-span-12 flex flex-col gap-2 mt-2'>
								<Label htmlFor=''>Edit upload documents</Label>
								<div className='flex gap-2 flex-wrap'>
									{files?.map((file: any) => (
										<div className='w-fit p-1.5 rounded-lg bg-zinc-200 dark:bg-zinc-600 flex items-center gap-2'>
											{file?.fileName?.split('-')[1]}
											<Tooltip text={"View File"} placement='top'>
												<Link
													to={file?.fileUrl}
													className='font-medium'
													target='_blank'
												>
													<Icon
														className='cursor-pointer w-6 h-6 text-blue-500'
														icon={'HeroEye'}
													/>
												</Link>
											</Tooltip>
											<Tooltip text={file?.add ? "Remove File" : "Add File"} placement='top'>
												<Icon
													className={`cursor-pointer w-6 h-6 ${file?.add ? "text-red-500" : "text-green-500"}`}
													icon={file?.add ? 'CrossIcon' : 'HeroPlus'}
													onClick={() => {
														editFiles(file?.fileName);
													}}
												/>
											</Tooltip>
										</div>
									))}
								</div>
							</div>
						)}

						<div className='mt-4 flex gap-2'>
							<Button
								variant='solid'
								color='blue'
								isLoading={isLoading}
								type='button'
								isDisable={isLoading}
								onClick={editCustomer}>
								Update Customer
							</Button>
						</div>
					</CardBody>
				</Card>
			</Container>
		</PageWrapper>
	);
};

export default EditCustomerPage;
