// import React, { useEffect, useState } from 'react';
// import Button from '../../../../../components/ui/Button';
// import Card, { CardBody } from '../../../../../components/ui/Card';
// import Label from '../../../../../components/form/Label';
// import Input from '../../../../../components/form/Input';
// import { useFormik } from 'formik';
// import { get, post } from '../../../../../utils/api-helper.util';
// import { Navigate, useNavigate } from 'react-router-dom';
// import { PathRoutes } from '../../../../../utils/routes/enum';
// import CreatableSelect from 'react-select/creatable'
// import { toast } from 'react-toastify';
// const AddproductForm = () => {
// 	const [formSubmitted, setFormSubmitted] = useState(false);
// 	const [entries, setEntries] = useState([{ name: '', hsn: '760410', rate: null, productCode: null, thickness: null, length: null, weight: null }]);
// 	const [dropDownValues, setDropDownValues] = useState<any>({});
// 	const navigate = useNavigate()

// 	const addProductToDatabase = async (values: any) => {
// 		console.log('values', values);
// 		try {
// 			const { data } = await post("/products", values);

// 			console.log("data", data)
// 		} catch (error) {
// 			console.error("Error Adding Product", error);
// 		}
// 	};

// 	const formik = useFormik({
// 		initialValues: {
// 			name: '',
// 			hsn: '',
// 			thickness: 0,
// 			length: 0,
// 			weight: 0,
// 		},
// 		enableReinitialize: true,
// 		onSubmit: (values) => {
// 			setFormSubmitted(true);
// 			addProductToDatabase(values);
// 		},
// 	});

// 	const handleAddEntry = () => {
// 		const lastEntry = entries[entries.length - 1];
// 		const {name, hsn, rate, thickness } = lastEntry; 
// 		console.log(thickness)
// 		const newEntry = { 
// 		  name, 
// 		  hsn,
// 		  rate, 
// 		  productCode: null, 
// 		  thickness, 
// 		  length: null, 
// 		  weight: null 
// 		};
// 		setEntries([...entries, newEntry]);
// 	  };

// 	const handleSaveEntries = async () => {

// 		console.log("entries", entries)

// 		try {
// 			const promises = entries.map(async (entry) => {
// 				const { data } = await post("/products", entry);
// 				return data;
// 			});

// 			const results = await Promise.all(promises);
// 			console.log('Results:', results);
// 			toast.success("Product added Successfully!")
// 			navigate(PathRoutes.product)

// 		} catch (error: any) {
// 			console.error("Error Adding Product", error);
// 			toast.error("Error Adding Products", error);
// 		}
// 	};

// 	const getDropDownValues = async () => {
// 		try {
// 			const dropDownData = await get('/products/getDistinctValues');
// 			setDropDownValues(dropDownData.data || { thickness: [], length: [], weight: [] });
// 		} catch (error) {
// 			console.log("Error", error);
// 		}
// 	}


// 	const handleDeleteProduct = (index: any) => {
// 		const newProduct = [...entries]
// 		newProduct.splice(index, 1)
// 		setEntries(newProduct)
// 	}
// 	useEffect(() => {
// 		getDropDownValues();
// 	}, [])
// 	return (
// 		<div className='col-span-12 flex flex-col gap-1 xl:col-span-6'>
// 			<Card>
// 				<CardBody>
// 					<div className='flex'>
// 						<div className='bold w-full'>
// 							<Button
// 								variant='outlined'
// 								className='flex w-full items-center justify-between rounded-none border-b px-[2px] py-[0px] text-start text-lg font-bold'

// 							>
// 								Add Products
// 							</Button>
// 						</div>
// 					</div>

