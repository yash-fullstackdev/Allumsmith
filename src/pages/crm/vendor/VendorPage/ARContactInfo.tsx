import React from 'react';
import Card, { CardBody } from '../../../../components/ui/Card';
import Button from '../../../../components/ui/Button';
import Collapse from '../../../../components/utils/Collapse';
import Label from '../../../../components/form/Label';
import Input from '../../../../components/form/Input';
import Textarea from '../../../../components/form/Textarea';
import getUserRights from '../../../../hooks/useUserRights';

const formatPhoneNumber = (inputNumber: any) => {

    const numericPart = inputNumber.replace(/\D/g, '');

    if (numericPart.length === 0) {
        return '';
    } else if (numericPart.length <= 3) {
        return `(${numericPart}`;
    } else if (numericPart.length <= 6) {
        return `(${numericPart.slice(0, 3)}) ${numericPart.slice(3)}`;
    } else {
        return `(${numericPart.slice(0, 3)}) ${numericPart.slice(3, 6)}-${numericPart.slice(6, 10)}`;
    }
};

const ARContactInfo = ({ formik, accordionStates, setAccordionStates }: any) => {
    const privileges = getUserRights('vendors');
    const {
        ARContacts,
    } = formik.values;

    const handleAddARContactClick = () => {
        formik.setValues((prevValues: any) => {
            const newARContacts = [
                ...prevValues.ARContacts,
                { ARContact: '', ARphoneNumber: '', ARemail: '', ARnotes: '', paymentEmail: '' },
            ];
            return { ...prevValues, ARContacts: newARContacts };
        });
    };

    const handleARContactChange = (index: number, fieldName: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {

        const target = e.target;
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

        formik.handleChange(e);
        formik.setFieldValue(`ARContacts[${index}].${fieldName}`, formattedValue);
    };
    const handleDeleteARContact = (index: any) => {
        formik.setValues((prevValues: any) => {
            const newARContacts = [...prevValues.ARContacts];
            newARContacts.splice(index, 1);
            return { ...prevValues, ARContacts: newARContacts };
        });
    };

    return (
		<Card>
			<CardBody>
				<div className='flex'>
					<div className='bold w-full'>
						<Button
							variant='outlined'
							className='flex w-full items-center justify-between rounded-none border-b px-[2px] py-[0px] text-start text-lg font-bold'
							onClick={() =>
								setAccordionStates({
									...accordionStates,
									ARContactInfo: !accordionStates.ARContactInfo,
								})
							}
							rightIcon={
								!accordionStates.ARContactInfo ? 'HeroChevronUp' : 'HeroChevronDown'
							}>
							A/R Contact Information
						</Button>
					</div>
				</div>
				<Collapse isOpen={!accordionStates.ARContactInfo}>
					<div className='mt-4 grid grid-cols-12 gap-4'>
						{ARContacts.map((arContact: any, index: any) => (
							<div className='col-span-12' key={index}>
								<div className='flex items-end justify-end'>
									{ARContacts.length > 1 && (
										<Button
											type='button'
											onClick={() => handleDeleteARContact(index)}
											variant='outlined'
											color='red'
											isDisable={!privileges.canWrite()}>
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
									<div className='col-span-12 lg:col-span-4'>
										<Label htmlFor={`ARContact_${index}`}>A/R Contact</Label>
										<Input
											id={`ARContact_${index}`}
											name={`ARContacts[${index}].ARContact`}
											onChange={handleARContactChange(index, 'ARContact')}
											value={arContact.ARContact}
											onBlur={formik.handleBlur}
											autoComplete={`ARContact_${index}`}
											disabled={!privileges.canWrite()}
										/>
										{formik.touched.ARContacts?.[index]?.ARContact &&
											formik.errors.ARContacts?.[index]?.ARContact && (
												<div className='text-red-500'>
													{formik.errors.ARContacts[index].ARContact}
												</div>
											)}
									</div>
									<div className='col-span-12 lg:col-span-3'>
										<Label htmlFor={`ARphoneNumber_${index}`}>A/R Phone</Label>
										<Input
											id={`ARphoneNumber_${index}`}
											name={`ARContacts[${index}].ARphoneNumber`}
											onChange={(e) => {
												const formattedNumber = formatPhoneNumber(
													e.target.value,
												);
												formik.handleChange(e);
												formik.setFieldValue(
													`ARContacts[${index}].ARphoneNumber`,
													formattedNumber,
												);
											}}
											value={arContact.ARphoneNumber}
											onBlur={formik.handleBlur}
											disabled={!privileges.canWrite()}
										/>
										{formik.touched.ARContacts?.[index]?.ARphoneNumber &&
											formik.errors.ARContacts?.[index]?.ARphoneNumber && (
												<div className='text-red-500'>
													{formik.errors.ARContacts[index].ARphoneNumber}
												</div>
											)}
									</div>
									<div className='col-span-1 lg:col-span-1'>
										<Label htmlFor={`ARphoneNumberExt_${index}`}>Ext.</Label>
										<Input
											id={`ARphoneNumberExt_${index}`}
											name={`ARContacts[${index}].ARphoneNumberExt`}
											type='number'
											autoComplete={`ARphoneNumberExt_${index}`}
											onChange={handleARContactChange(index, 'ARphoneNumberExt')}
											value={arContact.ARphoneNumberExt}
											onBlur={formik.handleBlur}
											disabled={!privileges.canWrite()}
										/>
									</div>
									<div className='col-span-12 lg:col-span-4'>
										<Label htmlFor={`ARemail_${index}`}>A/R Email</Label>
										<Input
											id={`ARemail_${index}`}
											name={`ARContacts[${index}].ARemail`}
											onChange={handleARContactChange(index, 'ARemail')}
											value={arContact.ARemail}
											onBlur={formik.handleBlur}
											autoComplete={`ARemail_${index}`}
											disabled={!privileges.canWrite()}
										/>
										{formik.touched.ARContacts?.[index]?.ARemail &&
											formik.errors.ARContacts?.[index]?.ARemail && (
												<div className='text-red-500'>
													{formik.errors.ARContacts[index].ARemail}
												</div>
											)}
									</div>
									<div className='col-span-12'>
										<Label htmlFor={`ARnotes_${index}`}>A/R Notes</Label>
										<Textarea
											id={`ARnotes_${index}`}
											name={`ARContacts[${index}].ARnotes`}
											onChange={handleARContactChange(index, 'ARnotes')}
											value={arContact.ARnotes}
											onBlur={formik.handleBlur}
											autoComplete={`ARnotes_${index}`}
											disabled={!privileges.canWrite()}
										/>
									</div>
									<div className='col-span-12 lg:col-span-4'>
										<Label htmlFor={`paymentEmail_${index}`}>
											Payment Email
										</Label>
										<Input
											id={`paymentEmail_${index}`}
											name={`ARContacts[${index}].paymentEmail`}
											onChange={handleARContactChange(index, 'paymentEmail')}
											value={arContact.paymentEmail}
											onBlur={formik.handleBlur}
											autoComplete={`paymentEmail_${index}`}
											disabled={!privileges.canWrite()}
										/>
										{formik.touched.ARContacts?.[index]?.paymentEmail &&
											formik.errors.ARContacts?.[index]?.paymentEmail && (
												<div className='text-red-500'>
													{formik.errors.ARContacts[index].paymentEmail}
												</div>
											)}
									</div>
								</div>
							</div>
						))}
						<Button
							onClick={handleAddARContactClick}
							variant='outline'
							color='zinc'
							size='lg'
							className='w-64'
							isDisable={!privileges.canWrite()}>
							Add A/R Contact
						</Button>
					</div>
				</Collapse>
			</CardBody>
		</Card>
	);
};

export default ARContactInfo;
