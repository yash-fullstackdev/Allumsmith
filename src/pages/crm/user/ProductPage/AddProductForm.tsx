
import { useNavigate } from 'react-router-dom';
import { productsSchema } from '../../../../utils/formValidations';
import { useFormik } from 'formik';
import { toast } from 'react-toastify';
import { post } from '../../../../utils/api-helper.util';
import { PathRoutes } from '../../../../utils/routes/enum';
import Card, { CardBody } from '../../../../components/ui/Card';
import Button from '../../../../components/ui/Button';

import ProductForm from '../../../../components/PageComponets/ProductForm/ProductForm';

const initialValues = {
	entries: [{
		name: '',
		hsn: '',
		rate: '',
		productCode: '',
		thickness: '',
		length: '',
		weight: '',
		premium_rate: '',
		wooden_rate: '',
		commercial_rate: '',
		anodize_rate: ''
	}],
}


const AddproductForm = () => {
	const navigate = useNavigate();
	// const [dropDownValues, setDropDownValues] = useState<any>({});

	// const getDropDownValues = async () => {
	// 	try {
	// 		const dropDownData = await get('/products/getDistinctValues');
	// 		setDropDownValues(dropDownData.data || { thickness: [], length: [], weight: [] });
	// 	} catch (error) {
	// 		console.log("Error", error);
	// 	}
	// }
	// useEffect(() => {
	// 	getDropDownValues();
	// }, [])

	const handleAddEntry = () => {
		const { entries } = formik.values;
		const lastEntry = entries[entries.length - 1];
		const { name, hsn, rate, thickness, length, weight } = lastEntry;

		console.log("lastEntry", lastEntry)

		formik.setFieldValue('entries', [
			...entries,
			{
				name,
				hsn,
				rate,
				productCode: null,
				thickness,
				length,
				weight
			}
		]);
	};
	const formik: any = useFormik({
		initialValues,
		validationSchema: productsSchema,
		onSubmit: async (value) => {
			try {
				const promises = value.entries.map(async (entry: any) => {
					const { data } = await post("/products", entry);
					return data;
				});
				const results = await Promise.all(promises);
				toast.success("Product added Successfully!")
				navigate(PathRoutes.product)
			} catch (error: any) {
				console.error("Error Adding Product", error);
				toast.error("Error Adding Products", error);
			}
		},
	});

	return (
		<div className='col-span-12 flex flex-col gap-1 xl:col-span-6 m-5'>
			<Card>
				<CardBody>
					<div
						className='flex w-full items-center justify-between rounded-none border-b px-[2px] py-[0px] text-start text-lg font-bold'
					>
						Add Products
					</div>
					<ProductForm formik={formik} />
					<div className='flex mt-2 gap-2'>
						<Button variant='solid' color='blue' type='button' onClick={handleAddEntry}>
							Add Entry
						</Button>
						<Button variant='solid' color='blue' type='submit' onClick={formik.handleSubmit}>
							Save Entries
						</Button>
					</div>
				</CardBody>
			</Card>
		</div>
	);
};

export default AddproductForm;