// 					{entries.map((entry, index) => (
// 						<>
// 							<div className='flex items-end justify-end mt-3 '>
// 								{entries.length > 1 && (
// 									<div className='flex items-end justify-end'>
// 										<Button
// 											type='button'
// 											onClick={() => handleDeleteProduct(index)}
// 											variant='outlined'
// 											color='red'
// 										>
// 											<svg
// 												xmlns='http://www.w3.org/2000/svg'
// 												fill='none'
// 												viewBox='0 0 24 24'
// 												strokeWidth='1.5'
// 												stroke='currentColor'
// 												data-slot='icon'
// 												className='h-6 w-6'>
// 												<path
// 													strokeLinecap='round'
// 													strokeLinejoin='round'
// 													d='M6 18 18 6M6 6l12 12'
// 												/>
// 											</svg>
// 										</Button>
// 									</div>
// 								)}
// 							</div>
// 							<div key={index} className='mt-2 grid grid-cols-12 gap-1'>

// 								<div className='col-span-12 lg:col-span-3'>
// 									<Label htmlFor={`name-${index}`}>
// 										Name
// 										<span className='ml-1 text-red-500'>*</span>
// 									</Label>
// 									<Input
// 										id={`name-${index}`}
// 										name={`name-${index}`}
// 										value={entry.name}
// 										onChange={(e) => {
// 											const updatedEntries = [...entries];
// 											updatedEntries[index].name = e.target.value;
// 											setEntries(updatedEntries);
// 										}}
// 									/>
// 									{/* ... Error handling for name field */}
// 								</div>
// 								<div className='col-span-12 lg:col-span-3'>
// 									<Label htmlFor={`hsn-${index}`}>
// 										HSN
// 									</Label>
// 									<Input
// 										id={`hsn-${index}`}
// 										name={`hsn-${index}`}
// 										value={entry.hsn}
// 										onChange={(e) => {
// 											const updatedEntries = [...entries];
// 											updatedEntries[index].hsn = e.target.value;
// 											setEntries(updatedEntries);
// 										}}
// 									/>
// 								</div>
// 								<div className='col-span-12 lg:col-span-3'>
// 									<Label htmlFor={`productCode-${index}`}>
// 										Product Code
// 									</Label>
// 									<Input
// 										id={`productCode-${index}`}
// 										name={`productCode-${index}`}
// 										type='number'
// 										min={0}
// 										value={entry.productCode as any}
// 										onChange={(e) => {
// 											const updatedEntries: any = [...entries];
// 											updatedEntries[index].productCode = parseFloat(e.target.value) || 0;
// 											setEntries(updatedEntries);
// 										}}
// 									/>
// 									{/* ... Error handling for thickness field */}
// 								</div>
// 								<div className='col-span-12 lg:col-span-3'>
// 									<Label htmlFor={`rate-${index}`}>
// 										Rate
// 									</Label>
// 									<Input
// 										id={`rate-${index}`}
// 										name={`rate-${index}`}
// 										type='number'
// 										min={0}
// 										value={entry.rate as any}
// 										onChange={(e) => {
// 											const updatedEntries: any = [...entries];
// 											updatedEntries[index].rate = parseFloat(e.target.value) || 0;
// 											setEntries(updatedEntries);
// 										}}
// 									/>
// 									{/* ... Error handling for thickness field */}
// 								</div>
// 								<div className='col-span-12 lg:col-span-4'>
// 									<Label htmlFor={`thickness-${index}`}>
// 										Thickness
// 									</Label>
// 									<CreatableSelect
// 										id={`thickness-${index}`}
// 										name={`thickness-${index}`}
// 										options={dropDownValues && dropDownValues?.thickness?.map((value: any) => ({ value, label: value.toString() ?? "" }))}
// 										onChange={(selectedOption: any) => {
// 											const updatedEntries: any = [...entries];
// 											updatedEntries[index].thickness = parseFloat(selectedOption.value) || 0;
// 											setEntries(updatedEntries);
// 										}}
// 									/>
// 								</div>
// 								<div className='col-span-12 lg:col-span-4'>
// 									<Label htmlFor={`length-${index}`}>
// 										Length
// 									</Label>
// 									<CreatableSelect
// 										id={`length-${index}`}
// 										name={`length-${index}`}
// 										options={dropDownValues && dropDownValues?.length?.map((value: any) => ({ value, label: value.toString() ?? "" }))}
// 										onChange={(selectedOption: any) => {
// 											const updatedEntries: any = [...entries];
// 											updatedEntries[index].length = parseFloat(selectedOption.value) || 0;
// 											setEntries(updatedEntries);
// 										}}
// 									/>
// 								</div>
// 								<div className='col-span-12 lg:col-span-4'>
// 									<Label htmlFor={`weight-${index}`}>
// 										Weight
// 									</Label>
// 									<CreatableSelect
// 										id={`weight-${index}`}
// 										name={`weight-${index}`}
// 										options={dropDownValues && dropDownValues?.weight?.map((value: any) => ({ value, label: value?.toString() ?? "" }))}
// 										onChange={(selectedOption: any) => {
// 											const updatedEntries: any = [...entries];
// 											updatedEntries[index].weight = parseFloat(selectedOption.value) || 0;
// 											setEntries(updatedEntries);
// 										}}
// 									/>
// 								</div>
// 							</div>
// 						</>
// 					))}
// 					<div className='flex mt-2 gap-2'>
// 						<Button variant='solid' color='blue' type='button' onClick={handleAddEntry}>
// 							Add Entry
// 						</Button>

