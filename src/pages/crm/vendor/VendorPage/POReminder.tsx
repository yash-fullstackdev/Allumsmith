import React from 'react';
import Card, { CardBody } from '../../../../components/ui/Card';
import Button from '../../../../components/ui/Button';
import Collapse from '../../../../components/utils/Collapse';
import Label from '../../../../components/form/Label';
import Textarea from '../../../../components/form/Textarea';
import getUserRights from '../../../../hooks/useUserRights';

const POReminder = ({ formik, accordionStates, setAccordionStates }: any) => {
	const privileges = getUserRights('vendors');
	const handleAddReminderClick = () => {
		formik.setValues((prevValues: any) => {
			const newReminders = [...prevValues.poReminders, { spInstruction: '' }];
			return { ...prevValues, poReminders: newReminders };
		});
	};

	const handlePOReminderChange =
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
				formik.setFieldValue(`poReminders[${index}].${fieldName}`, formattedValue);
			};

	const handleDeleteReminder = (index: number) => {
		formik.setValues((prevValues: any) => {
			const newReminders = [...prevValues.poReminders];
			newReminders.splice(index, 1);
			return { ...prevValues, poReminders: newReminders };
		});
	};

	return (
		<Card>
			<CardBody>
				<div className='flex'>
					<div className='bold w-full'>
						<Button
							variant='outlined'
							className='flex w-full items-center justify-between rounded-none border-b text-start text-lg font-bold px-[2px] py-[0px]'
							onClick={() =>
								setAccordionStates({
									...accordionStates,
									POReminder: !accordionStates.POReminder,
								})
							}
							rightIcon={
								!accordionStates.POReminder ? 'HeroChevronUp' : 'HeroChevronDown'
							}>
							PO Reminder
						</Button>
					</div>
				</div>
				<Collapse isOpen={!accordionStates.POReminder}>
					<div className='mt-4 grid grid-cols-6 gap-4'>
						{formik.values.poReminders.map((reminder: any, index: number) => (
							<div className='col-span-12' key={index}>
								<div className='flex items-end justify-end'>
									{formik.values.poReminders.length > 1 && (
										<Button
											type='button'
											onClick={() => handleDeleteReminder(index)}
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
								<div className='grid grid-cols-12 gap-4'>
									<div className='col-span-12'>
										<Label htmlFor={`spInstruction_${index}`}>
											Special Instructions
										</Label>
										<Textarea
											id={`spInstruction_${index}`}
											name={`poReminders[${index}].spInstruction`}
											onChange={handlePOReminderChange(
												index,
												'spInstruction',
											)}
											value={reminder.spInstruction}
											onBlur={formik.handleBlur}
											autoComplete={`spInstruction_${index}`}
											disabled={!privileges.canWrite()}
										/>
									</div>
								</div>
							</div>
						))}
						<Button
							onClick={handleAddReminderClick}
							variant='outline'
							color='zinc'
							size='lg'
							className='w-64'
							isDisable={!privileges.canWrite()}>
							Add PO Reminder
						</Button>
					</div>
				</Collapse>
			</CardBody>
		</Card>
	);
};

export default POReminder;
