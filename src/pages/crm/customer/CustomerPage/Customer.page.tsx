/* eslint-disable no-restricted-syntax */
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Formik, useFormik } from 'formik';
import {
	doc,
	getDoc,
	updateDoc,
	setDoc,
	addDoc,
	collection,
	getDocs,
} from 'firebase/firestore';
import { ref, getDownloadURL, uploadBytes } from 'firebase/storage';
import { toast } from 'react-toastify';
import PageWrapper from '../../../../components/layouts/PageWrapper/PageWrapper';
import Container from '../../../../components/layouts/Container/Container';
import Card, { CardBody } from '../../../../components/ui/Card';
import Subheader, {
	SubheaderLeft,
	SubheaderRight,
	SubheaderSeparator,
} from '../../../../components/layouts/Subheader/Subheader';
import { appPages } from '../../../../config/pages.config';
import Button from '../../../../components/ui/Button';
import Badge from '../../../../components/ui/Badge';
import useSaveBtn from '../../../../hooks/useSaveBtn';
import firestore, { storage } from '../../../../firebase';
import { customerSchema, shippingDetailsSchema } from '../../../../utils/formValidations';
import Textarea from '../../../../components/form/Textarea';
import ShippingContacts from './ShippingContacts';
import CustomerInfo from './CustomerInfo';
import BillToAddress from './BillToAddress';
import BuyerInfo from './BuyerInfo';
import OtherContact from './OtherContact';
import PricingTerms from './PricingTerms';
import TaxInfo from './TaxInfo';
import CreditInfo from './CreditInfo';
import MiscInfo from './MiscInfo';
import VendorInfo from './VendorInfo';
import SCTable from './SCTable';
import LiabilityCertificate from './LiabilityCertificate';
import Collapse from '../../../../components/utils/Collapse';
import Modal, {
	ModalBody,
	ModalFooter,
	ModalFooterChild,
	ModalHeader,
} from '../../../../components/ui/Modal';
import { v4 as uuidv4 } from 'uuid';
import dayjs from 'dayjs';

// Added
import getUserRights from '../../../../hooks/useUserRights';
import { deepEqual } from '../../../../utils/backToList.util';
import { MasterSettings } from '../../../../utils/types/common';

// Added
const createUserInitialValues = {
	customerNumber: '',
	status: 'ACTIVE',
	country: 'USA',
	custPORequired: 'YES',
	notes: [''],
	buyers: [{ buyerName: '', buyerPhone: '', buyerPhoneExt: '', buyerEmail: '' }],
	additionalContactInfo: [
		{
			additionalName: '',
			additionalPhone: '',
			additionalPhoneExt: '',
			additionalMobile: '',
			additionalFax: '',
			additionalEmail: '',
			additionalNotes: '',
		},
	],
};



const listLinkPath = `../${appPages.crmAppPages.subPages.customerPage.subPages.listPage.to}`;

