import Card, { CardBody } from '../../../../components/ui/Card';
import Button from '../../../../components/ui/Button';
import Collapse from '../../../../components/utils/Collapse';
import Label from '../../../../components/form/Label';
import Input from '../../../../components/form/Input';
import getUserRights from '../../../../hooks/useUserRights';
import React from 'react';

const SalesRepInfo = ({ formik, accordionStates, setAccordionStates }: any) => {
	const privileges = getUserRights('vendors');
	const formatPhoneNumber = (inputNumber: string) => {
		const numericPart = inputNumber.replace(/\D/g, '');

		if (numericPart.length === 0) {
			return '';
		} else if (numericPart.length <= 3) {
			return `(${numericPart}`;
		} else if (numericPart.length <= 6) {
			return `(${numericPart.slice(0, 3)}) ${numericPart.slice(3)}`;
		} else {
			return `(${numericPart.slice(0, 3)}) ${numericPart.slice(3, 6)}-${numericPart.slice(
				6,
				10,
			)}`;
		}
	};
	const addNewSalesRep = () => {
		formik.setValues((prevValues: any) => {
			const newRep = [
				...prevValues.salesRep,
				{ salesRepName: '', salesRepEmail: '', salesRepPhone: '' },
			];
			return { ...prevValues, salesRep: newRep };
		});
		console.log(formik.values);
	};
	const removeSalesRep = (index: number) => {
		formik.setValues((prevValues: any) => {
			const salesRepresentative = [...prevValues.salesRep];
			salesRepresentative.splice(index, 1);
			return { ...prevValues, salesRep: salesRepresentative };
		});
	};
	const validatelatestRep = (): boolean => {
		const latestRepValues = formik.values.salesRep[formik.values.salesRep.length - 1];
		if (
			latestRepValues?.salesRepName &&
			latestRepValues?.salesRepEmail &&
			latestRepValues?.salesRepPhone &&
			privileges.canWrite()
		) {
			return false;
		}
		return true;
	};

	const handleSalesRepChange =
		(index: number, fieldName: string) =>
		(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
			const target = e.target;
			const inputValue = target.value;
			const cursorPosition = target.selectionStart || 0;

			let formattedValue = inputValue.toUpperCase(); // Capitalize the entire value

			// Use a ref to store and retrieve the cursor position
			const cursorPositionRef: any = React.createRef<
				HTMLTextAreaElement | HTMLInputElement
			>();
			cursorPositionRef.current = target;

			// Schedule a microtask to set the cursor position after the re-render
			Promise.resolve().then(() => {
				if (cursorPositionRef.current !== undefined) {
					cursorPositionRef.current.setSelectionRange(cursorPosition, cursorPosition);
				}
			});
			formik.handleChange(e);
			formik.setFieldValue(`salesRep[${index}].${fieldName}`, formattedValue);
		};

	return (
		<Card>
			<CardBody>
				<div className='flex'>
					<div className='bold w-full grow'>
						<Button
							variant='outlined'
							className='flex w-full items-center justify-between rounded-none border-b px-[2px] py-[0px] text-start text-lg font-bold'
							onClick={() =>
								setAccordionStates({
									...accordionStates,
									salesRepresentative: !accordionStates.salesRepresentative,
								})
							}
							rightIcon={
								!accordionStates.salesRepresentative
									? 'HeroChevronUp'
									: 'HeroChevronDown'
							}>
							Sales Rep Information
						</Button>
					</div>
				</div>
				<Collapse isOpen={!accordionStates.salesRepresentative}>
					<div className='mt-4 grid grid-cols-12 gap-4'>
						<div className='col-span-12 lg:col-span-12'>
							{formik.values.salesRep.map((rep: any, index: any) => (
								<div className='mt-2' key={index}>
									<div className='flex items-end justify-end'>
										{formik.values.salesRep.length > 1 && (
											<Button
												type='button'
												onClick={() => removeSalesRep(index)}
												variant='outlined'
												color='red'>
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
										)}
									</div>
									<div key={index} className='grid grid-cols-12 gap-4'>
										<div className='col-span-12 lg:col-span-4'>
											<Label htmlFor={`salesRepName_${index}`}>
												Sales Rep Name
											</Label>
											<Input
												id={`salesRepName_${index}`}
												name={`salesRep[${index}].salesRepName`}
												onChange={handleSalesRepChange(
													index,
													'salesRepName',
												)}
												value={rep.salesRepName}
												autoComplete={`salesRepName_${index}`}
												onBlur={formik.handleBlur}
												disabled={!privileges.canWrite()}
											/>

											{formik.touched.salesRep?.[index]?.salesRepName &&
											formik.errors.salesRep?.[index]?.salesRepName ? (
												<div className='text-red-500'>
													{formik.errors.salesRep[index].salesRepName}
												</div>
											) : null}
										</div>
										<div className='col-span-12 lg:col-span-3'>
											<Label htmlFor={`salesRepPhone_${index}`}>
												Sales Rep Phone
											</Label>
											<Input
												id={`salesRepPhone_${index}`}
												name={`salesRep[${index}].salesRepPhone`}
												onChange={(e) => {
													const formattedPhoneNumber = formatPhoneNumber(
														e.target.value,
													);
													formik.handleChange(e);
													formik.setFieldValue(
														`salesRep[${index}].salesRepPhone`,
														formattedPhoneNumber,
													);
												}}
												value={rep.salesRepPhone}
												autoComplete={`salesRepPhone_${index}`}
												onBlur={formik.handleBlur}
												disabled={!privileges.canWrite()}
											/>
											{formik.touched.salesRep?.[index]?.salesRepPhone &&
											formik.errors.salesRep?.[index]?.salesRepPhone ? (
												<div className='text-red-500'>
													{formik.errors.salesRep[index].salesRepPhone}
												</div>
											) : null}
										</div>
										<div className='col-span-1 lg:col-span-1'>
											<Label htmlFor={`salesRepPhoneExt_${index}`}>
												Ext.
											</Label>
											<Input
												id={`salesRepPhoneExt_${index}`}
												name={`salesRep[${index}].salesRepPhoneExt`}
												type='number'
												autoComplete={`salesRepPhoneExt_${index}`}
												onChange={handleSalesRepChange(
													index,
													'salesRepPhoneExt',
												)}
												value={rep.salesRepPhoneExt}
												onBlur={formik.handleBlur}
												disabled={!privileges.canWrite()}
											/>
										</div>
										<div className='col-span-12 lg:col-span-4'>
											<Label htmlFor={`salesRepEmail_${index}`}>
												Sales Rep Email
											</Label>
											<Input
												id={`salesRepEmail_${index}`}
												name={`salesRep[${index}].salesRepEmail`}
												onChange={handleSalesRepChange(
													index,
													'salesRepEmail',
												)}
												value={rep.salesRepEmail}
												autoComplete={`salesRepEmail_${index}`}
												onBlur={formik.handleBlur}
												disabled={!privileges.canWrite()}
											/>
											{formik.touched.salesRep?.[index]?.salesRepEmail &&
											formik.errors.salesRep?.[index]?.salesRepEmail ? (
												<div className='text-red-500'>
													{formik.errors.salesRep[index].salesRepEmail}
												</div>
											) : null}
										</div>
									</div>
								</div>
							))}
							<Button
								onClick={addNewSalesRep}
								variant='outline'
								color='zinc'
								size='lg'
								isDisable={!privileges.canWrite()}
								className='mt-4 w-64'>
								Add Sales Rep
							</Button>
						</div>
					</div>
				</Collapse>
			</CardBody>
		</Card>
	);
};

export default SalesRepInfo;
