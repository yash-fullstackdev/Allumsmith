import Input from '../../../../components/form/Input';
import Label from '../../../../components/form/Label';
import Button from '../../../../components/ui/Button';
import Card, { CardBody } from '../../../../components/ui/Card';
import Collapse from '../../../../components/utils/Collapse';
import getUserRights from '../../../../hooks/useUserRights';
import { handleInputChange } from '../../../../utils/capitalizedFunction.util';

const POOrderEmail = ({ formik, accordionStates, setAccordionStates }: any) => {
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
									POOrderEmail: !accordionStates.POOrderEmail,
								})
							}
							rightIcon={
								!accordionStates.POOrderEmail ? 'HeroChevronUp' : 'HeroChevronDown'
							}>
							PO Contact
						</Button>
					</div>
				</div>
				<Collapse isOpen={!accordionStates.POOrderEmail}>
					<div className='mt-4 grid grid-cols-12 gap-4'>
						<div className='col-span-12 lg:col-span-4'>
							<Label htmlFor='poContact'>PO Contact</Label>
							<Input
								id='poContact'
								name='poContact'
								onChange={handleInputChange(formik.setFieldValue)('poContact')}
								value={formik.values.poContact}
								onBlur={formik.handleBlur}
								disabled={!privileges.canWrite()}
							/>
							{formik.touched.poContact && formik.errors.poContact ? (
								<div className='text-red-500'>{formik.errors.poContact}</div>
							) : null}
						</div>
						<div className='col-span-12 lg:col-span-3'>
							<Label htmlFor='pophoneNumber'>Phone</Label>
							<Input
								id='pophoneNumber'
								name='pophoneNumber'
								maxLength={14}
								onChange={(e) => {
									const formattedNumber = formatPhoneNumber(e.target.value);
									formik.handleChange(e);
									formik.setFieldValue('pophoneNumber', formattedNumber);
								}}
								value={formik.values.pophoneNumber}
								onBlur={formik.handleBlur}
								required
								disabled={!privileges.canWrite()}
							/>
							{formik.touched.pophoneNumber && formik.errors.pophoneNumber ? (
								<div className='text-red-500'>{formik.errors.pophoneNumber}</div>
							) : null}
						</div>
						<div className='col-span-1 lg:col-span-1'>
							<Label htmlFor='pophoneNumberExt'>Ext.</Label>
							<Input
								id='pophoneNumberExt'
								name='pophoneNumberExt'
								type='number'
								onChange={formik.handleChange}
								value={formik.values.pophoneNumberExt}
								onBlur={formik.handleBlur}
								disabled={!privileges.canWrite()}
							/>
						</div>
						<div className='col-span-12 lg:col-span-4'>
							<Label htmlFor='POEmail'>PO Order Email</Label>
							<Input
								id='POEmail'
								name='POEmail'
								onChange={handleInputChange(formik.setFieldValue)('POEmail')}
								value={formik.values.POEmail}
								onBlur={formik.handleBlur}
								disabled={!privileges.canWrite()}
							/>
							{formik.touched.POEmail && formik.errors.POEmail ? (
								<div className='text-red-500'>{formik.errors.POEmail}</div>
							) : null}
						</div>
					</div>
				</Collapse>
			</CardBody>
		</Card>
	);
};

export default POOrderEmail;
