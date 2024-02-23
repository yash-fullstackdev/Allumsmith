import Card, { CardBody } from '../../../../components/ui/Card';
import Label from '../../../../components/form/Label';
import Select from '../../../../components/form/Select';
import Button from '../../../../components/ui/Button';
import Collapse from '../../../../components/utils/Collapse';
import getUserRights from '../../../../hooks/useUserRights';

const MiscInfo = ({ formik, accordionStates, setAccordionStates, masterSettings }: any) => {
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
								onClick={() =>
									setAccordionStates({
										...accordionStates,
										miscInfo: !accordionStates.miscInfo,
									})
								}
								rightIcon={
									!accordionStates.miscInfo ? 'HeroChevronUp' : 'HeroChevronDown'
								}>
								Misc Information
							</Button>
						</div>
					</div>
					<Collapse isOpen={!accordionStates.miscInfo}>
						<div className='mt-4 grid grid-cols-12 gap-4'>
							<div className='col-span-12 lg:col-span-4'>
								<Label htmlFor='custClass'>
									Customer Class
									<span className='ml-1 text-red-500'>*</span>
								</Label>
								<Select
									id='custClass'
									name='custClass'
									onChange={formik.handleChange}
									onBlur={formik.handleBlur}
									value={formik.values.custClass}
									disabled={!privileges.canWrite()}>
									<option value=''>Select</option>
									{masterSettings.customerClass &&
										masterSettings.customerClass.map((option: string) => (
											<option key={option} value={option}>
												{option}
											</option>
										))}
								</Select>
								{formik.touched.custClass && formik.errors.custClass ? (
									<div className='text-red-500'>{formik.errors.custClass}</div>
								) : null}
							</div>

							<div className='col-span-12 lg:col-span-4'>
								<Label htmlFor='custType'>
									Customer Type
									<span className='ml-1 text-red-500'>*</span>
								</Label>
								<Select
									id='custType'
									name='custType'
									onChange={formik.handleChange}
									onBlur={formik.handleBlur}
									value={formik.values.custType}
									disabled={!privileges.canWrite()}>
									<option value=''>Select</option>
									{masterSettings.customerType &&
										masterSettings.customerType.map((option: string) => (
											<option key={option} value={option}>
												{option}
											</option>
										))}
								</Select>
								{formik.touched.custType && formik.errors.custType ? (
									<div className='text-red-500'>{formik.errors.custType}</div>
								) : null}
							</div>

							<div className='col-span-12 lg:col-span-4'>
								<Label htmlFor='orderSource'>Order Source</Label>
								<Select
									id='orderSource'
									name='orderSource'
									onChange={formik.handleChange}
									onBlur={formik.handleBlur}
									value={formik.values.custType}
									disabled={!privileges.canWrite()}>
									<option value=''>Select</option>
									{masterSettings.orderSource &&
										masterSettings.orderSource.map((option: string) => (
											<option key={option} value={option}>
												{option}
											</option>
										))}
								</Select>
								{formik.touched.orderSource && formik.errors.orderSource ? (
									<div className='text-red-500'>{formik.errors.orderSource}</div>
								) : null}
							</div>

							<div className='col-span-12 lg:col-span-4'>
								<Label htmlFor='salesmanMaintenance'>Salesman</Label>
								<Select
									id='salesmanMaintenance'
									name='salesmanMaintenance'
									onChange={formik.handleChange}
									onBlur={formik.handleBlur}
									value={formik.values.custType}
									disabled={!privileges.canWrite()}>
									<option value=''>Select</option>
									{masterSettings.salesmanMaintenance &&
										masterSettings.salesmanMaintenance.map((option: string) => (
											<option key={option} value={option}>
												{option}
											</option>
										))}
								</Select>
								{formik.touched.salesmanMaintenance &&
								formik.errors.salesmanMaintenance ? (
									<div className='text-red-500'>
										{formik.errors.salesmanMaintenance}
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

export default MiscInfo;
