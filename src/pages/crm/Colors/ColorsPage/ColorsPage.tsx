import { useNavigate } from 'react-router-dom';
import Button from '../../../../components/ui/Button';
import Card, { CardBody } from '../../../../components/ui/Card';
import { PathRoutes } from '../../../../utils/routes/enum';
import { post } from '../../../../utils/api-helper.util';
import { toast } from 'react-toastify';
import { useFormik } from 'formik';
import ColorForm from '../../../../components/PageComponets/ColorForm/ColorForm';
import { colorsSchema } from '../../../../utils/formValidations';
import { Container, PageWrapper, Subheader, SubheaderLeft, SubheaderSeparator } from '../../../../components/layouts';

const ColorsPage = () => {
	const navigate = useNavigate();
	const formik: any = useFormik({
		initialValues: {
			entries: [{ name: '', code: '' }],
			type: 'coating',
		},
		validationSchema: colorsSchema,
		onSubmit: async (values) => {
			try {
				const promises = values.entries.map(async (entry: any) => {
					const { data } = await post('/colors', { ...entry, type: values?.type });
					return data;
				});
				const results = await Promise.all(promises);
				toast.success('Colors added Successfully!');
				navigate(PathRoutes.colors);
			} catch (error: any) {
				console.error('Error Adding Color', error);
				toast.error('Error Adding Colors', error);
			}
		},
	});

	const handleAddEntry = () => {
		formik.setFieldValue('entries', [...formik.values.entries, { name: '', code: '' }]);
	};

	return (
		<PageWrapper name='ADD Colors' isProtectedRoute={true}>
			<Subheader>
				<SubheaderLeft>
					<Button
						icon='HeroArrowLeft'
						className='!px-0'
						onClick={() => navigate(`${PathRoutes.colors}`)}>
						{`${window.innerWidth > 425 ? 'Back to List' : ''}`}
					</Button>
					<SubheaderSeparator />
				</SubheaderLeft>
			</Subheader>
			<Container className='flex shrink-0 grow basis-auto flex-col pb-0'>
				<Card>
					<CardBody>
						<div className='flex w-full items-center justify-between rounded-none border-b px-[2px] py-[0px] text-start text-lg font-bold'>
							Add Color
						</div>
						<ColorForm formik={formik} />
						<div className='mt-2 flex gap-2'>
							<Button
								variant='solid'
								color='blue'
								type='button'
								icon='HeroPlus'
								onClick={handleAddEntry}>
								Add Entry
							</Button>
							<Button
								variant='solid'
								color='blue'
								isLoading={formik?.isSubmitting}
								isDisable={formik?.isSubmitting}
								onClick={formik.handleSubmit}>
								Save Entries
							</Button>
						</div>
					</CardBody>
				</Card>
			</Container>
		</PageWrapper>
	);
};

export default ColorsPage;
