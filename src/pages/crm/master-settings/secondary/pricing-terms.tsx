import { useCallback, useEffect, useState } from 'react';
import { useFormik } from 'formik';

import PageWrapper from '../../../../components/layouts/PageWrapper/PageWrapper';
import Container from '../../../../components/layouts/Container/Container';
import { appPages } from '../../../../config/pages.config';
import Card, {
	CardBody,
	CardHeader,
	CardHeaderChild,
	CardTitle,
} from '../../../../components/ui/Card';
import Input from '../../../../components/form/Input';

import Subheader, {
	SubheaderLeft,
} from '../../../../components/layouts/Subheader/Subheader';

import {

	doc,
	getDoc,
	setDoc,
} from 'firebase/firestore';
import firestore from '../../../../firebase'; // Import your Firebase configuration

import Modal, {
	ModalFooter,
	ModalFooterChild,
	ModalHeader,
} from '../../../../components/ui/Modal';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import Button from '../../../../components/ui/Button';
import getUserRights from '../../../../hooks/useUserRights';
import React from 'react';

const masterSettingsPath = `../${appPages.masterSettingsAppPages.subPages.settingsPage.to}`;

const privileges = getUserRights('mastersetting');

const PricingTermsPage = () => {
	const [prevData, setPrevData] = useState<any>({});
	const [backToSettingsModal, setBackToSettingsModal] = useState(false);
	const navigation = useNavigate();


	const createUserInitialValues = {
		notes: [''], // Assuming 'notes' is an array of strings
	};

	const formik = useFormik({
		initialValues: createUserInitialValues,
		enableReinitialize: true,
		onSubmit: (values) => {
			console.log('called', values);
		},
	});

	const handleChangeNotes = (event: any, index: number) => {
		const newNotes = [...formik.values.notes];
		const target = event.target;
		const inputValue = target.value;
		const cursorPosition = target.selectionStart || 0;

		let formattedValue = inputValue.toUpperCase(); // Capitalize the entire value

		// Use a ref to store and retrieve the cursor position
		const cursorPositionRef: any = React.createRef<HTMLTextAreaElement | HTMLInputElement>();
		cursorPositionRef.current = target;

		// Schedule a microtask to set the cursor position after the re-render
		Promise.resolve().then(() => {
			if (cursorPositionRef.current !== undefined) {
				cursorPositionRef.current.setSelectionRange(cursorPosition, cursorPosition);
			}
		});
		newNotes[index] = formattedValue;
		formik.setFieldValue('notes', newNotes);
	};

	const handleAddNote = () => {
		formik.setFieldValue('notes', [...formik.values.notes, '']);
	};

	const handleDeleteNote = (indexToDelete: number) => {
		formik.setValues((prevValues: any) => {
			const { notes } = prevValues;

			// Ensure there is at least one note remaining
			if (notes.length > 1) {
				const newNotes = notes.filter(
					(_note: string, index: number) => index !== indexToDelete,
				);
				return { ...prevValues, notes: newNotes };
			}

			return prevValues; // Do nothing if there's only one note
		});
	};

	const handleSaveButtonClick = async () => {
		try {
			const finalValues = formik.values.notes.filter((value: string) => {
				return value !== '' && value !== null && value !== undefined;
			});

			await saveInFirestore(finalValues, 'pricingTerms');
		} catch (error) {
			console.error('Error saving data:', error);
		}
	};

	const saveInFirestore = async (finalValues: string[], settingID: string) => {
		try {
			console.log('Saving...', finalValues);
			console.log('ID...', settingID);

			await setDoc(doc(firestore, 'masterSettings/' + settingID), {
				finalValues,
			});

			navigation(masterSettingsPath);

			toast.success('Data updated successfully!');
		} catch (error: any) {
			console.error('Error updating data:', error);
			toast.error('Error updating data:', error);
			throw error;
		}
	};

	const getSettingFromFirestore = useCallback(
		async (settingID: string) => {
			try {
				console.log('settingID', settingID);

				const previousSettings = await getDoc(doc(firestore, `masterSettings/${settingID}`));
				const thisSettings: any = previousSettings.data();

				if (thisSettings) {
					console.log('thisSettings', thisSettings);

					const prevDataNew = thisSettings.finalValues;
					setPrevData(prevDataNew);

					const fetchedValues = thisSettings.finalValues;
					formik.setValues({ ...formik.values, notes: fetchedValues });
				} else {
					setPrevData(['']);
				}
			} catch (error) {
				console.error('Error fetching data:', error);
			}
		},
		[formik, getDoc, firestore],
	);

	const deepEqual = (obj1: any, obj2: any) => {
		if (obj1 === obj2) {
			return true;
		}

		if (
			typeof obj1 !== 'object' ||
			obj1 === null ||
			typeof obj2 !== 'object' ||
			obj2 === null
		) {
			return false;
		}

		const keys1 = Object.keys(obj1);
		const keys2 = Object.keys(obj2);

		if (keys1.length !== keys2.length) {
			return false;
		}

		for (const key of keys1) {
			const val1 = obj1[key];
			const val2 = obj2[key];

			if (typeof val1 === 'object' || typeof val2 === 'object') {
				if (!deepEqual(val1, val2)) {
					return false;
				}
			} else if (val1 !== val2) {
				return false;
			}
		}

		return true;
	};

	const backToMasterSettings = () => {
		if (deepEqual(prevData, formik.values.notes)) {
			navigation(masterSettingsPath);
		} else {
			setBackToSettingsModal(true);
		}
	};

	useEffect(() => {
		getSettingFromFirestore('pricingTerms');
	}, []);

	return (
		<PageWrapper name='Master Settings'>
			<Subheader>
				<SubheaderLeft>
					<Button
						icon='HeroArrowLeft'
						className='!px-0'
						onClick={() => {
							backToMasterSettings();
						}}>
						Back to Master Settings
					</Button>
				</SubheaderLeft>
			</Subheader>
			<Container>
				<Card className='h-full'>
					<CardHeader>
						<CardHeaderChild>
							<CardTitle>Pricing Terms</CardTitle>
						</CardHeaderChild>
						<CardHeaderChild>
							<Button
								type='button'
								onClick={handleAddNote}
								variant='outline'
								color='zinc'
								size='lg'
								className='w-64'
								isDisable={!privileges.canWrite()}>
								Add More
							</Button>
						</CardHeaderChild>
					</CardHeader>
					<CardBody className='overflow-auto'>
						<div className='grid grid-cols-6 gap-4'>
							<div className='col-span-12 lg:col-span-12'>
								<div className='col-span-12 lg:col-span-4'>
									<div>
										{formik?.values?.notes?.map(
											(note: string, index: number) => (
												<div key={index} className='mb-2 flex'>
													<Input
														id={`notes[${index}]`}
														name={`notes[${index}]`}
														onChange={(event) =>
															handleChangeNotes(event, index)
														}
														value={note}
														onBlur={formik.handleBlur}
														placeholder={`${index + 1}`}
														className='mr-2'
														disabled={!privileges.canWrite()}
													/>

													{formik.values.notes.length > 1 && (
														<Button
															type='button'
															onClick={() => handleDeleteNote(index)}
															variant='outlined'
															color='red'
															className='w-24'
															isDisable={!privileges.canWrite()}>
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
													)}
												</div>
											),
										)}
									</div>
								</div>

								<div className='col-span-1'>
									<Button
										variant='solid'
										color='blue'
										type='button'
										size='lg'
										isDisable={!privileges.canWrite()}
										onClick={handleSaveButtonClick}>
										Save
									</Button>
								</div>
							</div>
						</div>
					</CardBody>
				</Card>

				<div className='col-span-12 md:col-span-4'>
					<Card>
						<CardBody>
							<Modal
								isOpen={backToSettingsModal}
								setIsOpen={setBackToSettingsModal}
								isScrollable>
								<ModalHeader className='m-5 flex items-center justify-between rounded-none border-b text-lg font-bold'>
									There are unsaved changes, are you sure you want to go back?
								</ModalHeader>
								<ModalFooter>
									<ModalFooterChild />
									<ModalFooterChild>
										<Button
											variant='outline'
											onClick={() => setBackToSettingsModal(false)}>
											Keep
										</Button>
										<Button
											variant='solid'
											onClick={() => navigation(masterSettingsPath)}>
											Discard
										</Button>
									</ModalFooterChild>
								</ModalFooter>
							</Modal>
						</CardBody>
					</Card>
				</div>
			</Container>
		</PageWrapper>
	);
};

export default PricingTermsPage;