const CustomerPage = () => {
	const [userName, setuserName] = useState('');
	const [backToListModal, setBackToListModal] = useState(false);
	const [accordionStates, setAccordionStates] = useState({
		customerInfo: false,
		MCI: false,
		creditInfo: false,
		otherContactInfo: false,
		taxInfo: false,
		miscInfo: false,
		pricingTerms: false,
		notes: false,
		buyerInfo: false,
		AddContactInfo: false,
		APContactInfo: false,
		billToAddress: false,
		vendorInfo: false,
		liabilityCert: false,
	});

	const [masterSettings, setMasterSettings] = useState<MasterSettings>({
		customerClass: [],
		customerType: [],
		paymentMethod: [],
		pricingTerms: [],
		shippingMethod: [],
		terms: [],
		orderSource: [],
		salesmanMaintenance: [],
	});
	const [masterSettingsFetched, setMasterSettingsFetched] = useState(false);
	const [customerNumber, setCustomerNumber] = useState('100001');
	const [contacts, setContacts] = useState([]);
	const [scModal, setScModal] = useState<boolean>(false);
	const [isFormSaved, setIsFormSaved] = useState(false);
	const [sctableKey, setSCTableKey] = useState(0);
	const [shippingContactId, setShippingContactId] = useState();
	const [customers, setCustomers] = useState<any[]>([]);
	const [formattedCustomerNumber, setFormattedCustomerNumber] = useState('');
	const [temporarySCData, setTempeorarySCData] = useState<any>([]);

	const [pdfFiles, setPdfFiles] = useState<any>([]);
	const [newPdfFiles, setNewPdfFiles] = useState<any>([]);
	const [isChangedPDF, setIsChangedPDF] = useState<boolean>(false);
	const [selectedFileNames, setSelectedFileNames] = useState<any>([]);

	const [pdfLiabFiles, setPdfLiabFiles] = useState<any>([]);
	const [newPdfLiabFiles, setNewPdfLiabFiles] = useState<any>([]);
	const [isChangedPdfLiab, setIsChangedPdfLiab] = useState<boolean>(false);
	const [selectedPdfLiabFileNames, setSelectedPdfLiabFileNames] = useState<any>([]);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [collapseAll, setCollapseAll] = useState(false);
	const [prevData, setPrevData] = useState<any>({});
	const { id } = useParams();
	const isNewItem = id === 'new';
	const navigation = useNavigate();
	const params = useParams();


	const getuserName = useCallback(() => {
		setuserName(`${localStorage.getItem('firstName')} ${localStorage.getItem('lastName')}`);
	}, []);

	useEffect(() => {
		getuserName();
	}, [getuserName]);

	const initialValues: any = useMemo(
		() => (id == 'new' ? { ...createUserInitialValues } : createUserInitialValues),
		[],
	);

	const formik: any = useFormik({
		initialValues,
		enableReinitialize: true,
		validationSchema: customerSchema,
		onSubmit: () => { },
	});

	const generateNextShipToCode = () => {
		if (id === 'new') {
			const lastEntry: any =
				temporarySCData.length > 0 ? temporarySCData[temporarySCData.length - 1] : null;
			const lastIndex: any = lastEntry?.SCshipToCode.charAt(
				lastEntry?.SCshipToCode?.length - 1,
			);
			const index = temporarySCData.length == 0 ? 1 : parseInt(lastIndex) + 1;
			return `SH#${index.toString().padStart(5, '0')}`;
		}

		const lastEntry = customers.length > 0 ? customers[customers.length - 1] : null;

		const lastIndex = lastEntry?.SCshipToCode.charAt(lastEntry?.SCshipToCode?.length - 1);

		const index = customers.length == 0 ? 1 : parseInt(lastIndex) + 1;

		return `SH#${index.toString().padStart(5, '0')}`;
	};

	const newShipToCode = generateNextShipToCode();

	const childFormikContact = useFormik({
		initialValues: {
			SCcountry: 'USA',
			SCshipToCode: newShipToCode,
		},
		enableReinitialize: true,
		validationSchema: shippingDetailsSchema,
		onSubmit: (values) => {
			console.log('called', values);
		},
	});


	// Added
	const getMasterSettings = async () => {
		try {
			const settingsRef = await getDocs(collection(firestore, 'masterSettings'));
			interface SettingsDataType {
				[key: string]: unknown; // Change `any` to the actual type of `finalValues` if known
			}
			const settingsData: SettingsDataType = {};

			for (const setting of settingsRef.docs) {
				const { finalValues } = setting.data();
				settingsData[setting.id] = finalValues;
			}
			console.log(settingsData);

			const updatedSettings: MasterSettings = {
				...masterSettings,
				...(settingsData as Partial<MasterSettings>),
			};

			setMasterSettings(updatedSettings);
			setMasterSettingsFetched(true); // Update state to indicate settings are fetched
		} catch (error) {
			console.error('Error fetching Master Settings:', error);
		}
	};

	useEffect(() => {
		if (!masterSettingsFetched) {
			getMasterSettings();
		}

		if (masterSettingsFetched) {
			if (id !== 'new') {
				getCustomerDoc(id);
			} else {
				getLatestCustomerNumberFromFirestore();
			}
		}
	}, [masterSettingsFetched, id]);

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

	const { saveBtnColor } = useSaveBtn({
		isNewItem,
		isSaving: false,
		isDirty: formik.dirty,
	});

	const getCustomerDoc = useCallback(async (customerId: any) => {
		try {
			const customerData = await getDoc(doc(firestore, `customers/${customerId}`));
			const prevData: any = customerData.data();
			setPrevData(prevData);
			// extract notes, contacts  and shipping contacts modules data from firestore

			formik.setValues({
				...formik.values,
				...customerData.data(),
			});

			setPdfFiles(prevData.pdfFiles);
			setPdfLiabFiles(prevData.pdfLiabFiles || []);
		} catch (error) {
			console.error('Error fetching customer data:', error);
		}
	}, []);

	// update
	const updateCustomerInFirestore = async (customerId: any, updatedCustomerData: any) => {
		try {
			if (!updatedCustomerData) {
				console.error('Error: updatedCustomerData is undefined');
				return;
			}
			const buyersData = updatedCustomerData.buyers || [];
			const notesData = updatedCustomerData.notes || [''];


			// Added - Before Updating in Firestore
			// Compaing Notes

			const modifiedNotes = updateNotesWithName(prevData.notes || [''], notesData);

			// Reference to the customer document in Firestore
			const customerDocRef = doc(firestore, 'customers', customerId);
			const customerDoc = await getDoc(customerDocRef);
			if (customerDoc.exists()) {
				// If the document exists, update its data
				const newPDFURLS: any = await handleUploadButtonClick(newPdfFiles);
				const newPDFLIABURLS: any = await handleUploadButtonClick(newPdfLiabFiles);

				await updateDoc(customerDocRef, {
					...updatedCustomerData,
					pdfFiles: [...pdfFiles, ...newPDFURLS],
					pdfLiabFiles: [...pdfLiabFiles, ...newPDFLIABURLS],
					buyers: buyersData,
					notes: modifiedNotes, // Added - altered from notesData

				});
			} else {
				console.error('Customer document does not exist:', customerId);
				// Handle the case where the customer document doesn't exist
			}

			navigation(listLinkPath);

			toast.success('Data updated successfully!');
		} catch (error: any) {
			console.error('Error updating customer data:', error);
			toast.error('Error updating data:', error);
			throw error;
		}
	};

	// update

	const getLatestCustomerNumberFromFirestore = async () => {
		try {
			const counterDocRef = doc(firestore, 'counters', 'customerCounter');
			const counterDoc = await getDoc(counterDocRef);

			if (!counterDoc.exists()) return 100000;
			const latestCounter = counterDoc.data().value;
			formik.setFieldValue('customerNumber', `C${latestCounter}`);
			setFormattedCustomerNumber(`C${latestCounter}`);

			setCustomerNumber(latestCounter);

			return latestCounter;

			// If the counter document doesn't exist, return a default value

		} catch (error) {
			console.error('Error fetching latest customer number:', error);
			throw error;
		}
	};
	const handleSaveButtonClick = async () => {
		try {

			setIsLoading(true);

			await formik.validateForm();
			console.log(formik.errors);
			console.log(formik.values);

			const handleNestedErrors = (errors: any, prefix = '') => { //  logic to touch the field which are not validated 
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
				toast.error('Name field is required.');
				throw new Error('Name field is required.');
			}
			const customerData: any = {
				status: formik.values.status,
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
				email: formik.values.email,
				APcontact: formik.values.APcontact || null,
				APphoneNumber: formik.values.APphoneNumber || null,
				APphoneNumberExt: formik.values.APphoneNumberExt || null,
				APemail: formik.values.APemail || null,
				APnotes: formik.values.APnotes || null,
				billAddress: formik.values.billAddress || null,
				billAddress2: formik.values.billAddress2 || null,
				billAddress3: formik.values.billAddress3 || null,
				billCity: formik.values.billCity || null,
				billState: formik.values.billState || null,
				billZipcode: formik.values.billZipcode || null,
				billCountry: formik.values.billCountry || null,
				billPhoneNumber: formik.values.billPhoneNumber || null,
				billPhoneNumberExt: formik.values.billPhoneNumberExt || null,
				billPhoneNumber2: formik.values.billPhoneNumber2 || null,
				billPhoneNumber2Ext: formik.values.billPhoneNumber2Ext || null,
				billFax: formik.values.billFax || null,
				billEmail: formik.values.billEmail || null,
				additionalContactInfo: formik.values.additionalContactInfo.map((data: any) => ({
					additionalName: data.additionalName || null,
					additionalPhone: data.additionalPhone || null,
					additionalPhoneExt: data.additionalPhoneExt || null,
					additionalMobile: data.additionalMobile || null,
					additionalFax: data.additionalFax || null,
					additionalEmail: data.additionalEmail || null,
					additionalNotes: data.additionalNotes || null,
				})),
				buyers: formik.values.buyers.map((buyer: any) => ({
					buyerName: buyer.buyerName || null,
					buyerPhone: buyer.buyerPhone || null,
					buyerPhoneExt: buyer.buyerPhoneExt || null,
					buyerEmail: buyer.buyerEmail || null,
					buyerNotes: buyer.buyerNotes || null,
				})),
				masterContact: formik.values.masterContact || null,
				masterContactEmail: formik.values.masterContactEmail || null,
				masterContactNotes: formik.values.masterContactNotes || null,
				orderConfirmationEmail: formik.values.orderConfirmationEmail || null,
				invoiceEmail: formik.values.invoiceEmail,
				statementsEmail: formik.values.statementsEmail || null,
				terms: formik.values.terms || null,
				pricingTerms: formik.values.pricingTerms || null,
				paymentMethod: formik.values.paymentMethod || null,
				shippingInformation: formik.values.shippingInformation || null,
				pShipMethod: formik.values.pShipMethod || null,
				pShippingACnumber: formik.values.pShippingACnumber || null,
				pAlternateShipMethod: formik.values.pAlternateShipMethod || null,
				pAlternateShippingACnumber: formik.values.pAlternateShippingACnumber || null,
				termsNotes: formik.values.termsNotes || null,
				taxJurisdiction: formik.values.taxJurisdiction || null,
				TaxExemptCert: formik.values.TaxExemptCert || null,
				certExpiryDate: formik.values.certExpiryDate || null,
				pdfFiles,
				pdfLiabFiles,
				startDate: formik.values.startDate || null,
				endDate: formik.values.endDate || null,
				taxable: formik.values.taxable || null,
				creditLimit: formik.values.creditLimit || null,
				creditHold: formik.values.creditHold || null,
				acceptBO: formik.values.acceptBO || null,
				acceptPartialOrder: formik.values.acceptPartialOrder || null,
				custClass: formik.values.custClass,
				custType: formik.values.custType,
				orderSource: formik.values.custType || null,
				salesmanMaintenance: formik.values.custType || null,
				vendor: formik.values.vendor || null,
				specialInstructions: formik.values.specialInstructions || null,
				custPORequired: formik.values.custPORequired || null,
				notes: formik.values.notes || null,
			};

			customerData.customerNumber = formattedCustomerNumber;

			if (id == 'new') {
				const customerId = await saveCustomerToFirestore(
					customerData,
					formattedCustomerNumber,
				);
			} else {
				const customerId = formik.values.customerNumber;
				await updateCustomerInFirestore(customerId, formik.values);
			}
		} catch (error) {
			console.error('Error saving customer:', error);
		}
		finally {
			setIsLoading(false);
		}
	};

	const saveCustomerToFirestore = async (customerData: any, formattedCustomerNumber: any) => {
		try {
			// const additionalData = customerData.additionalContactInfo || [];
			// const buyersData = customerData.buyers || [];
			const notesData = customerData.notes || [''];


			// Added - Before Updating in Firestore
			// Comparing Notes
			console.log(notesData);
			const modifiedNotes = updateNotesWithName([''], notesData);
			console.log(modifiedNotes);

			// Check if the document with the given customer number already exists
			const customerDocRef = doc(firestore, 'customers', formattedCustomerNumber);
			const customerDoc = await getDoc(customerDocRef);

			if (customerDoc.exists()) {
				// If the document exists, update its data
				await updateDoc(customerDocRef, {
					...customerData,
					notes: modifiedNotes, // Added - altered from notesData

				});

				navigation(listLinkPath);
			} else {
				// If the document doesn't exist, create a new one
				// Fetch the latest customer counter
				const counterDocRef = doc(firestore, 'counters', 'customerCounter');
				await updateDoc(counterDocRef, { value: customerNumber + 1 });

				const newPDFURLS: any = await handleUploadButtonClick(newPdfFiles);
				const newPDFLIABURLS: any = await handleUploadButtonClick(newPdfLiabFiles);

				const docRef = await setDoc(doc(firestore, 'customers', formattedCustomerNumber), {
					...customerData,
					pdfFiles: newPDFURLS,
					pdfLiabFiles: newPDFLIABURLS,
					notes: modifiedNotes, // Added - altered from notesData

				});
				for (let i = 0; i <= temporarySCData.length - 1; i++) {
					if (temporarySCData.length > 0) {
						const contactRef = await addDoc(
							collection(firestore, 'shipping-contacts'),
							temporarySCData[i],
						);
					}
				}
			}
			navigation(listLinkPath);
			toast.success('Data saved successfully!');
			// return docRef.id;
		} catch (error: any) {
			console.error('Error adding customer: ', error);
			toast.error('Error adding data:', error);
			throw error;
		}
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

	const getCustomerSCDoc = useCallback(async (id: any) => {
		try {
			const customerSCData = await getDoc(doc(firestore, `shipping-contacts/${id}`));
			const existingUser: any = { ...customerSCData.data(), isEdit: true };
			childFormikContact.setValues(existingUser);
		} catch (error) {
			console.error('Error fetching customer data:', error);
		}
	}, []);

	const handlePdfFileChange = async (event: any) => {
		let selectedFiles: any = [];
		Object.entries(event.target.files).map(([_, value]: any) => {
			selectedFiles.push(value);
		});
		console.log('selected files', selectedFiles);
		setNewPdfFiles(selectedFiles);
	};

	const handleUploadButtonClick = async (files: any) => {
		try {
			const fileURLs = [];
			for (const file of files) {
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

	const handlePdfLiabFileChange = async (event: any) => {
		let selectedFiles: any = [];
		Object.entries(event.target.files).map(([_, value]: any) => {
			selectedFiles.push(value);
		});
		console.log('selected files', selectedFiles);
		setNewPdfLiabFiles(selectedFiles);
	};

	const handleEditClick = (id: any) => {
		if (params.id === 'new') {
			setScModal(true);
			setShippingContactId(id);
			const editedContact: any = temporarySCData.find(
				(entry: any) => entry.SCshipToCode === id,
			);
			childFormikContact.setValues({
				...childFormikContact.values,
				...editedContact,
				isEdit: true,
			});
		} else {
			setScModal(true);
			setShippingContactId(id);
			getCustomerSCDoc(id);
		}
	};

	const handleSaveSCcontact = async (scData: any, customerNumber: any, isEdit: any) => {


		setIsFormSaved(true);
		try {
			if (id == 'new') {
				// const dataToSaved = []
				if (isEdit) {
					//isEdit is a flag used for targeting the field which need to update 
					// if new customer and it is in edit state of shipping contact
					// Find the index of the object to be updated
					const indexToUpdate: any = temporarySCData.findIndex(
						(entry: any) => entry.SCshipToCode === scData.SCshipToCode,
					);

					if (indexToUpdate !== -1) {
						// Update the specific object in the array
						const updatedArray: any = [...temporarySCData];
						updatedArray[indexToUpdate] = {
							...temporarySCData[indexToUpdate],
							...scData,
						};
						delete updatedArray[indexToUpdate].isEdit,
							console.log("updatedArray of Specific index", updatedArray[indexToUpdate])
						setTempeorarySCData(updatedArray);
					}
				} else {
					setTempeorarySCData([...temporarySCData, { ...scData, customerNumber }]);
				}
			} else {
				const customerNumber = params.id;
				const updatedSCData = { ...scData }
				delete updatedSCData['isEdit']  //isEdit is being deleted from formik values
				const dataToSaved = { ...updatedSCData, customerNumber };

				if (isEdit) {
					const shippingContactDocRef = doc(
						firestore,
						`shipping-contacts/${shippingContactId}`,
					);

					const docRef = await updateDoc(shippingContactDocRef, dataToSaved);
				} else {
					const docRef = await addDoc(
						collection(firestore, 'shipping-contacts'),
						dataToSaved,
					);
				}
			}
			toast.success('Shipping Details Saved Successfully');
		} catch (error: any) {
			toast.error('error', error);
		}
	};
	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);
	useEffect(() => {
		if (isFormSaved) {
			setIsFormSaved(false);
			setScModal(false);
			setSCTableKey((prevKey) => prevKey + 1);
		}
	}, [isFormSaved]);



	const collapseAllAccordians = () => {
		setAccordionStates({
			customerInfo: !collapseAll,
			MCI: !collapseAll,
			creditInfo: !collapseAll,
			otherContactInfo: !collapseAll,
			taxInfo: !collapseAll,
			miscInfo: !collapseAll,
			pricingTerms: !collapseAll,
			notes: !collapseAll,
			AddContactInfo: !collapseAll,
			buyerInfo: !collapseAll,
			APContactInfo: !collapseAll,
			billToAddress: !collapseAll,
			vendorInfo: !collapseAll,
			liabilityCert: !collapseAll,
		});
		setCollapseAll(!collapseAll);
	};

	const backToList = () => {
		if (id !== 'new') {
			// delete formik.values.contacts
			if (isChangedPDF || isChangedPdfLiab) {
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

	const handleDelete = (url: any) => {
		const filteredArray = pdfFiles.filter((file: any) => file.location !== url);
		setPdfFiles(filteredArray);
		// setTempAllCustomerPDF(filteredArray)
		// setCustomerPdfList(filteredArray);
	};
	const privileges = getUserRights('customers');

	return privileges.canRead() ? (
		<PageWrapper name={isNewItem ? 'New Customer' : `${id}`}>
			<Subheader>
				<SubheaderLeft>
					<Button
						icon='HeroArrowLeft'
						className='!px-0'
						onClick={() => {
							backToList();
						}}>
						Back to List
					</Button>

					<SubheaderSeparator />
					{isNewItem ? (
						'Add New Customer'
					) : (
						<>
							{/* eslint-disable-next-line @typescript-eslint/restrict-template-expressions */}
							{formik.values.customerNumber && formik.values.Name
								? `#${formik.values.customerNumber} ${formik.values.Name}`
								: ``}{' '}
							<Badge
								color='blue'
								variant='outline'
								rounded='rounded-full'
								className='border-transparent'>
								Edit Customer
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
							{!id || id != 'new' ? 'Update' : 'Create'}
						</Button>
					</div>
				</SubheaderRight>
			</Subheader>
			<Container className='flex shrink-0 grow basis-auto flex-col pb-0'>
				<div className='flex h-full flex-wrap content-start'>
					<div className='m-5 mb-4 grid w-full grid-cols-6 gap-4'>
						<div className='col-span-12 flex flex-col gap-4 xl:col-span-6'>
							<form>
								<CustomerInfo
									accordionStates={accordionStates}
									setAccordionStates={setAccordionStates}
									formik={formik}
									isNewItem={isNewItem}
									formattedCustomerNumber={formattedCustomerNumber}
									collapseAll={collapseAll}
									setCollapseAll={setCollapseAll}
								/>
							</form>
						</div>
						<div className='col-span-12 flex flex-col gap-4 xl:col-span-6'>
							<BillToAddress
								formik={formik}
								accordionStates={accordionStates}
								setAccordionStates={setAccordionStates}
							/>
						</div>
						<div className='col-span-12 flex flex-col gap-4 xl:col-span-6'>
							<BuyerInfo
								formik={formik}
								accordionStates={accordionStates}
								setAccordionStates={setAccordionStates}
							/>
						</div>
						<div className='col-span-12 flex flex-col gap-4 xl:col-span-6'>
							<OtherContact
								formik={formik}
								accordionStates={accordionStates}
								setAccordionStates={setAccordionStates}
							/>
						</div>
						<div className='col-span-12 flex flex-col gap-4 xl:col-span-6'>
							<PricingTerms
								accordionStates={accordionStates}
								setAccordionStates={setAccordionStates}
								formik={formik}
								masterSettings={masterSettings}
							/>
						</div>
						<div className='col-span-12 flex flex-col gap-4 xl:col-span-6'>
							<TaxInfo
								accordionStates={accordionStates}
								setAccordionStates={setAccordionStates}
								formik={formik}
								handlePdfFileChange={handlePdfFileChange}
								selectedFileNames={selectedFileNames}
								setSelectedFileNames={setSelectedFileNames}
								setPdfFiles={setPdfFiles}
								pdfFiles={pdfFiles}
								newPdfFiles={newPdfFiles}
								setNewPdfFiles={setNewPdfFiles}
								handleDelete={handleDelete}
								setChanged={() => setIsChangedPDF(true)}
							/>
						</div>
						<div className='col-span-12 flex flex-col gap-4 xl:col-span-6'>
							<CreditInfo
								accordionStates={accordionStates}
								setAccordionStates={setAccordionStates}
								formik={formik}
							/>
						</div>
						<div className='col-span-12 flex flex-col gap-4 xl:col-span-6'>
							<MiscInfo
								accordionStates={accordionStates}
								setAccordionStates={setAccordionStates}
								formik={formik}
								masterSettings={masterSettings}
							/>
						</div>
						<div className='col-span-12 flex flex-col gap-4 xl:col-span-6'>
							<VendorInfo
								accordionStates={accordionStates}
								setAccordionStates={setAccordionStates}
								formik={formik}
							/>
						</div>
						<div className='col-span-12 flex flex-col gap-4 xl:col-span-6'>
							<div className='col-span-12 flex flex-col gap-4 xl:col-span-6'>
								<Card>
									<CardBody>
										<div className='flex'>
											<div className='bold w-full'>
												<Button
													variant='outlined'
													className='flex w-full items-center justify-between rounded-none border-b text-lg font-bold px-[2px] py-[0px]'
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
												<div className='col-span-12 lg:col-span-12'>
													<div className='col-span-12 lg:col-span-4'>
														<div>
															{formik?.values?.notes?.map(
																(note: any, index: any) => (
																	<div
																		key={index}
																		className='mb-2 flex'>
																		<Textarea
																			id={`notes[${index}]`}
																			name={`notes[${index}]`}
																			onChange={(event) =>
																				handleChangeNotes(
																					event,
																					index,
																				)
																			}
																			value={note}
																			onBlur={
																				formik.handleBlur
																			}
																			placeholder={`Note ${index + 1
																				}`}
																			className='mr-2'
																			disabled={
																				!privileges.canWrite()
																			}
																		/>

																		{formik.touched.notes &&
																			formik.errors.notes &&
																			formik.errors.notes[
																			index
																			] && (
																				<div className='text-red-500'>
																					{
																						formik
																							.errors
																							.notes[
																						index
																						]
																					}
																				</div>
																			)}
																	</div>
																),
															)}
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
													</div>
												</div>
											</div>
										</Collapse>
									</CardBody>
								</Card>
							</div>
						</div>

						<div className='col-span-12 flex flex-col gap-4 xl:col-span-6'>
							<LiabilityCertificate
								formik={formik}
								accordionStates={accordionStates}
								setAccordionStates={setAccordionStates}
								handlePdfLiabFileChange={handlePdfLiabFileChange}
								selectedPdfLiabFileNames={selectedPdfLiabFileNames}
								setSelectedPdfLiabFileNames={setSelectedPdfLiabFileNames}
								setPdfLiabFiles={setPdfLiabFiles}
								pdfLiabFiles={pdfLiabFiles}
								setChanged={() => setIsChangedPdfLiab(true)}
								newPdfLiabFiles={newPdfLiabFiles}
								setNewPdfLiabFiles={setNewPdfLiabFiles}
								handleDelete={handleDelete}
							/>
						</div>

						<div className='col-span-12 flex flex-col gap-4 xl:col-span-6 '>
							<Card>
								<CardBody>
									<div className='flex justify-end'>
										<Button
											onClick={() => setScModal(true)}
											variant='solid'
											isDisable={!privileges.canWrite()}>
											New Shipping Contact
										</Button>
									</div>

									{id === 'new' ? (
										temporarySCData.length > 0 ? (
											<SCTable
												customerNumberid={formik.values.customerNumber}
												key={sctableKey}
												temporarySCdata={temporarySCData}
												handleEditClick={handleEditClick}
												customers={customers}
												setCustomers={setCustomers}
												id={id}
												setTempeorarySCData={setTempeorarySCData}
											/>
										) : (
											<div style={{ textAlign: 'center' }}>
												No Records Available
											</div>
										)
									) : contacts.length >= 0 ? (
										<SCTable
											customerNumberid={formik.values.customerNumber}
											key={sctableKey}
											temporarySCdata={temporarySCData}
											handleEditClick={handleEditClick}
											customers={customers}
											setCustomers={setCustomers}
											id={id}
											setTempeorarySCData={setTempeorarySCData}
										/>
									) : (
										<div style={{ textAlign: 'center' }}>
											No Records Available
										</div>
									)}
								</CardBody>
							</Card>
						</div>

						<Modal isOpen={scModal} setIsOpen={setScModal} isScrollable fullScreen>
							<ModalHeader
								onClick={() => childFormikContact.resetForm()}
								className='m-5 flex items-center justify-between rounded-none border-b text-lg font-bold'>
								Add Shipping Contacts
							</ModalHeader>
							<ModalBody>
								<ShippingContacts
									formik={childFormikContact}
									contacts={contacts}
									onSave={handleSaveSCcontact}
									customerNumber={formattedCustomerNumber}
									setContacts={setContacts}
									masterSettings={masterSettings}
								/>
							</ModalBody>
						</Modal>

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

export default CustomerPage;
