import { get, post } from '../../../../utils/api-helper.util';
import Card, { CardBody } from '../../../../components/ui/Card';
import Button from '../../../../components/ui/Button';
import Label from '../../../../components/form/Label';
import Input from '../../../../components/form/Input';
import { toast } from 'react-toastify';
import { AddRawMaterialSchema } from '../../../../utils/formValidations';
import { useFormik } from 'formik';
import ErrorMessage from '../../../../components/form/ErrorMessage';
import { useEffect, useState } from 'react';
import Select from '../../../../components/form/Select';

const AddPowderModal = ({ SetAddPowderModal, getPowderList }: any) => {
	const [branchData, setBranchData] = useState<any>([]);

	const getBranchDetails = async () => {
		try {
			const { data } = await get('/branches');
			setBranchData(data);
		} catch (error) {
			console.error('Error Fetching Branch', error);
		}
	};

	useEffect(() => {
		getBranchDetails();
	}, []);

	const formik: any = useFormik({
		initialValues: {
			name: '',
			code: '',
			branch: '',
			quantity: '',
		},
		validationSchema: AddRawMaterialSchema,
		onSubmit: async (values) => {
			try {
				await post('/utilities', values);
				toast.success('Powder added Successfully!');
				SetAddPowderModal(false);
			} catch (error: any) {
				console.error('Error Saving Powder', error);
				toast.error('Error Saving Powder', error);
			} finally {
				getPowderList();
			}
		},
	});

	return (
		<Card>
			<CardBody>
				<div className='mt-2 grid grid-cols-12 gap-1'>
					<div className='col-span-12 lg:col-span-6'>
						<Label htmlFor='name' require={true}>
							Name
						</Label>
						<Input
							id='name'
							name='name'
							value={formik.values.name}
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
						/>
						<ErrorMessage
							touched={formik.touched}
							errors={formik.errors}
							fieldName={`name`}
						/>
					</div>
					<div className='col-span-12 lg:col-span-6'>
						<Label htmlFor='code' require={true}>
							Code
						</Label>
						<Input
							id='name'
							name='code'
							value={formik.values.code}
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
						/>
						<ErrorMessage
							touched={formik.touched}
							errors={formik.errors}
							fieldName={`code`}
						/>
					</div>
					<div className='col-span-12 lg:col-span-6'>
						<Label htmlFor='branch' require={true}>
							Branch
						</Label>
						<Select
							id={`branch`}
							name={`branch`}
							value={formik.values.branch}
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}>
							<option value=''>Select Branch</option>
							{branchData.map((branch: any) => (
								<option key={branch._id} value={branch._id}>
									{branch.name}
								</option>
							))}
						</Select>
						<ErrorMessage
							touched={formik.touched}
							errors={formik.errors}
							fieldName={`branch`}
						/>
					</div>
					<div className='col-span-12 lg:col-span-6'>
						<Label htmlFor='quantity' require={true}>
							Quantity(kg)
						</Label>
						<Input
							type='number'
							id={`quantity`}
							name={`quantity`}
							value={formik.values.quantity}
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
						/>
						<ErrorMessage
							touched={formik.touched}
							errors={formik.errors}
							fieldName={`quantity`}
						/>
					</div>
					<div className='col-span-12 lg:col-span-12'>
						<div className='mt-2 flex gap-2 '>
							<Button
								variant='solid'
								color='blue'
								isLoading={formik?.isSubmitting}
								isDisable={formik?.isSubmitting}
								type='button'
								onClick={formik.handleSubmit}>
								Save Entries
							</Button>
						</div>
					</div>
				</div>
			</CardBody>
		</Card>
	);
};

export default AddPowderModal;
