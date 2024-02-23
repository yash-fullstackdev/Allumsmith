import { useNavigate, useParams } from 'react-router-dom';
import PageWrapper from '../../../../../components/layouts/PageWrapper/PageWrapper';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useFormik } from 'formik';
import { rawMaterialDataSchema, vendorModalDataSchema } from '../../../../../utils/formValidations';
import { collection, doc, getDoc, getDocs, setDoc, updateDoc } from 'firebase/firestore';
import { firestore } from '../../../../..';
import { appPages } from '../../../../../config/pages.config';
import { toast } from 'react-toastify';
import Subheader, {
	SubheaderLeft,
	SubheaderRight,
	SubheaderSeparator,
} from '../../../../../components/layouts/Subheader/Subheader';
import Button from '../../../../../components/ui/Button';
import Badge from '../../../../../components/ui/Badge';
import Container from '../../../../../components/layouts/Container/Container';
import Modal, {
	ModalFooter,
	ModalFooterChild,
	ModalHeader,
} from '../../../../../components/ui/Modal';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { storage } from '../../../../../firebase';
import { v4 as uuidv4 } from 'uuid';
import dayjs from 'dayjs';
import getUserRights from '../../../../../hooks/useUserRights';
import RawMaterialForm from './RawMaterialInfo';
import { deepEqual } from '../../../../../utils/backToList.util';
import { RawMaterialsType } from '../../../../../utils/types/common';

const listLinkPath = `../${appPages.crmAppPages.subPages.componentsPage.subPages.rawMaterialsPage.listPage.to}`;

