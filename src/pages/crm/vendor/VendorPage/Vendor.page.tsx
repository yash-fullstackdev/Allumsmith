import { useNavigate, useParams } from 'react-router-dom';
import PageWrapper from '../../../../components/layouts/PageWrapper/PageWrapper';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useFormik } from 'formik';
import { vendorSchema } from '../../../../utils/formValidations';
import { collection, doc, getDoc, getDocs, setDoc, updateDoc } from 'firebase/firestore';
import { firestore } from '../../../..';
import { appPages } from '../../../../config/pages.config';
import { toast } from 'react-toastify';
import Card, { CardBody } from '../../../../components/ui/Card';
import Textarea from '../../../../components/form/Textarea';
import Collapse from '../../../../components/utils/Collapse';
import Subheader, {
	SubheaderLeft,
	SubheaderRight,
	SubheaderSeparator,
} from '../../../../components/layouts/Subheader/Subheader';
import Button from '../../../../components/ui/Button';
import Badge from '../../../../components/ui/Badge';
import Container from '../../../../components/layouts/Container/Container';
import VendorInfo from './VendorInfo';
import MasterContact from './MasterContact';
import POOrderEmail from './POOrderEmail';
import SalesRepInfo from './SalesRepInfo';
import Terms from './Terms';
import CreditLimit from './CreditLimit';
import CustomerInfo from './CustomerInfo';
import useSaveBtn from '../../../../hooks/useSaveBtn';
import Modal, { ModalFooter, ModalFooterChild, ModalHeader } from '../../../../components/ui/Modal';
import ARContactInfo from './ARContactInfo';
import LiabilityCertificate from './LiabilityCertificate';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { storage } from '../../../../firebase';
import { v4 as uuidv4 } from 'uuid';
import dayjs from 'dayjs';
import POReminder from './POReminder';
import getUserRights from '../../../../hooks/useUserRights';
import { deepEqual } from '../../../../utils/backToList.util';
const listLinkPath = `../${appPages.crmAppPages.subPages.vendorPage.subPages.listPage.to}`;
const VendorPage = () => {
	const [userName, setuserName] = useState('');

	const { id } = useParams();
	const [vendorNumber, setVendorNumber] = useState('100001');
	const [editVendor, setEditVendor] = useState<any>({});
	const [formSubmitted, setFormSubmitted] = useState<boolean>(false);
	const [formattedVendorNumber, setFormattedVendorNumber] = useState('');
	const [pdfFiles, setPdfFiles] = useState<any>([]);
	const [newpdfFiles, setnewpdfFiles] = useState<any>([]);
	const [isUploaded, setIsUploaded] = useState(false);
	const [selectedFileNames, setSelectedFileNames] = useState<any>([]);
	const [collapseAll, setCollapseAll] = useState<boolean>(false);
	const [prevData, setPrevData] = useState<any>({});
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const isNewItem = id === 'new';
	const [isSaving, setIsSaving] = useState<boolean>(false);
	const navigation = useNavigate();
	const firebaseCounterKey = 'vendorCounter'; // replace with vendorCounter when data is available
	const firebaseMainKey = 'vendors'; // replace with vendors when data is available
	const userDb: any | undefined = editVendor || {};
	const createUserInitialValues = {
		vendorNumber: 'V100001',
		country: 'USA',
		custPORequired: 'YES',
		salesRep: [
			{ salesRepName: '', salesRepEmail: '', salesRepPhone: '', salesRepPhoneExt: '' },
		],
		poReminders: [''],
		ARContacts: [
			{
				ARContact: '',
				ARphoneNumber: '',
				ARphoneNumberExt: '',
				ARemail: '',
				ARnotes: '',
				paymentEmail: '',
			},
		],
		notes: [''],
	};
	const [isChangedPDF, setIsChangedPDF] = useState<boolean>(false);


	const initialValues: any = useMemo(
		() => (id == 'new' ? { ...createUserInitialValues } : createUserInitialValues),
		[],
	);

	const formik: any = useFormik({
		initialValues,
		enableReinitialize: true,
		validationSchema: vendorSchema,
		onSubmit: () => {
			setFormSubmitted(true);
		},
	});

	const { saveBtnColor } = useSaveBtn({
		isNewItem,
		isSaving,
		isDirty: formik.dirty,
	});

	const [backToListModal, setBackToListModal] = useState(false);
	const [accordionStates, setAccordionStates] = useState({
		vendorInfo: false,
		ARContactInfo: false,
		MCI: false,
		POOrderEmail: false,
		salesRepresentative: false,
		Terms: false,
		creditLimit: false,
		custInfo: false,
		spInstructions: false,
		liabilityCert: false,
		POReminder: false,
		notes: false,
	});

	interface MasterSettings {
		terms: any[];
	}

	const [masterSettings, setMasterSettings] = useState<MasterSettings>({
		terms: [],
	});
	const [masterSettingsFetched, setMasterSettingsFetched] = useState(false);

	useEffect(() => {
		if (!masterSettingsFetched) {
			getMasterSettings();
		}

		if (masterSettingsFetched) {
			if (id !== 'new') {
				getVendorDoc(id);
			} else {
				getLatestVendorNumberFromFirestore();
			}
		}
	}, [masterSettingsFetched, id]);

	const getuserName = useCallback(() => {
		setuserName(`${localStorage.getItem('firstName')} ${localStorage.getItem('lastName')}`);
	}, []);

	useEffect(() => {
		getuserName();
	}, [getuserName]);

	const getVendorDoc = useCallback(async (vendorId: any) => {
		try {
			const vendorData = await getDoc(doc(firestore, `${firebaseMainKey}/${vendorId}`));
			const prevData: any = vendorData.data();
			setPrevData(prevData);

			formik.setValues({
				...formik.values,
				...vendorData.data(),

				vendorNumber: vendorData.data()?.vendorNumber,
			});
			setPdfFiles(prevData.pdfFiles);
		} catch (error) {
			console.error('Error fetching Vendor Data', error);
		}
	}, []);

	const getLatestVendorNumberFromFirestore = async () => {
		try {
			const counterDocRef = doc(firestore, 'counters', 'vendorCounter');
			const counterDoc = await getDoc(counterDocRef);

			if (!counterDoc.exists()) return 100000;
			const latestCounter = counterDoc.data().value;
			formik.setFieldValue('vendorNumber', `V${latestCounter}`);
			setFormattedVendorNumber(`V${latestCounter}`);
			setVendorNumber(latestCounter);
			return latestCounter;
		} catch (error) {
			console.error('Error fetching latest vendor number: ', error);
		}
	};

	const updateVendorInFirestore = async (vendorId: any, updatedVendorData: any) => {
		try {
			if (!updatedVendorData) throw new Error('updatedVendorData is undefined');

			const notesData = updatedVendorData.notes || [''];
			// Added - Before Updating in Firestore
			// Comparing Notes
			const modifiedNotes = updateNotesWithName(prevData.notes || [''], notesData);

			const vendorDocRef = doc(firestore, firebaseMainKey, vendorId);
			const vendorDoc = await getDoc(vendorDocRef);
			if (!vendorDoc.exists()) throw new Error('Vendor document does not exists');
			const newPDFURLS: any = await handleUploadButtonClick();
			console.log('test', newPDFURLS);
			await updateDoc(vendorDocRef, {
				...updatedVendorData,
				pdfFiles: [...pdfFiles, ...newPDFURLS],
				notes: modifiedNotes,
			});

			navigation(listLinkPath);
			toast.success('Data updated successfully!');
		} catch (error) {
			console.error('Error: ', error);
		}
	};
	const saveVendorToFirestore = async (vendorData: any, formattedVendorNumber: any) => {
		try {
			if (!vendorData) throw new Error('updatedVendorData is undefined');

			const notesData = vendorData.notes || [];
			// Added - Before Updating in Firestore
			// Comparing Notes
			const modifiedNotes = updateNotesWithName([''], notesData);

			const vendorDocRef = doc(firestore, firebaseMainKey, formattedVendorNumber);
			const vendorDoc = await getDoc(vendorDocRef);

			if (vendorDoc.exists()) {
				await updateDoc(vendorDocRef, {
					...vendorData,
					notes: modifiedNotes,
				});
			} else {
				const counterDocRef = doc(firestore, 'counters', firebaseCounterKey);
				const counterDoc = await getDoc(counterDocRef);
				if (counterDoc.exists()) {
					await updateDoc(counterDocRef, { value: vendorNumber + 1 });
				}
				const newPDFURLS = await handleUploadButtonClick();
				console.log('test add pdf', newPDFURLS);
				const docRef = await setDoc(
					doc(firestore, firebaseMainKey, formattedVendorNumber),
					{
						...vendorData,
						pdfFiles: newPDFURLS,
						notes: modifiedNotes,
					},
				);
				console.log(docRef);
			}
			navigation(listLinkPath);
			toast.success('Data saved successfully!');
		} catch (error: any) {
			console.error('Error: adding data ', error);
			toast.error('Error adding data: ', error);
		}
	};

	const handleDelete = (url: any) => {
		const filteredArray = pdfFiles.filter((file: any) => file.location !== url);
		setPdfFiles(filteredArray);
	};
	const handlePdfFileChange = async (event: any) => {
		let selectedFiles: any = [];
		Object.entries(event.target.files).map(([_, value]: any) => {
			selectedFiles.push(value);
		});
		console.log('selected files', selectedFiles);
		setnewpdfFiles(selectedFiles);
	};
	const handleUploadButtonClick = async () => {
		try {
			const fileURLs = [];
			for (const file of newpdfFiles) {
				const uuid = uuidv4();
				const fileRef = ref(storage, `pdfs/${uuid}.pdf`);
				await uploadBytes(fileRef, file, {
					customMetadata: {
						originalName: file.name,
					},
				});
				const downloadURL = await getDownloadURL(fileRef);
				fileURLs.push({
					fileName: `${uuid}.pdf`,
					location: downloadURL,
					originalName: file.name,
				});
			}
			return fileURLs;
		} catch (error) {
			console.error('Upload error:', error);
		}
	};
	const handleSaveButtonClick = async () => {
		try {
			setIsLoading(true);
			console.log('loading status', isLoading);

			await formik.validateForm();

			const handleNestedErrors = (errors: any, prefix = '') => {
				//  logic to touch the field which are not validated
				Object.keys(errors).forEach((errorField) => {
					const fieldName = prefix ? `${prefix}.${errorField}` : errorField;

					if (typeof errors[errorField] === 'object' && errors[errorField] !== null) {
						// Recursive call for nested errors
						handleNestedErrors(errors[errorField], fieldName);
					} else {
						// Set the field as touched and set the error
						formik.setFieldTouched(fieldName, true, false);
						formik.setFieldError(fieldName, errors[errorField]);
					}
				});
			};

			if (Object.keys(formik.errors).length > 0) {
				handleNestedErrors(formik.errors);

				toast.error(`Please fill all the mandatory fields and check all formats`);
				return;
			}

			if (!formik.values.Name) {
				toast.error('Name Field is Required');
			}

			const vendorData = {
				vendorStatus: formik.values.vendorStatus,
				Name: formik.values.Name,
				dbaName: formik.values.dbaName || null,
				address: formik.values.address,
				address2: formik.values.address2 || null,
				address3: formik.values.address3 || null,
				city: formik.values.city,
				state: formik.values.state,
				zipcode: formik.values.zipcode,
				country: formik.values.country,
				phoneNumber: formik.values.phoneNumber,
				phoneNumberExt: formik.values.phoneNumberExt || null,
				phoneNumber2: formik.values.phoneNumber2 || null,
				phoneNumber2Ext: formik.values.phoneNumber2Ext || null,
				fax: formik.values.fax || null,
				URL: formik.values.URL || null,
				email: formik.values.email || null,
				masterContact: formik.values.masterContact || null,
				masterContactEmail: formik.values.masterContactEmail || null,
				masterContactNotes: formik.values.masterContactNotes || null,
				POEmail: formik.values.POEmail || null,
				salesRep: formik.values.salesRep.map((rep: any) => ({
					salesRepName: rep.salesRepName || null,
					salesRepPhone: rep.salesRepPhone || null,
					salesRepEmail: rep.salesRepEmail || null,
				})),
				terms: formik.values.terms || null,
				pricingTerms: formik.values.pricingTerms || null,
				termsNote: formik.values.termsNote || null,
				creditLimit: formik.values.creditLimit || null,
				custPORequired: formik.values.custPORequired || null,
				specialInstruction: formik.values.spInstruction || null,
				vendorNumber: formattedVendorNumber || null,
				poContact: formik.values.poContact || null,
				pophoneNumber: formik.values.pophoneNumber || null,
				paymentMethod: formik.values.paymentMethod || null,
				shippingTerms: formik.values.shippingTerms || null,
				customerInVendor: formik.values.customerInVendor || null,
				pdfFiles,
				startDate: formik.values.startDate || null,
				endDate: formik.values.endDate || null,
				ARContacts: formik.values.ARContacts.map((data: any) => ({
					ARContact: data.ARContact || null,
					ARphoneNumber: data.ARphoneNumber || null,
					ARemail: data.ARemail || null,
					ARnotes: data.ARnotes || null,
					paymentEmail: data.paymentEmail || null,
				})),
				poReminders: formik.values.poReminders || null,
				freeShippingOrderValue: formik.values.freeShippingOrderValue || null,
				notes: formik.values.notes || null,
			};

			if (id === 'new') {
				const vendorId = await saveVendorToFirestore(vendorData, formattedVendorNumber);
			} else {
				const vendorId = formik.values.vendorNumber;
				await updateVendorInFirestore(vendorId, formik.values);
			}
		} catch (error) {
			console.error('Error Saving Vendor: ', error);
		} finally {
			setIsLoading(false);
			console.log('loading status', isLoading);
		}
	};

	const getMasterSettings = async () => {
		try {
			const settingRef = await getDocs(collection(firestore, 'masterSettings'));
			interface SettingsDataType {
				[key: string]: unknown;
			}
			const settingsData: SettingsDataType = {};

			for (const setting of settingRef.docs) {
				const { finalValues } = setting.data();
				settingsData[setting.id] = finalValues;
			}

			const updatedSettings: MasterSettings = {
				...masterSettings,
				...(settingsData as Partial<MasterSettings>),
			};

			setMasterSettings(updatedSettings);
			setMasterSettingsFetched(true); // Update state to indicate settings are fetched
		} catch (error) { }
	};

	const collapseAllAccordians = () => {
		setAccordionStates({
			vendorInfo: !collapseAll,
			ARContactInfo: !collapseAll,
			MCI: !collapseAll,
			POOrderEmail: !collapseAll,
			salesRepresentative: !collapseAll,
			Terms: !collapseAll,
			creditLimit: !collapseAll,
			custInfo: !collapseAll,
			spInstructions: !collapseAll,
			liabilityCert: !collapseAll,
			POReminder: !collapseAll,
			notes: !collapseAll,
		});
		setCollapseAll(!collapseAll);
	};

	const handleChangeNotes = (event: React.ChangeEvent<HTMLTextAreaElement>, index: number) => {
		const target = event.target;
		const inputValue = target.value;
		const cursorPosition = target.selectionStart || 0;

		// Capitalize the entire value
		let formattedValue = inputValue.toUpperCase();

		// Store the current cursor position
		let storedCursorPosition = cursorPosition;

		// Update the formik state
		formik.handleChange(event);

		// Update the notes array with the formatted value
		const newNotes = [...formik.values.notes];
		newNotes[index] = formattedValue;
		formik.setFieldValue('notes', newNotes);

		// Schedule a microtask to set the cursor position after the re-render
		Promise.resolve().then(() => {
			if (target !== undefined) {
				target.setSelectionRange(storedCursorPosition, storedCursorPosition);
			}
		});
	};

	const handleAddNote = () => {
		formik.setFieldValue('notes', [...formik.values.notes, '']);
	};

	const updateNotesWithName = (original: unknown[], updated: unknown) => {
		const updatedNotes = [...(updated as any[])]; // Create a copy to avoid modifying the original array
		const currentDate = dayjs().format('DD MMM YYYY'); // Get current date in desired format

		updatedNotes.forEach((note, index) => {
			// Check if the index exists in originalNotesData and if the content is different
			if (original[index] && original[index] !== note) {
				// Update the note in updatedNotes array and add "Saurav"
				updatedNotes[index] += `\r\nModified by ${userName} on ${currentDate}`;
			} else if (!original[index] && note !== '') {
				// If the note doesn't exist in originalNotesData, consider it as a new note
				updatedNotes[index] += `\r\nAdded by ${userName} on ${currentDate}`;
			}
		});
		return updatedNotes;
	};

	const backToList = () => {
		if (id !== 'new') {
			if (isChangedPDF) {
				setBackToListModal(true);
			} else {
				if (deepEqual(prevData, formik.values)) {
					navigation(listLinkPath);
				} else {
					setBackToListModal(true);
				}
			}
		} else {
			navigation(listLinkPath);
		}
	};
	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);
	const privileges = getUserRights('vendors');
	return privileges.canRead() ? (
		<PageWrapper name={isNewItem ? 'New Vendor' : `${id}`}>
			<Subheader>
				<SubheaderLeft>
					<Button icon='HeroArrowLeft' className='!px-0' onClick={() => backToList()}>
						{`${window.innerWidth > 425 ? 'Back to List' : ''}`}
					</Button>
					<SubheaderSeparator />
					{isNewItem ? (
						'Add New Vendor'
					) : (
						<>
							{formik.values.vendorNumber && formik.values.Name
								? `#${formik.values.vendorNumber} ${formik.values.Name}`
								: ``}{' '}
							<Badge
								color='blue'
								variant='outline'
								rounded='rounded-full'
								className='border-transparent'>
								Edit Vendor
							</Badge>
						</>
					)}
				</SubheaderLeft>
				<SubheaderRight>
					<div className='col-span-1'>
						<Button
							variant='solid'
							color='emerald'
							className='mr-5'
							onClick={() => collapseAllAccordians()}>
							{!collapseAll ? 'Collapse All Information' : 'Expand All Information'}
						</Button>
					</div>
					<div className='col-span-1'>
						<Button
							variant='solid'
							color='blue'
							type='button'
							className='w-full'
							onClick={handleSaveButtonClick}
							isDisable={!privileges.canWrite() || isLoading}>
							{!id || id !== 'new' ? 'Update' : 'Create'}
						</Button>
					</div>
				</SubheaderRight>
			</Subheader>
			<Container className='flex shrink-0 grow basis-auto flex-col pb-0'>
				<div className='flex h-full flex-wrap content-start'>
					<div className='m-5 mb-4 grid w-full grid-cols-6 gap-4'>
						<div className='col-span-12 flex flex-col gap-4 xl:col-span-6'>
							<VendorInfo
								formik={formik}
								accordionStates={accordionStates}
								setAccordionStates={setAccordionStates}
								collapseAll={collapseAll}
								setCollapseAll={setCollapseAll}
							/>
						</div>
						<div className='col-span-12 flex flex-col gap-4 xl:col-span-6'>
							<MasterContact
								formik={formik}
								accordionStates={accordionStates}
								setAccordionStates={setAccordionStates}
							/>
						</div>
						<div className='col-span-12 flex flex-col gap-4 xl:col-span-6'>
							<POOrderEmail
								formik={formik}
								accordionStates={accordionStates}
								setAccordionStates={setAccordionStates}
							/>
						</div>
						<div className='col-span-12 flex flex-col gap-4 xl:col-span-6'>
							<ARContactInfo
								formik={formik}
								accordionStates={accordionStates}
								setAccordionStates={setAccordionStates}
							/>
						</div>
						<div className='col-span-12 flex flex-col gap-4 xl:col-span-6'>
							<SalesRepInfo
								formik={formik}
								accordionStates={accordionStates}
								setAccordionStates={setAccordionStates}
							/>
						</div>
						<div className='col-span-12 flex flex-col gap-4 xl:col-span-6'>
							<Terms
								formik={formik}
								masterSettings={masterSettings}
								accordionStates={accordionStates}
								setAccordionStates={setAccordionStates}
							/>
						</div>
						<div className='col-span-12 flex flex-col gap-4 xl:col-span-6'>
							<CreditLimit
								formik={formik}
								accordionStates={accordionStates}
								setAccordionStates={setAccordionStates}
							/>
						</div>
						<div className='col-span-12 flex flex-col gap-4 xl:col-span-6'>
							<POReminder
								formik={formik}
								accordionStates={accordionStates}
								setAccordionStates={setAccordionStates}
							/>
						</div>
						<div className='col-span-12 flex flex-col gap-4 xl:col-span-6'>
							<CustomerInfo
								formik={formik}
								accordionStates={accordionStates}
								setAccordionStates={setAccordionStates}
							/>
						</div>
						<div className='col-span-12 flex flex-col gap-4 xl:col-span-6'>
							<LiabilityCertificate
								formik={formik}
								accordionStates={accordionStates}
								setAccordionStates={setAccordionStates}
								vendorNumber={vendorNumber}
								handleUploadButtonClick={handleUploadButtonClick}
								handlePdfFileChange={handlePdfFileChange}
								isUploaded={isUploaded}
								selectedFileNames={selectedFileNames}
								setSelectedFileNames={setSelectedFileNames}
								setPdfFiles={setPdfFiles}
								pdfFiles={pdfFiles}
								setChanged={() => setIsChangedPDF(true)}
								newpdfFiles={newpdfFiles}
								setnewpdfFiles={setnewpdfFiles}
								handleDelete={handleDelete}
							/>
						</div>

						<div className='col-span-12 flex flex-col gap-4 xl:col-span-6'>
							<Card>
								<CardBody>
									<div className='flex'>
										<div className='bold w-full'>
											<Button
												variant='outlined'
												className='flex w-full items-center justify-between rounded-none border-b px-[2px] py-[0px] text-lg font-bold'
												onClick={() =>
													setAccordionStates({
														...accordionStates,
														notes: !accordionStates.notes,
													})
												}
												rightIcon={
													!accordionStates.notes
														? 'HeroChevronUp'
														: 'HeroChevronDown'
												}>
												Notes
											</Button>
										</div>
									</div>

									<Collapse isOpen={!accordionStates.notes}>
										<div className='mt-4 grid grid-cols-6 gap-4'>
											{formik?.values?.notes?.map((note: any, index: any) => (
												<div key={index} className='col-span-12'>
													<Textarea
														id={`notes[${index}]`}
														name={`notes[${index}]`}
														onChange={(event) =>
															handleChangeNotes(event, index)
														}
														value={note}
														onBlur={formik.handleBlur}
														placeholder={`Note ${index + 1}`}
														className='mr-2'
														disabled={!privileges.canWrite()}
													/>

													{formik.touched.notes &&
														formik.errors.notes &&
														formik.errors.notes[index] && (
															<div className='text-red-500'>
																{formik.errors.notes[index]}
															</div>
														)}
												</div>
											))}
											<Button
												type='button'
												onClick={handleAddNote}
												variant='outline'
												color='zinc'
												size='lg'
												className='w-64'
												isDisable={!privileges.canWrite()}>
												Add Note
											</Button>
										</div>
									</Collapse>
								</CardBody>
							</Card>
						</div>

						<Modal isOpen={backToListModal} setIsOpen={setBackToListModal} isScrollable>
							<ModalHeader className='m-5 flex items-center justify-between rounded-none border-b text-lg font-bold'>
								There are unsaved changes, are you sure you want to go back?
							</ModalHeader>
							<ModalFooter>
								<ModalFooterChild />
								<ModalFooterChild>
									<Button
										variant='outline'
										onClick={() => setBackToListModal(false)}>
										Keep
									</Button>
									<Button
										variant='solid'
										color='red'
										onClick={() => navigation(listLinkPath)}>
										Discard
									</Button>
								</ModalFooterChild>
							</ModalFooter>
						</Modal>
					</div>
				</div>
			</Container>
		</PageWrapper>
	) : (
		<div className='flex h-screen items-center justify-center font-bold'>
			You Dont Have Permission Read the records
		</div>
	);
};

export default VendorPage;
