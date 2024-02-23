import Card, { CardBody } from '../../../../components/ui/Card';
import Label from '../../../../components/form/Label';
import Input from '../../../../components/form/Input';
import Select from '../../../../components/form/Select';
import Collapse from '../../../../components/utils/Collapse';
import Button from '../../../../components/ui/Button';
import getUserRights from '../../../../hooks/useUserRights';
import FieldWrap from '../../../../components/form/FieldWrap';

const CreditInfo = ({ formik, accordionStates, setAccordionStates }: any) => {
	const privileges = getUserRights('customers');
	return (
		<div className='col-span-12 flex flex-col gap-4 xl:col-span-6'>
			<Card>
				<CardBody>
					<div className='flex'>
						<div className='grow'>
							<Button
								variant='outlined'
								className='flex w-full items-center justify-between rounded-none border-b text-lg font-bold px-[2px] py-[0px]'
								onClick={() => setAccordionStates({ ...accordionStates, creditInfo: !accordionStates.creditInfo })}
								rightIcon={!accordionStates.creditInfo ? 'HeroChevronUp' : 'HeroChevronDown'}>
								Credit Information
							</Button>
						</div>
					</div>
					<Collapse isOpen={!accordionStates.creditInfo}>
						<div className='mt-4 grid grid-cols-12 gap-4'>
							<div className='col-span-12 lg:col-span-4'>
								<Label htmlFor='creditLimit'>
									Credit Limit
									<span className='ml-1 text-red-500'>*</span>
								</Label>
								<FieldWrap
									firstSuffix={<div className='mx-2'>$</div>}>
									<Input
										id='creditLimit'
										name='creditLimit'
										className='px-6'
										type='number'
										onChange={formik.handleChange}
										value={formik.values.creditLimit}
										onBlur={formik.handleBlur}
										disabled={!privileges.canWrite()}
									/>
								</FieldWrap>
								{formik.touched.creditLimit && formik.errors.creditLimit ? (
									<div className='text-red-500'>{formik.errors.creditLimit}</div>
								) : null}
							</div>

							<div className='col-span-12 lg:col-span-4'>
								<Label htmlFor='creditHold'>
									Credit HOLD
									<span className='ml-1 text-red-500'>*</span>
								</Label>
								<Select
									id='creditHold'
									name='creditHold'
									onChange={formik.handleChange}
									onBlur={formik.handleBlur}
									value={formik.values.creditHold}
									disabled={!privileges.canWrite()}
								>
									<option value=''>Select</option>
									<option value='YES'>YES</option>
									<option value='NO'>NO</option>
								</Select>
								{formik.touched.creditHold && formik.errors.creditHold ? (
									<div className='text-red-500'>{formik.errors.creditHold}</div>
								) : null}
							</div>

							<div className='col-span-12 lg:col-span-4'>
								<Label htmlFor='acceptBO'>
									Accept B/O
									<span className='ml-1 text-red-500'>*</span>
								</Label>
								<Select
									id='acceptBO'
									name='acceptBO'
									onChange={formik.handleChange}
									onBlur={formik.handleBlur}
									value={formik.values.acceptBO}
									disabled={!privileges.canWrite()}
								>
									<option value=''>Select</option>
									<option value='YES'>YES</option>
									<option value='NO'>NO</option>
								</Select>
								{formik.touched.acceptBO && formik.errors.acceptBO ? (
									<div className='text-red-500'>{formik.errors.acceptBO}</div>
								) : null}
							</div>

							<div className='col-span-12 lg:col-span-4'>
								<Label htmlFor='acceptPartialOrder'>
									Accept Partial Order
									<span className='ml-1 text-red-500'>*</span>
								</Label>
								<Select
									id='acceptPartialOrder'
									name='acceptPartialOrder'
									onChange={formik.handleChange}
									onBlur={formik.handleBlur}
									value={formik.values.acceptPartialOrder}
									disabled={!privileges.canWrite()}
								>
									<option value=''>Select</option>
									<option value='YES'>YES</option>
									<option value='NO'>NO</option>
								</Select>
								{formik.touched.acceptPartialOrder &&
									formik.errors.acceptPartialOrder ? (
									<div className='text-red-500'>
										{formik.errors.acceptPartialOrder}
									</div>
								) : null}
							</div>
						</div>
					</Collapse>
				</CardBody>
			</Card>
		</div>
	);
};

export default CreditInfo;
