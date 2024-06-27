import Button from "../../ui/Button";
import Label from "../../form/Label";
import Input from "../../form/Input";

type props = {
  formik: any,
};
const ProductForm = ({ formik }: props) => {
  
	const handleDeleteProduct = (index: any) => {
		const newEntries = [...formik.values.entries];
		newEntries.splice(index, 1);
		formik.setFieldValue('entries', newEntries);
	};

  return (
    <form>
      	{formik.values.entries.map((entry: any, index: any) => (
						<div className="relative py-5" key={index}>
							<div className='flex items-end justify-end mt-3 absolute right-0 top-[5px]'>
								{formik.values.entries.length > 1 && (
									<div className='flex items-end justify-end'>
										<Button type='button' onClick={() => handleDeleteProduct(index)} variant='outlined' color='red' icon='HeroXMark' />
									</div>
								)}
							</div>
							<div className='mt-2 grid grid-cols-12 gap-3'>
								<div className='col-span-12 lg:col-span-4'>
									<Label htmlFor={`name-${index}`}>
										Name <span className='text-red-500'>*</span>
									</Label>
									<Input
										type='text'
										id={`name-${index}`}

										name={`entries[${index}].name`}
										value={entry.name}
										onBlur={formik.handleBlur}
										onChange={(e:any) => {
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
									<Label htmlFor={`hsn-${index}`}>
										HSN
                    <span className='text-red-500'>*</span>
									</Label>
									<Input
										id={`hsn-${index}`}
										name={`entries[${index}].hsn`}
										value={entry.hsn}
										onBlur={formik.handleBlur}
										onChange={(e:any) => {
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
								<div className='col-span-12 lg:col-span-4'>
									<Label htmlFor={`productCode-${index}`}>
										Product Code <span className='text-red-500'>*</span>
									</Label>
									<Input
										id={`productCode-${index}`}
										name={`entries[${index}].productCode`}
										value={entry?.productCode}
										onBlur={formik.handleBlur}
										onChange={(e:any) => {
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
										onChange={(e:any) => {
											const newEntries = [...formik.values.entries];
											newEntries[index].thickness = e.target.value;
											formik.setFieldValue('entries', newEntries);
										}}
									/>
									{
										formik.touched.entries?.[index]?.thickness &&
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
										onChange={(e:any) => {
											const newEntries = [...formik.values.entries];
											newEntries[index].length = e.target.value;
											formik.setFieldValue('entries', newEntries);
										}}
									/>
									{
										formik.touched.entries?.[index]?.length &&
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
										onChange={(e:any) => {
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
								</div>
								<div className='col-span-12 lg:col-span-3'>
									<Label htmlFor={`rate-${index}`}>
										Wooden Coating Rate(rs)
									</Label>
									<Input
										id={`wooden_rate-${index}`}
										name={`entries[${index}].wooden_rate`}
										type='number'
										value={entry.wooden_rate}
										onBlur={formik.handleBlur}
										min={0}
										onChange={(e:any) => {
											const newEntries = [...formik.values.entries];
											newEntries[index].wooden_rate = e.target.value;
											formik.setFieldValue('entries', newEntries);
										}}
									/>
									{
										formik.touched.entries?.[index]?.wooden_rate &&
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
										onChange={(e:any) => {
											const newEntries = [...formik.values.entries];
											newEntries[index].commercial_rate = e.target.value;
											formik.setFieldValue('entries', newEntries);
										}}
									/>
									{
										formik.touched.entries?.[index]?.commercial_rate &&
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
										onChange={(e:any) => {
											const newEntries = [...formik.values.entries];
											newEntries[index].anodize_rate = e.target.value;
											formik.setFieldValue('entries', newEntries);
										}}
									/>
									{
										formik.touched.entries?.[index]?.anodize_rate &&
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
										onChange={(e:any) => {
											const newEntries = [...formik.values.entries];
											newEntries[index].premium_rate = e.target.value;
											formik.setFieldValue('entries', newEntries);
										}}
									/>
									{
										formik.touched.entries?.[index]?.premium_rate &&
											formik.errors.entries?.[index]?.premium_rate ? (
											<div className='text-red-500'>
												{formik.errors.entries[index].premium_rate}
											</div>
										) : null}
								</div>
							</div>
						</div>
					))}
    </form>
  )
}

export default ProductForm