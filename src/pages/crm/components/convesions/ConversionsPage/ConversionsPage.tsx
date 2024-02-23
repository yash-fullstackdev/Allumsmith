/* eslint-disable no-restricted-syntax */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable react/react-in-jsx-scope */
import { useNavigate, useParams } from 'react-router-dom';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useFormik } from 'formik';
import {
	collection,
	doc,
	getDoc,
	getDocs,
	setDoc,
	updateDoc,
	query,
	where,
} from 'firebase/firestore';
import { toast } from 'react-toastify';
import { v4 as uuidv4 } from 'uuid';
import dayjs from 'dayjs';
import { firestore } from '../../../../..';
import { appPages } from '../../../../../config/pages.config';
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
import getUserRights from '../../../../../hooks/useUserRights';
import { deepEqual } from '../../../../../utils/backToList.util';
import Card, { CardBody, CardHeader, CardTitle } from '../../../../../components/ui/Card';
import Label from '../../../../../components/form/Label';
import Input from '../../../../../components/form/Input';
import Select from '../../../../../components/form/Select';
import { handleInputChange } from '../../../../../utils/capitalizedFunction.util';
import Textarea from '../../../../../components/form/Textarea';
import FieldWrap from '../../../../../components/form/FieldWrap';
import PageWrapper from '../../../../../components/layouts/PageWrapper/PageWrapper';
import { conversionComponentSchema } from '../../../../../utils/formValidations';

const listLinkPath = `../${appPages.crmAppPages.subPages.componentsPage.subPages.conversionsPage.listPage.to}`;

