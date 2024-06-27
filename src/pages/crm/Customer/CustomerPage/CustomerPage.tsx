import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { post } from '../../../../utils/api-helper.util';
import { PathRoutes } from '../../../../utils/routes/enum';
import Card, { CardBody } from '../../../../components/ui/Card';
import Button from '../../../../components/ui/Button';
import Label from '../../../../components/form/Label';
import Input from '../../../../components/form/Input';
import PageWrapper from '../../../../components/layouts/PageWrapper/PageWrapper';
import Subheader, {
	SubheaderLeft,
	SubheaderRight,
	SubheaderSeparator,
} from '../../../../components/layouts/Subheader/Subheader';
import Container from '../../../../components/layouts/Container/Container';
import { toast } from 'react-toastify';
import Textarea from '../../../../components/form/Textarea';
import UploadFile from '../../../../components/form/UploadFile';
import Icon from '../../../../components/icon/Icon';
import Tooltip from '../../../../components/ui/Tooltip';

const CustomerPage = () => {
	const [formData, setFormData] = useState({
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
		file: [],
	});

	const [fileErrors, setFileErrors] = useState<string[]>([]);
	const [selectedFileNames, setSelectedFileNames] = useState<any>([]);

	const handleChange = (e: any) => {
		const { name, value, type, checked } = e.target;
		setFormData((prevState) => ({
			...prevState,
			[name]: type === 'checkbox' ? checked : value,
		}));
	};
	const navigate = useNavigate();

	const createCustomer = async () => {
		const formDataValue: any = new FormData();

		Object.entries(formData).forEach(([key, value]: any) => {
			if (key !== 'file') {
				formDataValue.append(key, value);
			} else {
				formData.file.forEach((item: any) => {
					formDataValue.append('file', item);
				});
			}
		});

		try {
			const customer = await post(
				'/customers',
				formDataValue,
				{
					headers: {
						'Content-Type': 'multipart/form-data',
					},
				},
			);

			toast.success('customer added Successfully!');
			navigate(PathRoutes.customer);
		} catch (error: any) {
			console.error('Error Saving customer', error);
			toast.error(error.response.data.message, error);
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
		setFileErrors([]);

		const errors: string[] = [];
		const selectedNames: string[] = [];
		let fileData: any = [];

		for (let i = 0; i < files?.length; i++) {
			const file = files[i];
			if (!selectedFileNames?.includes(file.name)) {
				fileData.push(file);
				selectedNames.push(file.name);
				if (!allowedTypes.includes(file.type)) {
					errors.push(`${file.name} is not a valid file type.`);
				}
			}
		}
		const filesDate = [...formData.file, ...fileData];
		const selectedFilesName = [...selectedFileNames, ...selectedNames];

		if (errors?.length > 0) {
			setFileErrors(errors);
		} else {
			setSelectedFileNames(selectedFilesName);
			// Update formData with selected files
			setFormData((prevState: any) => ({
				...prevState,
				file: Array.from(filesDate),
			}));
		}
	};

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files;
		if (files) {
			validateFiles(files);
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

	const removeFiles = () => {
		setSelectedFileNames([]);
		setFormData((prevState) => ({
			...prevState,
			file: [],
		}));
	};
	return (
		<PageWrapper name='ADD Customer' isProtectedRoute={true}>
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
			<Container className='flex shrink-0 grow basis-auto flex-col pb-0'>
				<div className='flex h-full flex-wrap content-start'>
					<div className='m-5 mb-4 grid w-full grid-cols-6 gap-1'>
						<div className='col-span-12 flex flex-col gap-1 xl:col-span-6'>
							<div className='col-span-12 flex flex-col gap-1 xl:col-span-6'>
								<Card>
									<CardBody>
										<div className='flex'>
											<div className='bold w-full'>
												<Button
													variant='outlined'
													className='flex w-full items-center justify-between rounded-none border-b px-[2px] py-[0px] text-start text-lg font-bold'>
													Add Customer
												</Button>
											</div>
										</div>

										<div className='mt-2 grid grid-cols-12 gap-2'>
											<div className='col-span-12 lg:col-span-3'>
												<Label htmlFor='name'>
													Name
													<span className='ml-1 text-red-500'>*</span>
												</Label>
												<Input
													id='name'
													name='name'
													value={formData.name}
													onChange={handleChange}
												/>
												{/* ... Error handling for name field */}
											</div>
											<div className='col-span-12 lg:col-span-3'>
												<Label htmlFor='email'>Email</Label>
												<Input
													id='email'
													name='email'
													value={formData.email}
													onChange={handleChange}
												/>
												{/* ... Error handling for email field */}
											</div>
											<div className='col-span-12 lg:col-span-3'>
												<Label htmlFor='phone'>Phone</Label>
												<Input
													id='phone'
													name='phone'
													value={formData.phone}
													onChange={handleChange}
												/>
												{/* ... Error handling for phone field */}
											</div>
											<div className='col-span-12 lg:col-span-3'>
												<Label htmlFor='gst_number'>GST Number</Label>
												<Input
													id='gst_number'
													name='gst_number'
													value={formData.gst_number}
													onChange={handleChange}
												/>
												{/* ... Error handling for GST Number field */}
											</div>
											<div className='col-span-12 lg:col-span-3'>
												<Label htmlFor='company'>Company</Label>
												<Input
													id='company'
													name='company'
													value={formData.company}
													onChange={handleChange}
												/>
												{/* ... Error handling for company field */}
											</div>

											<div className='col-span-12 lg:col-span-3'>
												<Label htmlFor='city'>City</Label>
												<Input
													id='city'
													name='city'
													value={formData.city}
													onChange={handleChange}
												/>
												{/* ... Error handling for city field */}
											</div>
											<div className='col-span-12 lg:col-span-3'>
												<Label htmlFor='state'>State</Label>
												<Input
													id='state'
													name='state'
													value={formData.state}
													onChange={handleChange}
												/>
												{/* ... Error handling for state field */}
											</div>
											<div className='col-span-12 lg:col-span-3'>
												<Label htmlFor='zipcode'>Zipcode</Label>
												<Input
													id='zipcode'
													name='zipcode'
													value={formData.zipcode}
													onChange={handleChange}
												/>
												{/* ... Error handling for zipcode field */}
											</div>
											<div className='col-span-12 lg:col-span-4'>
												<Label htmlFor='premium_discount'>
													Premium Discount (%)
												</Label>
												<Input
													type='number'
													id='premium_discount'
													name='premium_discount'
													value={formData.premium_discount}
													onChange={handleChange}
													min={0}
													max={100}
												/>
												{/* ... Error handling for zipcode field */}
											</div>
											<div className='col-span-12 lg:col-span-4'>
												<Label htmlFor='anodize_discount'>
													Anodize Discount (%)
												</Label>
												<Input
													type='number'
													id='anodize_discount'
													name='anodize_discount'
													value={formData.anodize_discount}
													onChange={handleChange}
													min={0}
													max={100}
												/>
												{/* ... Error handling for zipcode field */}
											</div>

											<div className='col-span-12 lg:col-span-4'>
												<Label htmlFor='commercial_discount'>
													Commercial Discount (%)
												</Label>
												<Input
													type='number'
													id='commercial_discount'
													name='commercial_discount'
													value={formData.commercial_discount}
													onChange={handleChange}
													min={0}
													max={100}
												/>
												{/* ... Error handling for zipcode field */}
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
											<div className='col-span-12 lg:col-span-6'>
												<Label htmlFor='address_line1'>
													Address Line 1
												</Label>
												<Textarea
													id='address_line1'
													name='address_line1'
													value={formData.address_line1}
													onChange={handleChange}
												/>
												{/* ... Error handling for address_line1 field */}
											</div>
											<div className='col-span-12 lg:col-span-6'>
												<Label htmlFor='address_line2'>
													Address Line 2
												</Label>
												<Textarea
													id='address_line2'
													name='address_line2'
													value={formData.address_line2}
													onChange={handleChange}
												/>
												{/* ... Error handling for address_line2 field */}
											</div>
										</div>
										<div className='mt-2 flex gap-2'>
											<Button
												variant='solid'
												color='blue'
												type='button'
												isDisable={formData.name === ''}
												onClick={createCustomer}>
												Save Customer
											</Button>
										</div>
									</CardBody>
								</Card>
							</div>
						</div>
					</div>
				</div>
			</Container>
		</PageWrapper>
	);
};

export default CustomerPage;
