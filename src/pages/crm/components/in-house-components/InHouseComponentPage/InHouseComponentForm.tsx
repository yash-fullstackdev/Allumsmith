/* eslint-disable react/react-in-jsx-scope */
import React, { useState } from 'react';
import Button from '../../../../../components/ui/Button';
import Card, { CardBody } from '../../../../../components/ui/Card';
import Label from '../../../../../components/form/Label';
import Input from '../../../../../components/form/Input';
import { useFormik } from 'formik';
import { post } from '../../../../../utils/api-helper.util';

const AddproductForm = () => {
	const [formSubmitted, setFormSubmitted] = useState(false);
	const [entries, setEntries] = useState([{ name: '', hsn: '', thickness: 0, length: 0, weight: 0 }]);

	const addProductToDatabase = async (values: any) => {
		console.log('values', values);
		try {
			const { data } = await post("/products", values);
			console.log("data", data)
		} catch (error) {
			console.error("Error Adding Product", error);
		}
	};

	const formik = useFormik({
		initialValues: {
			name: '',
			hsn: '',
			thickness: 0,
			length: 0,
			weight: 0,
		},
		enableReinitialize: true,
		onSubmit: (values) => {
			setFormSubmitted(true);
			addProductToDatabase(values);
		},
	});

	const handleAddEntry = () => {
		setEntries([...entries, { name: '', hsn: '', thickness: 0, length: 0, weight: 0 }]);
	};

	const handleSaveEntries = async () => {
		try {
			const promises = entries.map(async (entry) => {
				const { data } = await post("/products", entry);
				return data;
			});

			const results = await Promise.all(promises);
			console.log('Results:', results);
		} catch (error) {
			console.error("Error Adding Product", error);
		}
	};


	const handleDeleteProduct = (index: any) => {
		const newProduct = [...entries]
		newProduct.splice(index, 1)
		setEntries(newProduct)
	}

	return (
		<div className='col-span-12 flex flex-col gap-1 xl:col-span-6'>
			<Card>
				<CardBody>
					<div className='flex'>
						<div className='bold w-full'>
							<Button
								variant='outlined'
								className='flex w-full items-center justify-between rounded-none border-b px-[2px] py-[0px] text-start text-lg font-bold'

							>
								Add Products
							</Button>
						</div>
					</div>

					{entries.map((entry, index) => (
						<>
							<div className='flex items-end justify-end mt-2'>
								{entries.length > 1 && (
									<div className='flex items-end justify-end'>
										<Button
											type='button'
											onClick={() => handleDeleteProduct(index)}
											variant='outlined'
											color='red'
										// isDisable={!privileges.canWrite()}
										>
											<svg
												xmlns='http://www.w3.org/2000/svg'
												fill='none'
												viewBox='0 0 24 24'
												strokeWidth='1.5'
												stroke='currentColor'
												data-slot='icon'
												className='h-6 w-6'>
												<path
													strokeLinecap='round'
													strokeLinejoin='round'
													d='M6 18 18 6M6 6l12 12'
												/>
											</svg>
										</Button>
									</div>
								)}
							</div>
							<div key={index} className='mt-2 grid grid-cols-10 gap-1'>

								<div className='col-span-12 lg:col-span-2'>
									<Label htmlFor={`name-${index}`}>
										Name
										<span className='ml-1 text-red-500'>*</span>
									</Label>
									<Input
										id={`name-${index}`}
										name={`name-${index}`}
										value={entry.name}
										onChange={(e) => {
											const updatedEntries = [...entries];
											updatedEntries[index].name = e.target.value;
											setEntries(updatedEntries);
										}}
									/>
									{/* ... Error handling for name field */}
								</div>
								<div className='col-span-12 lg:col-span-2'>
									<Label htmlFor={`hsn-${index}`}>
										HSN
									</Label>
									<Input
										id={`hsn-${index}`}
										name={`hsn-${index}`}
										value={entry.hsn}
										onChange={(e) => {
											const updatedEntries = [...entries];
											updatedEntries[index].hsn = e.target.value;
											setEntries(updatedEntries);
										}}
									/>
									{/* ... Error handling for hsn field */}
								</div>
								<div className='col-span-12 lg:col-span-2'>
									<Label htmlFor={`thickness-${index}`}>
										Thickness
									</Label>
									<Input
										id={`thickness-${index}`}
										name={`thickness-${index}`}
										type='number'
										min={0}
										value={entry.thickness}
										onChange={(e) => {
											const updatedEntries = [...entries];
											updatedEntries[index].thickness = parseFloat(e.target.value) || 0;
											setEntries(updatedEntries);
										}}
									/>
									{/* ... Error handling for thickness field */}
								</div>
								<div className='col-span-12 lg:col-span-2'>
									<Label htmlFor={`length-${index}`}>
										Length
									</Label>
									<Input
										id={`length-${index}`}
										name={`length-${index}`}
										type='number'
										min={0}
										value={entry.length}
										onChange={(e) => {
											const updatedEntries = [...entries];
											updatedEntries[index].length = parseFloat(e.target.value) || 0;
											setEntries(updatedEntries);
										}}
									/>
									{/* ... Error handling for length field */}
								</div>
								<div className='col-span-12 lg:col-span-2'>
									<Label htmlFor={`weight-${index}`}>
										Weight
									</Label>
									<Input
										id={`weight-${index}`}
										name={`weight-${index}`}
										type='number'
										min={0}
										value={entry.weight}
										onChange={(e) => {
											const updatedEntries = [...entries];
											updatedEntries[index].weight = parseFloat(e.target.value) || 0;
											setEntries(updatedEntries);
										}}
									/>
									{/* ... Error handling for weight field */}
								</div>
							</div>
						</>
					))}
					<div className='flex mt-2 gap-2'>
						<Button variant='solid' color='blue' type='button' onClick={handleAddEntry}>
							Add Entry
						</Button>

						<Button variant='solid' color='blue' type='button' onClick={handleSaveEntries}>
							Save Entries
						</Button>
					</div>
				</CardBody>
			</Card>
		</div>
	);
};

export default AddproductForm;