const ConversionsPage = () => {
	const firebaseMainKey = 'components';

	const { id } = useParams();
	const isNewItem = id === 'new';
	const navigation = useNavigate();

	const [formSubmitted, setFormSubmitted] = useState<boolean>(false);
	const [userName, setuserName] = useState('');
	const [prevData, setPrevData] = useState<any>({});
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [isFormSaved, setIsFormSaved] = useState(false);
	const [rawMaterials, setRawMaterials] = useState<any[]>([]);
	const [backToListModal, setBackToListModal] = useState(false);

	const createUserInitialValues = {
		notes: [''],
		componentStandardPricing: 0,
		inPickStock: 0,
		pendingStock: 0,
		availableStock: 0,
		originalComponentStandardPricing: 0,
		originalComponentQuantity: 0,
		convertedQuantity: 0,
		conversionCost: 0,
		invAlert: 'NO',
		componentType: 'CONVERTED COMPONENT',
	};

	const initialValues: any = useMemo(
		() => (id == 'new' ? { ...createUserInitialValues } : createUserInitialValues),
		[],
	);

	const formik: any = useFormik({
		initialValues,
		enableReinitialize: true,
		validationSchema: conversionComponentSchema,
		onSubmit: () => {
			setFormSubmitted(true);
		},
	});

	const getuserName = useCallback(() => {
		setuserName(`${localStorage.getItem('firstName')} ${localStorage.getItem('lastName')}`);
	}, []);

	useEffect(() => {
		getuserName();
	}, [getuserName]);

	const getConvertedComponent = useCallback(async (docID: any) => {
		try {
			const convertedComponentDoc = await getDoc(
				doc(firestore, `${firebaseMainKey}/${docID}`),
			);
			const prevData: any = convertedComponentDoc.data();
			setPrevData(prevData);

			formik.setValues({
				...formik.values,
				...convertedComponentDoc.data(),
			});
		} catch (error) {
			console.error('Error fetching CC Data', error);
		}
	}, []);

	useEffect(() => {
		getRawMaterials();
	}, []);

	const getRawMaterials = async () => {
		setIsLoading(true);

		try {
			// Define the collection reference
			const componentCollectionRef = collection(firestore, firebaseMainKey);

			const rawMaterialsRef = await getDocs(
				query(componentCollectionRef, where('usage', '==', 'RMORCC')),
			);

			const allRawMaterials = [];

			for (const rawMaterial of rawMaterialsRef.docs) {
				if (rawMaterial.id !== id) {
					const rawMaterialsWithData = {
						...rawMaterial.data(),
						id: rawMaterial.id,
					};
					allRawMaterials.push(rawMaterialsWithData);
				}
			}

			setRawMaterials(allRawMaterials);
			console.log(allRawMaterials);

			if (allRawMaterials) setIsLoading(false);

			// TODO
			if (id !== 'new') {
				// this is to get the Converted Component for edit functionality
				getConvertedComponent(id);
			}
		} catch (error) {
			console.error('Error fetching Raw Materials - RMP: ', error);
			setIsLoading(false);
		}
	};

	const backToList = () => {
		if (id !== 'new') {
			if (deepEqual(prevData, formik.values)) {
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
		}
	}, [isFormSaved]);

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

	const saveDataToFirestore = async (rawMaterialData: any) => {
		try {
			const notesData = rawMaterialData.notes || [''];
			console.log('notes Data', notesData);
			const modifiedNotes = updateNotesWithName(prevData.notes || [''], notesData);
			let payload = {};
			payload = { ...rawMaterialData, notes: modifiedNotes };
			const componentDocRef = await setDoc(
				doc(firestore, firebaseMainKey, uuidv4()),
				payload,
			);
			console.log('componentDocRef', componentDocRef);
		} catch (error: any) {
			console.error('Error Saving Data: ', error);
			toast.error('Error Saving Data: ', error);
		}
	};

	const updateDataInFirestore = async (updatedData: any, componentID: string) => {
		try {
			if (!updatedData) throw new Error('updatedData is undefined');

			const notesData = updatedData.notes || [''];
			// // Added - Before Updating in Firestore
			// // Comparing Notes
			const modifiedNotes = updateNotesWithName(prevData.notes || [''], notesData);
			console.log('updatedData', updatedData);

			const componentDocRef = doc(firestore, firebaseMainKey, componentID);
			console.log('Doc Ref', componentDocRef);

			const componentDoc = await getDoc(componentDocRef);
			console.log('Component doc', componentDoc.data());

			let payload = {};
			payload = {
				...updatedData,
				notes: modifiedNotes,
			};
			await updateDoc(componentDocRef, {
				...payload,
			});
			console.log('Update Function', updatedData);
		} catch (error: any) {
			console.error('Error Updating Data: ', error);
			toast.error('Error Updating Data: ', error);
		}
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

			const componentData = {
				componentID: formik.values.componentID,
				description1: formik.values.description1,
				status: formik.values.status,
				sterileNonSterile: formik.values.sterileNonSterile,
				description2: formik.values.description2 || null,
				description3: formik.values.description3 || null,
				componentType: formik.values.componentType || null,
				notes: formik.values.notes || null,
				invAlert: formik.values.invAlert || null,
				alertQty: formik.values.alertQty || null,
				componentStandardPricing: formik.values.componentStandardPricing || 0,
				inPickStock: 0,
				pendingStock: 0,
				availableStock: 0,
				originalComponent: formik.values.originalComponent,
				originalComponentStandardPricing: formik.values.originalComponentStandardPricing,
				originalComponentQuantity: formik.values.originalComponentQuantity,
				convertedQuantity: formik.values.convertedQuantity,
				conversionCost: formik.values.conversionCost || 0,
				newCSP: formik.values.newCSP || 0,
				usage: 'RMORCC',
			};
			console.log('Data', componentData);

			if (id === 'new') {
				const vendorId = await saveDataToFirestore(componentData);
				console.log('Data Saved - New', vendorId);
			} else {
				const componentID = id;
				console.log('EDIT DATA:', componentData);
				console.log('FORMIK', formik.values);
				await updateDataInFirestore(componentData, componentID as string);
			}
			navigation(listLinkPath);
			toast.success('Data Saved Successfully');
		} catch (error) {
			console.error('Error Saving Data: ', error);
		} finally {
			setIsLoading(false);
			console.log('loading status', isLoading);
		}
	};

	const handleAddNote = () => {
		formik.setFieldValue('notes', [...formik.values.notes, '']);
	};

	const handleOriginalComponentChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
		const selectedComponent = event.target.value;
		console.log(selectedComponent);

		formik.setFieldValue('originalComponent', selectedComponent);

		let originalComponentStandardPricing = 0;
		rawMaterials.forEach((rawMaterial: any) => {
			if (rawMaterial.componentID === selectedComponent) {
				originalComponentStandardPricing = rawMaterial.componentStandardPricing;
			}
		});
		console.log(originalComponentStandardPricing);

		formik.setFieldValue('originalComponentStandardPricing', originalComponentStandardPricing);
	};

	const calculateNewCSP = () => {
		let {
			originalComponentStandardPricing,
			originalComponentQuantity,
			convertedQuantity,
			conversionCost,
		} = formik.values;
		// console.log(originalComponentStandardPricing);
		// console.log(originalComponentQuantity);
		// console.log(convertedQuantity);
		// console.log(conversionCost);

		let newCSP = 0;

		if (conversionCost == null || conversionCost === undefined) {
			conversionCost = 0;
		}

		if (
			originalComponentStandardPricing === null ||
			originalComponentStandardPricing === undefined ||
			originalComponentStandardPricing === 0 ||
			originalComponentQuantity === null ||
			originalComponentQuantity === undefined ||
			originalComponentQuantity === 0 ||
			convertedQuantity === null ||
			convertedQuantity === undefined ||
			convertedQuantity === 0
		) {
			// At least one of the variables is null or undefined or 0
			newCSP = 0;
		} else {
			// None of the variables are null or undefined
			newCSP =
				(originalComponentStandardPricing * originalComponentQuantity + conversionCost) /
				convertedQuantity;
		}

		newCSP = parseFloat((Math.round(newCSP * 10000) / 10000).toFixed(4));

		formik.setFieldValue('newCSP', newCSP);
		formik.setFieldValue('componentStandardPricing', newCSP);
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

	const privileges = getUserRights('components');

	return privileges.canRead() ? (
		<PageWrapper name='Converted Components'>
			<Subheader>
				<SubheaderLeft>
					<Button icon='HeroArrowLeft' className='!px-0' onClick={() => backToList()}>
						{`${window.innerWidth > 425 ? 'Back to List' : ''}`}
					</Button>
					<SubheaderSeparator />

					{isNewItem ? (
						'Add New Component'
					) : (
						<>
							{formik.values.componentID ? `#${formik.values.componentID}` : ``}{' '}
							<Badge
								color='blue'
								variant='outline'
								rounded='rounded-full'
								className='border-transparent'>
								Edit Component
							</Badge>
						</>
					)}
				</SubheaderLeft>
				<SubheaderRight>
					<div className='col-span-1'>
						<Button
							variant='solid'
							color='blue'
							type='button'
							className='w-full'
							onClick={handleSaveButtonClick}
							isDisable={!privileges.canWrite() || isLoading}>
							{!id || id !== 'new' ? 'Update' : 'Save'}
						</Button>
					</div>
				</SubheaderRight>
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
													Converted Component Info
												</Button>
											</div>
										</div>
										<div className='mt-2 grid grid-cols-12 gap-1'>
											<div className='col-span-12 lg:col-span-4'>
												<Label htmlFor='componentID'>
													Component ID
													<span className='ml-1 text-red-500'>*</span>
												</Label>
												<Input
													id='componentID'
													name='componentID'
													value={formik.values.componentID}
													onChange={handleInputChange(
														formik.setFieldValue,
													)('componentID')}
													onBlur={formik.handleBlur}
													disabled={!privileges.canWrite()}
												/>
												{formik.touched.componentID &&
												formik.errors.componentID ? (
													<div className='text-red-500'>
														{formik.errors.componentID}
													</div>
												) : null}
											</div>
											<div className='col-span-12 lg:col-span-4'>
												<Label htmlFor='status'>
													Status
													<span className='ml-1 text-red-500 '>*</span>
												</Label>
												<Select
													id='status'
													name='status'
													value={formik.values.status}
													placeholder='Select Status'
													onChange={formik.handleChange}
													onBlur={formik.handleBlur}
													disabled={!privileges.canWrite()}>
													<option value='ACTIVE'>ACTIVE</option>
													<option value='INACTIVE'>INACTIVE</option>
												</Select>
												{formik.touched.status && formik.errors.status ? (
													<div className='text-red-500'>
														{formik.errors.status}
													</div>
												) : null}
											</div>
											<div className='col-span-12 lg:col-span-4'>
												<Label htmlFor='sterileNonSterile'>
													Sterile/Non Sterile
													<span className='ml-1 text-red-500 '>*</span>
												</Label>
												<Select
													id='sterileNonSterile'
													name='sterileNonSterile'
													value={formik.values.sterileNonSterile}
													placeholder='Select Sterile/Non Sterile'
													onChange={formik.handleChange}
													onBlur={formik.handleBlur}
													disabled={!privileges.canWrite()}>
													<option value='STERILE'>STERILE</option>
													<option value='NON STERILE'>NON STERILE</option>
												</Select>
												{formik.touched.sterileNonSterile &&
												formik.errors.sterileNonSterile ? (
													<div className='text-red-500'>
														{formik.errors.sterileNonSterile}
													</div>
												) : null}
											</div>
											<div className='col-span-12 lg:col-span-4'>
												<Label htmlFor='description1'>
													Description 1
													<span className='ml-1 text-red-500 '>*</span>
												</Label>
												<Input
													id='description1'
													name='description1'
													onChange={handleInputChange(
														formik.setFieldValue,
													)('description1')}
													value={formik.values.description1}
													onBlur={formik.handleBlur}
													required
													disabled={!privileges.canWrite()}
												/>
												{formik.touched.description1 &&
												formik.errors.description1 ? (
													<div className='text-red-500'>
														{formik.errors.description1}
													</div>
												) : null}
											</div>
											<div className='col-span-12 lg:col-span-4'>
												<Label htmlFor='description2'>Description 2</Label>
												<Input
													id='description2'
													name='description2'
													onChange={handleInputChange(
														formik.setFieldValue,
													)('description2')}
													value={formik.values.description2}
													onBlur={formik.handleBlur}
													required
													disabled={!privileges.canWrite()}
												/>
												{formik.touched.description2 &&
												formik.errors.description2 ? (
													<div className='text-red-500'>
														{formik.errors.description2}
													</div>
												) : null}
											</div>
											<div className='col-span-12 lg:col-span-4'>
												<Label htmlFor='description3'>Description 3</Label>
												<Input
													id='description3'
													name='description3'
													onChange={handleInputChange(
														formik.setFieldValue,
													)('description3')}
													value={formik.values.description3}
													onBlur={formik.handleBlur}
													disabled={!privileges.canWrite()}
												/>
											</div>

											<div className='col-span-12 lg:col-span-4'>
												<Label htmlFor='componentType'>
													Component Type
												</Label>
												<Input
													id='componentType'
													name='componentType'
													value='CONVERTED COMPONENT'
													onBlur={formik.handleBlur}
													disabled></Input>
											</div>
											<div className='col-span-12 lg:col-span-4'>
												<Label htmlFor='componentStandardPricing'>
													Component Standard Pricing
												</Label>
												<FieldWrap
													firstSuffix={<div className='mx-2'>$</div>}>
													<Input
														id='componentStandardPricing'
														className='pl-7'
														name='componentStandardPricing'
														type='number'
														value={
															formik.values.componentStandardPricing
														}
														onBlur={formik.handleBlur}
														disabled
													/>
												</FieldWrap>
											</div>
											<div className='col-span-12 lg:col-span-2'>
												<Label htmlFor='invAlert'>Inventory Alert</Label>
												<Select
													id='invAlert'
													name='invAlert'
													value={formik.values.invAlert}
													onChange={formik.handleChange}
													onBlur={formik.handleBlur}
													disabled={!privileges.canWrite()}>
													<option value='YES'>YES</option>
													<option value='NO'>NO</option>
												</Select>
											</div>
											<div className='col-span-12 lg:col-span-2'>
												<Label htmlFor='alertQty'>Alert Quantity</Label>
												<Input
													id='alertQty'
													name='alertQty'
													type='number'
													min={0}
													value={formik.values.alertQty}
													onChange={formik.handleChange}
													disabled={
														formik.values.invAlert !== 'YES' ||
														!privileges.canWrite()
													}
													onBlur={formik.handleBlur}
												/>
												{formik.touched.alertQty &&
												formik.errors.alertQty ? (
													<div className='text-red-500'>
														{formik.errors.alertQty}
													</div>
												) : null}
											</div>
											<div className='col-span-12 lg:col-span-4'>
												<Label htmlFor='availableStock'>
													Available Stock
												</Label>
												<Input
													id='availableStock'
													name='availableStock'
													value='0'
													onBlur={formik.handleBlur}
													required
													disabled
												/>
												{formik.touched.availableStock &&
												formik.errors.availableStock ? (
													<div className='text-red-500'>
														{formik.errors.availableStock}
													</div>
												) : null}
											</div>
											<div className='col-span-12 lg:col-span-4'>
												<Label htmlFor='inPickStock'>In Pick Stock</Label>
												<Input
													id='inPickStock'
													name='inPickStock'
													onChange={formik.handleChange}
													value='0'
													onBlur={formik.handleBlur}
													disabled
												/>
												{formik.touched.inPickStock &&
												formik.errors.inPickStock ? (
													<div className='text-red-500'>
														{formik.errors.inPickStock}
													</div>
												) : null}
											</div>
											<div className='col-span-12 lg:col-span-4'>
												<Label htmlFor='pendingStock'>Pending Stock</Label>
												<Input
													id='pendingStock'
													name='pendingStock'
													onChange={formik.handleChange}
													value='0'
													onBlur={formik.handleBlur}
													disabled
												/>
												{formik.touched.pendingStock &&
												formik.errors.pendingStock ? (
													<div className='text-red-500'>
														{formik.errors.pendingStock}
													</div>
												) : null}
											</div>

											<div className='col-span-12 lg:col-span-12'>
												<hr className='w-90  mx-auto h-1 rounded border-0 bg-gray-100 dark:bg-gray-700 md:my-2' />
											</div>

											<div className='col-span-12 flex flex-col gap-1 xl:col-span-12'>
												<Label
													htmlFor='ComponentNotes'
													style={{ fontSize: '16px' }}>
													Component Notes
												</Label>
												<div className='mt-1 grid grid-cols-6 gap-1'>
													{formik?.values?.notes?.map(
														(note: any, index: any) => (
															<div
																key={index}
																className='col-span-12'>
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
																	onBlur={formik.handleBlur}
																	placeholder={`Note ${
																		index + 1
																	}`}
																	className='mr-2'
																	disabled={
																		!privileges.canWrite()
																	}
																/>

																{formik.touched.notes &&
																	formik.errors.notes &&
																	formik.errors.notes[index] && (
																		<div className='text-red-500'>
																			{
																				formik.errors.notes[
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

											<div className='col-span-12 lg:col-span-4'>
												<Button variant='solid'>
													View Recent Purchase
												</Button>
											</div>

											<div className='col-span-12 lg:col-span-12'>
												<hr className='w-90  mx-auto h-1 rounded border-0 bg-gray-100 dark:bg-gray-700 md:my-2' />
											</div>

											<div className='col-span-12 lg:col-span-2'>
												<Label htmlFor='originalComponent'>
													Original Component
													<span className='ml-1 text-red-500 '>*</span>
												</Label>
												<Select
													id='originalComponent'
													name='originalComponent'
													value={formik.values.originalComponent}
													placeholder='Select Original Component'
													// onChange={formik.handleChange}
													onChange={handleOriginalComponentChange}
													onBlur={formik.handleBlur}
													disabled={!privileges.canWrite()}>
													{rawMaterials.map((material) => (
														<option
															key={material.componentID}
															value={material.componentID}>
															{material.componentID}
														</option>
													))}
												</Select>
												{formik.touched.originalComponent &&
												formik.errors.originalComponent ? (
													<div className='text-red-500'>
														{formik.errors.originalComponent}
													</div>
												) : null}
											</div>
											<div className='col-span-12 lg:col-span-2'>
												<Label htmlFor='originalComponentStandardPricing'>
													Original CSP
												</Label>
												<FieldWrap
													firstSuffix={<div className='mx-2'>$</div>}>
													<Input
														id='originalComponentStandardPricing'
														className='pl-7'
														name='originalComponentStandardPricing'
														type='number'
														value={
															formik.values
																.originalComponentStandardPricing
														}
														disabled
													/>
												</FieldWrap>
											</div>
											<div className='col-span-12 lg:col-span-2'>
												<Label htmlFor='originalComponentQuantity'>
													Original Quantity
													<span className='ml-1 text-red-500 '>*</span>
												</Label>
												<Input
													id='originalComponentQuantity'
													name='originalComponentQuantity'
													type='number'
													min={0}
													value={formik.values.originalComponentQuantity}
													onChange={(e) => {
														formik.handleChange(e); // Handle the change event as usual
														calculateNewCSP(); // Calculate newCSP whenever originalComponentQuantity changes
													}}
													onBlur={(e) => {
														formik.handleBlur(e); // Handle the blur event as usual
														calculateNewCSP(); // Calculate newCSP whenever originalComponentQuantity changes
													}}
												/>
												{formik.touched.originalComponentQuantity &&
												formik.errors.originalComponentQuantity ? (
													<div className='text-red-500'>
														{formik.errors.originalComponentQuantity}
													</div>
												) : null}
											</div>
											<div className='col-span-12 lg:col-span-2'>
												<Label htmlFor='convertedQuantity'>
													Converted Quantity
													<span className='ml-1 text-red-500 '>*</span>
												</Label>
												<Input
													id='convertedQuantity'
													name='convertedQuantity'
													type='number'
													value={formik.values.convertedQuantity}
													min={0}
													onChange={(e) => {
														formik.handleChange(e);
														calculateNewCSP();
													}}
													onBlur={(e) => {
														formik.handleBlur(e);
														calculateNewCSP();
													}}
												/>
												{formik.touched.convertedQuantity &&
												formik.errors.convertedQuantity ? (
													<div className='text-red-500'>
														{formik.errors.convertedQuantity}
													</div>
												) : null}
											</div>
											<div className='col-span-12 lg:col-span-2'>
												<Label htmlFor='conversionCost'>
													Conversion Cost
												</Label>
												<FieldWrap
													firstSuffix={<div className='mx-2'>$</div>}>
													<Input
														id='conversionCost'
														className='pl-7'
														name='conversionCost'
														type='number'
														value={formik.values.conversionCost}
														min={0}
														onChange={(e) => {
															formik.handleChange(e);
															calculateNewCSP();
														}}
														onBlur={(e) => {
															formik.handleBlur(e);
															calculateNewCSP();
														}}
													/>
												</FieldWrap>
											</div>
											<div className='col-span-12 lg:col-span-2'>
												<Label htmlFor='newCSP'>CSP</Label>
												<FieldWrap
													firstSuffix={<div className='mx-2'>$</div>}>
													<Input
														id='newCSP'
														className='pl-7'
														name='newCSP'
														type='number'
														value={formik.values.newCSP}
														onBlur={formik.handleBlur}
														disabled
													/>
												</FieldWrap>
											</div>
										</div>
									</CardBody>
								</Card>
							</div>
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

export default ConversionsPage;
