import Card, { CardBody } from "../../../../components/ui/Card";
import Button from "../../../../components/ui/Button";
import Collapse from "../../../../components/utils/Collapse";
import Label from "../../../../components/form/Label";
import Select from "../../../../components/form/Select";
import Textarea from "../../../../components/form/Textarea";
import Input from "../../../../components/form/Input";
import getUserRights from "../../../../hooks/useUserRights";
import { handleInputChange } from "../../../../utils/capitalizedFunction.util";
import FieldWrap from "../../../../components/form/FieldWrap";


const Terms = ({ formik, masterSettings, accordionStates, setAccordionStates }: any) => {

	const privileges = getUserRights('vendors');
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
									Terms: !accordionStates.Terms,
								})
							}
							rightIcon={
								!accordionStates.Terms ? 'HeroChevronUp' : 'HeroChevronDown'
							}>
							Terms
						</Button>
					</div>
				</div>
				<Collapse isOpen={!accordionStates.Terms}>
					<div className='mt-4 grid grid-cols-12 gap-4'>
						<div className='col-span-12 lg:col-span-6'>
							<Label htmlFor='terms'>Payment Terms</Label>
							<div className='flex flex-col gap-2'>
								<Select
									id='terms'
									name='terms'
									onChange={formik.handleChange}
									value={formik.values.terms}
									onBlur={formik.handleBlur}
									disabled={!privileges.canWrite()}>
									<option value='' label='Select Terms' />
									{masterSettings.terms &&
										masterSettings.terms.map((option: string) => (
											<option key={option} value={option}>
												{option}
											</option>
										))}
								</Select>
								{formik.touched.terms && formik.errors.terms ? (
									<div className='text-red-500'>{formik.values.terms}</div>
								) : null}
							</div>
						</div>
						<div className='col-span-12 lg:col-span-6'>
							<Label htmlFor='pricingTerms'>Pricing Terms</Label>
							<Select
								id='pricingTerms'
								name='pricingTerms'
								onChange={formik.handleChange}
								value={formik.values.pricingTerms}
								onBlur={formik.handleBlur}
								disabled={!privileges.canWrite()}>
								<option value='' label='Select Pricing Term' />
								{masterSettings.pricingTerms &&
									masterSettings.pricingTerms.map((option: string) => (
										<option key={option} value={option}>
											{option}
										</option>
									))}
							</Select>
							{formik.touched.pricingTerms && formik.errors.pricingTerms ? (
								<div className='text-red-500'>{formik.errors.pricingTerms}</div>
							) : null}
						</div>
						<div className='col-span-12 lg:col-span-12'>
							<Label htmlFor='termsNote'>Terms Notes</Label>
							<Textarea
								id='termsNote'
								name='termsNote'
								onChange={handleInputChange(formik.setFieldValue)('termsNote')}
								value={formik.values.termsNote}
								onBlur={formik.handleBlur}
								autoComplete='termsNote'
								disabled={!privileges.canWrite()}
							/>
						</div>
						<div className='col-span-12 lg:col-span-4'>
							<Label htmlFor='paymentMethod'>Payment Method</Label>
							<Select
								id='paymentMethod'
								name='paymentMethod'
								onChange={formik.handleChange}
								value={formik.values.paymentMethod}
								onBlur={formik.handleBlur}
								disabled={!privileges.canWrite()}>
								<option value='' label='Select Payment Method' />
								{masterSettings.paymentMethod &&
									masterSettings.paymentMethod.map((option: string) => (
										<option key={option} value={option}>
											{option}
										</option>
									))}
							</Select>
							{formik.touched.paymentMethod && formik.errors.paymentMethod ? (
								<div className='text-red-500'>{formik.errors.paymentMethod}</div>
							) : null}
						</div>
						<div className='col-span-12 lg:col-span-4'>
							<Label htmlFor='shippingTerms'>Shipping Terms</Label>
							<Input
								id='shippingTerms'
								name='shippingTerms'
								onChange={handleInputChange(formik.setFieldValue)('shippingTerms')}
								value={formik.values.shippingTerms}
								onBlur={formik.handleBlur}
								disabled={!privileges.canWrite()}
							/>
						</div>
						<div className='col-span-12 lg:col-span-4'>
							<Label htmlFor='freeShippingOrderValue'>Free Shipping OrderValue </Label>
							<FieldWrap
								firstSuffix={<div className="mx-2">$</div>}>
								<Input
									id='freeShippingOrderValue'
									name='freeShippingOrderValue'
									className="pl-7"
									type='number'
									onChange={formik.handleChange}
									value={formik.values.freeShippingOrderValue}
									onBlur={formik.handleBlur}
									disabled={!privileges.canWrite()}
								/>
							</FieldWrap>
						</div>
					</div>
				</Collapse>
			</CardBody>
		</Card>
	);
}

export default Terms