const RawMaterialPage = () => {
	const [userName, setuserName] = useState('');

	const { id } = useParams();

	const [formSubmitted, setFormSubmitted] = useState<boolean>(false);
	const [vendors, setVendors] = useState<any>([]);
	const [selectedFile, setSelectedFile] = useState<any>('');
	const [collapseAll, setCollapseAll] = useState<boolean>(false);
	const [scModal, setScModal] = useState<boolean>(false);
	const [prevData, setPrevData] = useState<any>({});
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [isFormSaved, setIsFormSaved] = useState(false);
	const [rawMaterialSubTypes, setRawMaterialSubTypes] = useState<any>([]);
	const isNewItem = id === 'new';
	const navigation = useNavigate();
	const firebaseMainKey = 'components'; // replace with vendors when data is available

	const [vendorData, setVendorData] = useState<any>([]);

	const rawMaterialsType: RawMaterialsType = {
		ANTISEPTIC: [
			'ALCOHOL PADS',
			'ALCOHOL SWABSTICK',
			'CHLORA PREP',
			'CHLORASCRUB SWAB',
			'HAND GEL',
			'HYDROGEN PX',
			'NO STING',
			'PREVENTICS PAD',
			'PVP OINTMENT',
			'PVP PREP PADS',
			'PVP SOLUTION',
			'PVP SWABSTICK',
			'SALINE WIPE',
			'SKIN WIPE',
		],
		BAG: [
			'AUTOBAG',
			'BAG BIO HAZARD',
			'BAG FLAT POLY',
			'BAG HANG HOLE',
			'BAG TAMPER EVIDENT',
			'BAG ZIP LOCK',
			'BUBBLE WRAP',
			'PACKING LIST',
			'TOTE BAG',
		],
		BANDAGE: ['BANDAGE', 'COHESIVE', 'HYPAFIX', 'RUBBER BAND', 'STERI-STRIP', 'TEGADERM'],
		CAP: ['N/A'],
		CARTONS: ['N/A'],
		CATHETER: [
			'5 FR CATH HSG',
			'7 FR CATH HSG',
			'CATHETER, 3.5',
			'CATHETER, 5.0',
			'CATHETER, 6.5',
			'CATHETER, 8.0',
			'MISC CATH',
			'URINE CATH',
		],
		'CUP/DISH/BOWL': ['BOWL', 'CUP', 'PETRI DISH'],
		'CUSTOMER SUPPLIED': [
			'BATTERY',
			'DILATOR',
			'DRMR TROCAR 3.2',
			'DRMR TROCAR 4.5',
			'EAR WING',
			'INSTRUMENTS',
			'LARK TROCAR',
			'MISC COMPONENTS',
			'OS FINDER',
		],
		DRUG: [
			'HEPARIN',
			'LIDOCAINE',
			'LUBE JELLY',
			'OINTMENT',
			'PREFILL SYRINGE',
			'SODIUM CHLORIDE',
			'STERILE WATER',
		],
		'EXTENSION SETS': ['N/A'],
		FOAM: [
			'AMPULE FOAM',
			'FOAM CUT',
			'FOAM PAD',
			'FOAM ROLL',
			'HIP PILLOW',
			'HUB FOAM',
			'NEEDLE COUNT FOAM',
		],
		GAUZE: ['GAUZE NON STERILE', 'GAUZE STERILE', 'SPANDAGE', 'WEBRILL'],
		GLOVES: [
			'CHEMO RATED',
			'CUFFED',
			'LONG CUFFED',
			'NITRILE',
			'STERILE GLOVES',
			'VINYL',
			'WALLETED',
		],
		INSTRUCTIONS: ['INFUSYSTEM INSTRUCTIONS', 'LIDOCAINE INSTRUCTION'],
		INSTRUMENTS: [
			'FORCEP',
			'HEMOSTAT',
			'MISC INSTRUMENTS',
			'NEEDLE HOLDER',
			'PROBE',
			'PUNCH',
			'SCALPEL',
			'SCISSORS',
			'SPECULUM',
			'TOE CLIPPER',
			'WIRE INSTRUMENTS',
		],
		'LABELS / INSERT': ['BIOHAZARD LABEL', 'WHITE LID INSERT'],
		'MISC ITEMS': [
			'ABSORBENT STICK',
			'BLANKET',
			'BURETTE',
			'COTTON BALL',
			'ENFIT',
			'GOWN',
			'MASK',
			'MASK W/ EYE SHIELD',
			'MOUTH GEL',
			'RAZOR',
			'ROPE KIT',
			'SAFETY PIN',
			'SKIN MARKER',
			'STOCKINTTE',
			'STOPCOCK',
			'SUTURE',
			'TAMPONS',
			'TOURNIQUET',
		],
		NEEDLE: ['NON STERILE NEEDLE', 'STERILE NEEDLE', 'SAFETY N-S', 'SAFETY STERILE'],
		SWABS: ['COTTON TIP APPLICATORS', 'FOAM APPLICATOR'],
		SYRINGE: ['DOESMATE', 'LL SYRINGE NS', 'LS SYRINGE NS', 'LL STRILE SYRINGE'],
		TAPE: ['3M CLOTH', '3M PLASTIC', 'MISC TAPE', 'PAPER', 'UMBILICAL'],
		'TIP PROTECTORS': ['INSTRUMENT GUARD', 'LARGE TIP', 'POINT LOCK', 'SMALL TIP'],
		'TOWEL / PADS': [
			'CHEMO PAD',
			'CLOTH',
			'CLOTH FENESTRATED',
			'CSR WRAP',
			'DRAPE',
			'OTHER',
			'PAPER',
			'PAPER / POLY',
			'PLASTIC',
			'UNDERPAD',
		],
		TRAY: [
			'TRAY AVANOS',
			'TRAY BLURIDGE',
			'TRAY DEROYAL',
			'TRAY FOAM',
			'TRAY GENERAL PURPOSE',
			'TRAY HRT',
			'TRAY IRRIGATION',
			'TRAY REDITECH',
			'TRAY SUTURE REMOVAL',
		],
		TUBE: ['RING TEST TUBE', 'SILICON TUBE', 'TEST TUBE'],
		TYVEK: [
			'TYVEK HEADER BAG',
			'TYVEK LID',
			'TYVEK POUCH',
			'TYVEK ROLL STOCK',
			'TYVEK SHEET',
			'TYVEK VENTED BAG',
		],
	};

	const createUserInitialValues = {
		notes: [''],
		componentStandardPricing: 0,
		inPickStock: 0,
		pendingStock: 0,
		availableStock: 0,
		invAlert: 'NO',
		componentType: 'RAW MATERIAL PURCHASE',
	};

	const initialValues: any = useMemo(
		() => (id == 'new' ? { ...createUserInitialValues } : createUserInitialValues),
		[],
	);

	const formik: any = useFormik({
		initialValues,
		enableReinitialize: true,
		validationSchema: rawMaterialDataSchema,
		onSubmit: () => {
			setFormSubmitted(true);
		},
	});

	const childFormikVendor = useFormik({
		initialValues: {
			// ...formik.initialValues.vendorData[0],
			procurementUOM: [{ uom: '', quantity: '' }],
			vendorNotes: [''],
		},
		enableReinitialize: true,
		validationSchema: vendorModalDataSchema,
		onSubmit: (values) => {
			console.log('called', values);
		},
	});

	const [backToListModal, setBackToListModal] = useState(false);
	const [accordionStates, setAccordionStates] = useState({
		rawMaterialInfo: false,
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
				// this is to get the Raw Material doc for edit functionality
				getRawMaterialDoc(id);
			}
		}
	}, [masterSettingsFetched, id]);

	const getuserName = useCallback(() => {
		setuserName(`${localStorage.getItem('firstName')} ${localStorage.getItem('lastName')}`);
	}, []);

	useEffect(() => {
		getuserName();
	}, [getuserName]);

	const getRawMaterialDoc = useCallback(async (rowMaterialDocId: any) => {
		try {
			const rawMaterialDoc = await getDoc(
				doc(firestore, `${firebaseMainKey}/${rowMaterialDocId}`),
			);
			const prevData: any = rawMaterialDoc.data();
			setPrevData(prevData);

			formik.setValues({
				...formik.values,
				...rawMaterialDoc.data(),
			});

			// Set options for the second dropdown based on the value selected in the first dropdown
			const rawMaterialType = prevData?.rawMaterialType;
			const options = rawMaterialsType[rawMaterialType] || [];
			setRawMaterialSubTypes(options);

			setVendorData(prevData.vendorData);
		} catch (error) {
			console.error('Error fetching Vendor Data', error);
		}
	}, []);

	useEffect(() => {
		getVendors();
	}, []);

	const getVendors = async () => {
		setIsLoading(true);
		try {
			// TODO: toggle for vendor collection document
			const vendorRef = await getDocs(collection(firestore, 'vendors'));
			const allVendors = [];

			for (const vendor of vendorRef.docs) {
				const vendorsWithData = {
					...vendor.data(),
					id: vendor.id,
				};
				allVendors.push(vendorsWithData);
			}

			setVendors(allVendors);

			if (allVendors) setIsLoading(false);
		} catch (error) {
			console.error('Error fetching vendors: ', error);
			setIsLoading(false);
		}
	};

	const updateRawMaterialInFirestore = async (
		updatedRawMaterialData: any,
		rawMaterialId: string,
	) => {
		try {
			if (!updatedRawMaterialData) throw new Error('updatedRawMaterialData is undefined');

			const notesData = updatedRawMaterialData.notes || [''];
			// // Added - Before Updating in Firestore
			// // Comparing Notes
			const modifiedNotes = updateNotesWithName(prevData.notes || [''], notesData);
			console.log('updatedRawMaterialData', updatedRawMaterialData);
			const rawMaterialDocRef = doc(firestore, firebaseMainKey, rawMaterialId);
			const rawMaterialDoc = await getDoc(rawMaterialDocRef);
			let payload = {};
			if (selectedFile) {
				const imageFiles = await handleUploadButtonClick();
				console.log('image Files0', imageFiles);
				payload = {
					...updatedRawMaterialData,
					imageFiles: imageFiles ?? [],
					notes: modifiedNotes,
				};
			} else
				payload = {
					...updatedRawMaterialData,
					notes: modifiedNotes,
				};
			await updateDoc(rawMaterialDocRef, {
				...payload,
			});
			console.log('Update function', updatedRawMaterialData);

			// navigation(listLinkPath);
			// toast.success('Data updated successfully!');
		} catch (error) {
			console.error('Error: ', error);
		}
	};

	const saveRawMaterialDataToFirestore = async (rawMaterialData: any) => {
		try {
			const notesData = rawMaterialData.notes || [''];
			console.log('notes Data', notesData);
			const modifiedNotes = updateNotesWithName(prevData.notes || [''], notesData);
			// const modifiedVendorNotes = rawMaterialData.vendorData.map((data: any, index: any) => (
			// 	updateNotesWithName(prevData.vendorData[index]?.vendorNotes || [''], rawMaterialData.vendorData[index].vendorNotes)
			// ))
			let payload = {};
			if (selectedFile) {
				const imageFiles = await handleUploadButtonClick();
				console.log('image Files0', imageFiles);
				payload = {
					...rawMaterialData,
					imageFiles: imageFiles ?? [],
					notes: modifiedNotes,
				};
			} else payload = { ...rawMaterialData, notes: modifiedNotes };
			const docRef = await setDoc(doc(firestore, firebaseMainKey, uuidv4()), payload);
			console.log('docRef', docRef);
		} catch (error: any) {
			console.error('Error: adding data ', error);
			toast.error('Error adding data: ', error);
		}
	};

	const handleEditClick = (id: any) => {
		console.log('Edit Click id', id);
		console.log('Vendor Data:', vendorData);

		const editedContact: any = vendorData.find(
			(entry: any) => entry.vendornum === id.row.original.vendornum,
		);
		childFormikVendor.setValues({
			...childFormikVendor.values,
			...editedContact,
			isEdit: true,
		});
		console.log('After Formik Values:', formik.values);

		// Set modal and vendorId
		setScModal(true);
		// }
	};
	const handleVendorData = async (vendorModalData: any, isEdit: any) => {
		console.log(vendorModalData);
		setIsFormSaved(true);
		try {
			if (id == 'new') {
				// const dataToSaved = []
				console.log('vendor Modal Data', vendorModalData);
				if (isEdit) {
					console.log('isEdit', isEdit);
					//isEdit is a flag used for targeting the field which need to update
					// if new customer and it is in edit state of shipping contact
					// Find the index of the object to be updated
					const indexToUpdate: any = vendorData.findIndex(
						(entry: any) => entry.vendornum === vendorModalData.vendornum,
					);

					if (indexToUpdate !== -1) {
						// Update the specific object in the array
						const updatedArray: any = [...vendorData];
						updatedArray[indexToUpdate] = {
							...vendorData[indexToUpdate],
							...vendorModalData,
						};
						delete updatedArray[indexToUpdate].isEdit,
							console.log(
								'updatedArray of Specific index',
								updatedArray[indexToUpdate],
							);
						setVendorData(updatedArray);
					}
				} else {
					setVendorData([...vendorData, { ...vendorModalData }]);
					console.log('vendorDataEdit', vendorData);
				}
			} else {
				if (isEdit) {
					console.log('isEdit', isEdit);
					//isEdit is a flag used for targeting the field which need to update
					// if new customer and it is in edit state of shipping contact
					// Find the index of the object to be updated
					const indexToUpdate: any = vendorData.findIndex(
						(entry: any) => entry.vendornum === vendorModalData.vendornum,
					);

					if (indexToUpdate !== -1) {
						// Update the specific object in the array
						const updatedArray: any = [...vendorData];
						updatedArray[indexToUpdate] = {
							...vendorData[indexToUpdate],
							...vendorModalData,
						};
						delete updatedArray[indexToUpdate].isEdit,
							console.log(
								'updatedArray of Specific index',
								updatedArray[indexToUpdate],
							);
						setVendorData(updatedArray);
					}
				} else {
					setVendorData([...vendorData, { ...vendorModalData }]);
					console.log('vendorDataEdit', vendorData);
				}
			}
			toast.success('Vendor Data Saved Successfully');
		} catch (error: any) {
			toast.error('error', error);
		}
	};
	const handleUploadButtonClick = async () => {
		try {
			const fileURLs = [];

			const uuid = uuidv4();
			const fileRef = ref(storage, `images/${uuid}.png`);
			await uploadBytes(fileRef, selectedFile, {
				customMetadata: {
					originalName: selectedFile.name,
				},
			});
			const downloadURL = await getDownloadURL(fileRef);
			fileURLs.push({
				fileName: `${uuid}.png`,
				location: downloadURL,
				originalName: selectedFile.name,
			});

			return fileURLs;
		} catch (error) {
			console.error('Upload error:', error);
		}
	};
	const handleImageChange = (event: any) => {
		const file = event.target.files && event.target.files[0];
		setSelectedFile(file);
		console.log('image', selectedFile);
	};

	const handleSaveButtonClick = async () => {
		try {
			setIsLoading(true);
			console.log('loading status', isLoading);
			console.log(formik);

			const check = await formik.validateForm();

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

			if (Object.keys(check).length > 0) {
				handleNestedErrors(check);

				toast.error(`Please fill all the mandatory fields and check all formats`);
				return;
			}

			const rawMaterialData = {
				componentID: formik.values.componentID,
				description1: formik.values.description1,
				status: formik.values.status,
				sterileNonSterile: formik.values.sterileNonSterile,
				description2: formik.values.description2 || null,
				description3: formik.values.description3 || null,
				rawMaterialType: formik.values.rawMaterialType || null,
				rawMaterialSubType: formik.values.rawMaterialSubType || null,
				preferredVendor: formik.values.preferredVendor || null,
				notes: formik.values.notes || null,
				invAlert: formik.values.invAlert || null,
				alertQty: formik.values.alertQty || null,
				vendorData:
					vendorData?.map((data: any, index: any) => ({
						acceptBO: data.acceptBO || null,
						country: data.country || null,
						discountable: data.discountable || null,
						dropShipAllow: data.dropShipAllow || null,
						endDate: data.endDate || null,
						expireDate: data.expireDate || null,
						fees: data.fees || null,
						importDuty: data.importDuty || null,
						inventoryByPass: data.inventoryByPass || null,
						leadTime: data.leadTime || null,
						leadTimeDuration: data.leadTimeDuration || null,
						lotNumber: data.lotNumber || null,
						manufacturerItemDescription: data.manufacturerItemDescription || null,
						manufacturerItemNo: data.manufacturerItemNo || null,
						manufacturerName: data.manufacturerName || null,
						manufacturerUOM: data.manufacturerUOM || null,
						minimumPOQty: data.minimumPOQty || null,
						miscCost: data.miscCost || null,
						partialShip: data.partialShip || null,
						pricingCost: data.pricingCost || null,
						pricingQuantity: data.pricingQuantity || null,
						pricingUOM: data.pricingUOM || null,
						procurementUOM: data.procurementUOM || null,
						seasonalItem: data.seasonalItem || null,
						serialNumber: data.serialNumber || null,
						shippingCost: data.shippingCost || null,
						standardPricing: data.standardPricing || null,
						startDate: data.startDate || null,
						stockStatus: data.stockStatus || null,
						taxable: data.taxable || null,
						taxes: data.taxes || null,
						temporaryItem: data.temporaryItem || null,
						vendorItemNumber: data.vendorItemNumber || null,
						vendorName: data.vendorName,
						vendorNotes: updateNotesWithName(
							prevData?.vendorData?.[index]?.vendorNotes || [''],
							data.vendorNotes,
						),
						vendorProductDescription: data.vendorProductDescription || null,
						vendornum: data.vendornum || null,
					})) || [],
				componentType: formik.values.componentType || null,
				componentStandardPricing: formik.values.componentStandardPricing || 0,
				inPickStock: 0,
				pendingStock: 0,
				availableStock: 0,
				usage: 'RMORCC',
			};
			delete formik.values?.vendorNumber;
			console.log('Raw Material Data', rawMaterialData);

			if (id === 'new') {
				const vendorId = await saveRawMaterialDataToFirestore(rawMaterialData);
				console.log('created daata', vendorId);
			} else {
				const rawMaterialId = id;
				console.log('Vendor Data in edit', rawMaterialData);
				console.log('formil', formik.values);
				await updateRawMaterialInFirestore(rawMaterialData, rawMaterialId as string);
			}
			navigation(listLinkPath);
			toast.success('Data Saved Successfully');
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
			rawMaterialInfo: !collapseAll,
		});
		setCollapseAll(!collapseAll);
	};

	// TODO: Move to utils and replace in another components too!

	const updateNotesWithName = (original: unknown[], updated: unknown) => {
		const updatedNotes = [...(updated as any[])]; // Create a copy to avoid modifying the original array
		const currentDate = dayjs().format('DD MMM YYYY'); // Get current date in desired format

		updatedNotes.forEach((note, index) => {
			// Check if the index exists in originalNotesData and if the content is different
			if (original[index] && original[index] !== note) {
				// Update the note in updatedNotes array and add "Saurav"
				updatedNotes[
					index
				] += `\r\nModified by ${userName.toUpperCase()} on ${currentDate}`;
			} else if (!original[index] && note !== '') {
				// If the note doesn't exist in originalNotesData, consider it as a new note
				updatedNotes[index] += `\r\nAdded by ${userName.toUpperCase()} on ${currentDate}`;
			}
		});
		return updatedNotes;
	};
	// TODO: Move to utils and replace in another components too!
	const backToList = () => {
		if (id !== 'new') {
			let fileNamesEqual = true;
			if (selectedFile) {
				// Check if both selectedFile and prevData have imageFiles and compare their names
				fileNamesEqual = selectedFile.name === prevData.imageFiles[0]?.originalName;
			}

			if (
				deepEqual(prevData, formik.values) &&
				deepEqual(prevData.vendorData, vendorData) &&
				fileNamesEqual
			) {
				navigation(listLinkPath);
			} else {
				setBackToListModal(true);
			}
		} else {
			navigation(listLinkPath);
		}
	};

	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);
	useEffect(() => {
		if (isFormSaved) {
			setIsFormSaved(false);
			setScModal(false);
		}
	}, [isFormSaved]);
	const privileges = getUserRights('components');


	return privileges.canRead() ? (
		<PageWrapper name='Raw Materials'>
			<Subheader>
				<SubheaderLeft>
					<Button icon='HeroArrowLeft' className='!px-0' onClick={() => backToList()}>
						{`${window.innerWidth > 425 ? 'Back to List' : ''}`}
					</Button>
					<SubheaderSeparator />

					{isNewItem ? (
						'Add New Raw Material'
					) : (
						<>
							{formik.values.componentID ? `#${formik.values.componentID}` : ``}{' '}
							<Badge
								color='blue'
								variant='outline'
								rounded='rounded-full'
								className='border-transparent'>
								Edit Raw Material
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
							{!id || id != 'new' ? 'Update' : 'Save'}
						</Button>
					</div>
				</SubheaderRight>
			</Subheader>
			<Container className='flex shrink-0 grow basis-auto flex-col pb-0'>
				<div className='flex h-full flex-wrap content-start'>
					<div className='m-5 mb-4 grid w-full grid-cols-6 gap-1'>
						<div className='col-span-12 flex flex-col gap-1 xl:col-span-6'>
							<RawMaterialForm
								handleFileChange={handleImageChange}
								selectedFile={selectedFile}
								setSelectedFile={setSelectedFile}
								vendors={vendors}
								formik={formik}
								setScModal={setScModal}
								scModal={scModal}
								onSave={handleVendorData}
								handleEditClick={handleEditClick}
								childFormik={childFormikVendor}
								accordionStates={accordionStates}
								setAccordionStates={setAccordionStates}
								collapseAll={collapseAll}
								setCollapseAll={setCollapseAll}
								vendorData={vendorData}
								setVendorData={setVendorData}
								rawMaterialsType={rawMaterialsType}
								rawMaterialSubTypes={rawMaterialSubTypes}
								setRawMaterialSubTypes={setRawMaterialSubTypes}

							/>
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

export default RawMaterialPage;
