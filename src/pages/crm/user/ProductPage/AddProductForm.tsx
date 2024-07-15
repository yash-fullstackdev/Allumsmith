import { entries } from 'lodash';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { productsSchema } from '../../../../utils/formValidations';
import { useFormik } from 'formik';
import { toast } from 'react-toastify';
import { get, post } from '../../../../utils/api-helper.util';
import { PathRoutes } from '../../../../utils/routes/enum';
import Card, { CardBody } from '../../../../components/ui/Card';
import Button from '../../../../components/ui/Button';
import Label from '../../../../components/form/Label';
import Input from '../../../../components/form/Input';

const AddproductForm = () => {
	const [dropDownValues, setDropDownValues] = useState<any>({});
	const navigate = useNavigate();

	const formik: any = useFormik({
		initialValues: {
			entries: [
				{
					name: '',
					hsn: '',

					productCode: '',
					thickness: '',
					length: '',
					weight: '',
					premium_rate: '',
					wooden_rate: '',
					commercial_rate: '',
					anodize_rate: '',
				},
			],
		},
		validationSchema: productsSchema,
		onSubmit: () => {},
	});

	const getDropDownValues = async () => {
		try {
			const dropDownData = await get('/products/getDistinctValues');
			setDropDownValues(dropDownData.data || { thickness: [], length: [], weight: [] });
		} catch (error) {
			console.log('Error', error);
		}
	};
	useEffect(() => {
		getDropDownValues();
	}, []);

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
		const { name, hsn, thickness, length, weight } = lastEntry;

		console.log('lastEntry', lastEntry);

		formik.setFieldValue('entries', [
			...entries,
			{
				name,
				hsn,
				productCode: null,
				thickness,
				length,
				weight,
			},
		]);
	};

	const handleDeleteProduct = (index: any) => {
		const newEntries = [...formik.values.entries];
		newEntries.splice(index, 1);
		formik.setFieldValue('entries', newEntries);
	};

	const handleSaveEntries = async () => {
		try {
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
			formik.values.entries = formik.values.entries.map((entry:any) => ({
				...entry,
				weight: Number(entry.weight),
				thickness: Number(entry.thickness),
				length: Number(entry.length),
				premium_rate: Number(entry.premium_rate),
				wooden_rate: Number(entry.wooden_rate),
				anodize_rate: Number(entry.anodize_rate),
				commercial_rate: Number(entry.commercial_rate)
			}))
			console.log('final data', formik.values.entries);


			const promises = formik.values.entries.map(async (entry: any) => {
				const { data } = await post('/products', entry);
				return data;
			});

			const results = await Promise.all(promises);
			// console.log('Results:', results);
			toast.success('Product added Successfully!');
			navigate(PathRoutes.product);
		} catch (error: any) {
			console.error('Error Adding Product', error);
			toast.error('Error Adding Products', error);
		}
	};
	console.log('Formik Errors', formik.touched);
	return (
		<div className='col-span-12 flex flex-col gap-1 xl:col-span-6'>
			<Card>
				<CardBody>
					<div className='flex'>
						<div className='bold w-full'>
							<Button
								variant='outlined'
								className='flex w-full items-center justify-between rounded-none border-b px-[2px] py-[0px] text-start text-lg font-bold'>
								Add Products
							</Button>
						</div>
					</div>

					{formik.values.entries.map((entry: any, index: any) => (
						<div className='relative py-5' key={index}>
							<div className='absolute right-0 top-[5px] mt-3 flex items-end justify-end'>
								{formik.values.entries.length > 1 && (
									<div className='flex items-end justify-end'>
										<Button
											type='button'
											onClick={() => handleDeleteProduct(index)}
											variant='outlined'
											color='red'
											icon='HeroXMark'
										/>
									</div>
								)}
							</div>
							<div className='mt-2 grid grid-cols-12 gap-1'>
								<div className='col-span-12 lg:col-span-4'>
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
										onChange={(e: any) => {
											const newEntries = [...formik.values.entries];
											newEntries[index].name = e.target.value;
											formik.setFieldValue('entries', newEntries);
										}}
									/>

									{formik.touched.entries?.[index]?.name &&
									formik.errors.entries?.[index]?.name ? (
										<div className='text-red-500'>
											{formik.errors.entries[index].name}
										</div>
									) : null}
								</div>
								<div className='col-span-12 lg:col-span-4'>
									<Label htmlFor={`hsn-${index}`}>HSN</Label>
									<Input
										id={`hsn-${index}`}
										name={`entries[${index}].hsn`}
										value={entry.hsn}
										onBlur={formik.handleBlur}
										onChange={(e: any) => {
											const newEntries = [...formik.values.entries];
											newEntries[index].hsn = e.target.value;
											formik.setFieldValue('entries', newEntries);
										}}
									/>
									{formik.touched.entries?.[index]?.hsn &&
									formik.errors.entries?.[index]?.hsn ? (
										<div className='text-red-500'>
											{formik.errors.entries[index].hsn}
										</div>
									) : null}
								</div>
								<div className='col-span-12 lg:col-span-4'>
									<Label htmlFor={`productCode-${index}`}>
										Product Code <span className='text-red-500'>*</span>
									</Label>
									<Input
										id={`productCode-${index}`}
										name={`entries[${index}].productCode`}
										value={entry?.productCode}
										onBlur={formik.handleBlur}
										onChange={(e: any) => {
											const newEntries = [...formik.values.entries];
											newEntries[index].productCode = e.target.value;
											formik.setFieldValue('entries', newEntries);
										}}
									/>
									{formik.touched.entries?.[index]?.productCode &&
									formik.errors.entries?.[index]?.productCode ? (
										<div className='text-red-500'>
											{formik.errors.entries[index].productCode}
										</div>
									) : null}
								</div>

								<div className='col-span-12 lg:col-span-4'>
									<Label htmlFor={`thickness-${index}`}>
										Thickness(mm) <span className='text-red-500'>*</span>
									</Label>

									<Input
										id={`thickness-${index}`}
										name={`entries[${index}].thickness`}
										type='number'
										value={entry.thickness}
										onBlur={formik.handleBlur}
										onChange={(e: any) => {
											const newEntries = [...formik.values.entries];
											newEntries[index].thickness = e.target.value;
											formik.setFieldValue('entries', newEntries);
										}}
									/>
									{formik.touched.entries?.[index]?.thickness &&
									formik.errors.entries?.[index]?.thickness ? (
										<div className='text-red-500'>
											{formik.errors.entries[index].thickness}
										</div>
									) : null}
								</div>
								<div className='col-span-12 lg:col-span-4'>
									<Label htmlFor={`length-${index}`}>
										Length(ft) <span className='text-red-500'>*</span>
									</Label>

									<Input
										id={`length-${index}`}
										name={`entries[${index}].length`}
										type='number'
										value={entry.length}
										onBlur={formik.handleBlur}
										onChange={(e: any) => {
											const newEntries = [...formik.values.entries];
											newEntries[index].length = e.target.value;
											formik.setFieldValue('entries', newEntries);
										}}
									/>
									{formik.touched.entries?.[index]?.length &&
									formik.errors.entries?.[index]?.length ? (
										<div className='text-red-500'>
											{formik.errors.entries[index].length}
										</div>
									) : null}
								</div>
								<div className='col-span-12 lg:col-span-4'>
									<Label htmlFor={`weight-${index}`}>
										Weight (kg) <span className='text-red-500'>*</span>
									</Label>

									<Input
										id={`weight-${index}`}
										name={`entries[${index}].weight`}
										type='number'
										min={0}
										value={entry.weight}
										onBlur={formik.handleBlur}
										onChange={(e: any) => {
											const newEntries = [...formik.values.entries];
											newEntries[index].weight = e.target.value;
											formik.setFieldValue('entries', newEntries);
										}}
									/>
									{formik.touched.entries?.[index]?.weight &&
									formik.errors.entries?.[index]?.weight ? (
										<div className='text-red-500'>
											{formik.errors.entries[index].weight}
										</div>
									) : null}
								</div>
								<div className='col-span-12 lg:col-span-3'>
									<Label htmlFor={`rate-${index}`}>Wooden Coating Rate(rs)</Label>
									<Input
										id={`wooden_rate-${index}`}
										name={`entries[${index}].wooden_rate`}
										type='number'
										value={entry.wooden_rate}
										onBlur={formik.handleBlur}
										min={0}
										onChange={(e: any) => {
											const newEntries = [...formik.values.entries];
											newEntries[index].wooden_rate = e.target.value;
											formik.setFieldValue('entries', newEntries);
										}}
									/>
									{formik.touched.entries?.[index]?.wooden_rate &&
									formik.errors.entries?.[index]?.wooden_rate ? (
										<div className='text-red-500'>
											{formik.errors.entries[index].wooden_rate}
										</div>
									) : null}
								</div>
								<div className='col-span-12 lg:col-span-3'>
									<Label htmlFor={`commercial_rate-${index}`}>
										Commercial Coating Rate(rs)
									</Label>
									<Input
										id={`commercial_rate-${index}`}
										name={`entries[${index}].commercial_rate`}
										type='number'
										value={entry.commercial_rate}
										min={0}
										onBlur={formik.handleBlur}
										onChange={(e: any) => {
											const newEntries = [...formik.values.entries];
											newEntries[index].commercial_rate = e.target.value;
											formik.setFieldValue('entries', newEntries);
										}}
									/>
									{formik.touched.entries?.[index]?.commercial_rate &&
									formik.errors.entries?.[index]?.commercial_rate ? (
										<div className='text-red-500'>
											{formik.errors.entries[index].wooden_rate}
										</div>
									) : null}
								</div>
								<div className='col-span-12 lg:col-span-3'>
									<Label htmlFor={`anodize_rate-${index}`}>
										Anodize Coating Rate(rs)
									</Label>
									<Input
										id={`anodize_rate-${index}`}
										name={`entries[${index}].anodize_rate`}
										type='number'
										value={entry.anodize_rate}
										min={0}
										onBlur={formik.handleBlur}
										onChange={(e: any) => {
											const newEntries = [...formik.values.entries];
											newEntries[index].anodize_rate = e.target.value;
											formik.setFieldValue('entries', newEntries);
										}}
									/>
									{formik.touched.entries?.[index]?.anodize_rate &&
									formik.errors.entries?.[index]?.anodize_rate ? (
										<div className='text-red-500'>
											{formik.errors.entries[index].anodize_rate}
										</div>
									) : null}
								</div>
								<div className='col-span-12 lg:col-span-3'>
									<Label htmlFor={`premium_rate-${index}`}>
										Premium Coating Rate(rs)
									</Label>
									<Input
										id={`premium_rate-${index}`}
										name={`entries[${index}].premium_rate`}
										type='number'
										value={entry.premium_rate}
										onBlur={formik.handleBlur}
										min={0}
										onChange={(e: any) => {
											const newEntries = [...formik.values.entries];
											newEntries[index].premium_rate = e.target.value;
											formik.setFieldValue('entries', newEntries);
										}}
									/>
									{formik.touched.entries?.[index]?.premium_rate &&
									formik.errors.entries?.[index]?.premium_rate ? (
										<div className='text-red-500'>
											{formik.errors.entries[index].premium_rate}
										</div>
									) : null}
								</div>
							</div>
						</div>
					))}
					<div className='mt-2 flex gap-2'>
						<Button variant='solid' color='blue' type='button' onClick={handleAddEntry}>
							Add Entry
						</Button>
						<Button
							variant='solid'
							color='blue'
							type='submit'
							onClick={handleSaveEntries}>
							Save Entries
						</Button>
					</div>
				</CardBody>
			</Card>
		</div>
	);
};

export default AddproductForm;