// 						<Button variant='solid' color='blue' type='button' onClick={handleSaveEntries}>
// 							Save Entries
// 						</Button>
// 					</div>
// 				</CardBody>
// 			</Card>
// 		</div>
// 	);
// };

// export default AddproductForm;

import React, { useEffect, useState } from 'react';
import Button from '../../../../../components/ui/Button';
import Card, { CardBody } from '../../../../../components/ui/Card';
import Label from '../../../../../components/form/Label';
import Input from '../../../../../components/form/Input';
import { useFormik } from 'formik';
import { get, post } from '../../../../../utils/api-helper.util';
import { Navigate, useNavigate } from 'react-router-dom';
import { PathRoutes } from '../../../../../utils/routes/enum';
import CreatableSelect from 'react-select/creatable';
import { toast } from 'react-toastify';
import { productsSchema } from '../../../../../utils/formValidations';
import { entries } from 'lodash';

const AddproductForm = () => {
	const [dropDownValues, setDropDownValues] = useState<any>({});
	const navigate = useNavigate();



	const formik: any = useFormik({
		initialValues: {
			entries: [{
				name: '',
				hsn: '',
				rate: '',
				productCode: '',
				thickness: '',
				length: '',
				weight: '',
			}],
		},
		validationSchema: productsSchema,
		onSubmit: () => { },
	});

	const getDropDownValues = async () => {
		try {
			const dropDownData = await get('/products/getDistinctValues');
			setDropDownValues(dropDownData.data || { thickness: [], length: [], weight: [] });
		} catch (error) {
			console.log("Error", error);
		}
	}
	useEffect(() => {
		getDropDownValues();
	}, [])

	// const handleAddEntry = () => {
	// 	formik.setFieldValue('entries', [...formik.values.entries, {
	// 		name: '',
	// 		hsn: '',
	// 		rate: null,
	// 		productCode: null,
	// 		thickness: null,
	// 		length: null,
	// 		weight: null
	// 	}]);


	// };
	const handleAddEntry = () => {
		const { entries } = formik.values;
		const lastEntry = entries[entries.length - 1];
		const { name, hsn, rate } = lastEntry;
	
		formik.setFieldValue('entries', [
			...entries,
			{
				name,
				hsn,
				rate,
				productCode: null,
				thickness: null,
				length: null,
				weight: null
			}
		]);
	};
	

	const handleDeleteProduct = (index: any) => {
		const newEntries = [...formik.values.entries];
		newEntries.splice(index, 1);
		formik.setFieldValue('entries', newEntries);
	};

	const handleSaveEntries = async () => {

		try {
			await formik.validateForm();
			console.log(formik.errors);
			console.log(formik.values);

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
			const promises = formik.values.entries.map(async (entry: any) => {
				const { data } = await post("/products", entry);
				return data;
			});

			const results = await Promise.all(promises);
			console.log('Results:', results);
			toast.success("Product added Successfully!")
			navigate(PathRoutes.product)

		} catch (error: any) {
			console.error("Error Adding Product", error);
			toast.error("Error Adding Products", error);
		}
	};
	console.log('Formik Errors', formik.touched)
	return (
		<div className='col-span-12 flex flex-col gap-1 xl:col-span-6'>
			<Card>
				<CardBody>
					<div className='flex'>
						<div className='bold w-full'>
							<Button variant='outlined' className='flex w-full items-center justify-between rounded-none border-b px-[2px] py-[0px] text-start text-lg font-bold'>
								Add Products
							</Button>
						</div>
					</div>

					{formik.values.entries.map((entry: any, index: any) => (
						<div className="relative py-5" key={index}>
							<div className='flex items-end justify-end mt-3 absolute right-0 top-[5px]'>
								{formik.values.entries.length > 1 && (
									<div className='flex items-end justify-end'>
										<Button type='button' onClick={() => handleDeleteProduct(index)} variant='outlined' color='red' icon='HeroXMark' />
									</div>
								)}
							</div>
							<div className='mt-2 grid grid-cols-12 gap-1'>
								<div className='col-span-12 lg:col-span-3'>
									<Label htmlFor={`name-${index}`}>
										Name <span className='text-red-500'>*</span>
									</Label>
									<Input
										type='text'
										id={`name-${index}`}
										// name={`name-${index}`}	

										name={`entries[${index}].name`}
										value={entry.name}
										// onBlur={() => {
										// 	formik.handleBlur(`name-${index}`);
										// 	console.log(formik.touched.entries?.[index]?.name, formik.errors.entries?.[index]?.name);
										// }}
										onBlur={formik.handleBlur}
										onChange={(e) => {
											const newEntries = [...formik.values.entries];
											newEntries[index].name = e.target.value;
											formik.setFieldValue('entries', newEntries);
										}}
									/>


									{
										formik.touched.entries?.[index]?.name &&
											formik.errors.entries?.[index]?.name ? (
											<div className='text-red-500'>
												{formik.errors.entries[index].name}
											</div>
										) : null}
								</div>
								<div className='col-span-12 lg:col-span-3'>
									<Label htmlFor={`hsn-${index}`}>
										HSN
									</Label>
									<Input
										id={`hsn-${index}`}
										name={`entries[${index}].hsn`}
										value={entry.hsn}
										onBlur={formik.handleBlur}
										onChange={(e) => {
											const newEntries = [...formik.values.entries];
											newEntries[index].hsn = e.target.value;
											formik.setFieldValue('entries', newEntries);
										}}
									/>
									{
										formik.touched.entries?.[index]?.hsn &&
											formik.errors.entries?.[index]?.hsn ? (
											<div className='text-red-500'>
												{formik.errors.entries[index].hsn}
											</div>
										) : null}
								</div>
								<div className='col-span-12 lg:col-span-3'>
									<Label htmlFor={`productCode-${index}`}>
										Product Code
									</Label>
									<Input
										id={`productCode-${index}`}
										name={`entries[${index}].productCode`}
										type='number'
										value={entry?.productCode}
										onBlur={formik.handleBlur}
										onChange={(e) => {
											const newEntries = [...formik.values.entries];
											newEntries[index].productCode = e.target.value;
											formik.setFieldValue('entries', newEntries);
										}}
									/>
									{
										formik.touched.entries?.[index]?.productCode &&
											formik.errors.entries?.[index]?.productCode ? (
											<div className='text-red-500'>
												{formik.errors.entries[index].productCode}
											</div>
										) : null}
								</div>
								<div className='col-span-12 lg:col-span-3'>
									<Label htmlFor={`rate-${index}`}>
										Rate
									</Label>
									<Input
										id={`rate-${index}`}
										name={`entries[${index}].rate`}
										type='number'
										value={entry.rate}
										onBlur={formik.handleBlur}
										onChange={(e) => {
											const newEntries = [...formik.values.entries];
											newEntries[index].rate = e.target.value;
											formik.setFieldValue('entries', newEntries);
										}}
									/>
									{
										formik.touched.entries?.[index]?.rate &&
											formik.errors.entries?.[index]?.rate ? (
											<div className='text-red-500'>
												{formik.errors.entries[index].rate}
											</div>
										) : null}
								</div>
								<div className='col-span-12 lg:col-span-4'>
									<Label htmlFor={`thickness-${index}`}>
										Thickness
									</Label>
									<CreatableSelect
										id={`thickness-${index}`}
										name={`entries[${index}].thickness`}
										options={dropDownValues && dropDownValues?.thickness?.map((value: any) => ({ value, label: value.toString() ?? "" }))}
										// value={entry.thickness.value}
										onBlur={formik.handleBlur}
										onChange={(selectedOption: any) => {
											const newEntries: any = [...formik.values.entries];
											newEntries[index].thickness = parseFloat(selectedOption.value);
											formik.setFieldValue('entries', newEntries);
										}}
									/>
									{/* {
										formik.touched.entries?.[index]?.thickness &&
											formik.errors.entries?.[index]?.thickness ? (
											<div className='text-red-500'>
												{formik.errors.entries[index].thickness}
											</div>
										) : null} */}
								</div>
								<div className='col-span-12 lg:col-span-4'>
									<Label htmlFor={`length-${index}`}>
										Length
									</Label>
									<CreatableSelect
										id={`length-${index}`}
										name={`length-${index}`}
										options={dropDownValues && dropDownValues?.length?.map((value: any) => ({ value, label: value.toString() ?? "" }))}
										// value={entry.length.value}
										onChange={(selectedOption: any) => {
											const newEntries: any = [...formik.values.entries];
											newEntries[index].length = parseFloat(selectedOption.value);
											formik.setFieldValue('entries', newEntries);
										}}
									/>
								</div>
								<div className='col-span-12 lg:col-span-4'>
									<Label htmlFor={`weight-${index}`}>
										Weight
									</Label>
									<CreatableSelect
										id={`weight-${index}`}
										name={`weight-${index}`}
										options={dropDownValues && dropDownValues?.weight?.map((value: any) => ({ value, label: value?.toString() ?? "" }))}
										// value={entry.weight.value}
										onChange={(selectedOption: any) => {
											const newEntries: any = [...formik.values.entries];
											newEntries[index].weight = parseFloat(selectedOption.value);
											formik.setFieldValue('entries', newEntries);
										}}
									/>
								</div>
								{/* <div className='col-span-12 lg:col-span-3'>
									<Label htmlFor={`rate-${index}`}>
										Weight (kg)
									</Label>
									<Input
										id={`rate-${index}`}
										name={`entries[${index}].weight`}
										type='number'
										value={entry?.thickness * entry?.length}
										onBlur={formik.handleBlur}
										onChange={(e) => {
											const newEntries = [...formik.values.entries];
											newEntries[index].weight = e.target.value;
											formik.setFieldValue('entries', newEntries);
										}}
									/>
									{
										formik.touched.entries?.[index]?.weight &&
											formik.errors.entries?.[index]?.weight ? (
											<div className='text-red-500'>
												{formik.errors.entries[index].weight}
											</div>
										) : null}
								</div> */}

							</div>
						</div>
					))}
					<div className='flex mt-2 gap-2'>
						<Button variant='solid' color='blue' type='button' onClick={handleAddEntry}>
							Add Entry
						</Button>
						<Button variant='solid' color='blue' type='submit' onClick={handleSaveEntries}>
							Save Entries
						</Button>
					</div>
				</CardBody>
			</Card>
		</div>
	);
};

export default AddproductForm;
