import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { get, put } from '../../../../utils/api-helper.util';
import { PathRoutes } from '../../../../utils/routes/enum';
import { toast } from 'react-toastify';
import { useFormik } from 'formik';
import { CoatingSchema } from '../../../../utils/formValidations';
import CoatingForm from '../../../../components/PageComponets/CoatingForm/CoatingForm';
import { Container, PageWrapper, Subheader, SubheaderLeft, SubheaderSeparator } from '../../../../components/layouts';
import { Button, Card, CardBody } from '../../../../components/ui';

interface ColorOption {
	value: any;
	label: any;
}

const EditCoatingPage = () => {
	const navigate = useNavigate();
	const initialValues = {
		name: '',
		code: '',
		colors: [],
		type: '',
	};

	const formik: any = useFormik({
		initialValues,
		validationSchema: CoatingSchema,
		onSubmit: async (value) => {
			try {
				const editedBranch = await put(`/coatings/${id}`, value);
				console.log('edited Coating', editedBranch);
				toast.success('Coating edited Successfully!');
			} catch (error: any) {
				console.error('Error updatin Coating', error);
				toast.error(error.response.data.message, error);
			} finally {
				navigate(PathRoutes.coating);
			}
		},
	});

	const { id } = useParams();
	const fetchCoatingById = async () => {
		try {
			const coatingData = await get(`/coatings/${id}`);
			const { name, code, rate, colors, type } = coatingData.data;
			formik.setValues({ name, code, rate, colors, type });
			console.log(
				'🚀 ~ fetchCoatingById ~ type === coatingData.data.type:',
				type === 'coating',
			);
		} catch (error) {
			console.error('Error fetching Coatin Data:', error);
		}
	};

	useEffect(() => {
		fetchCoatingById();
	}, []);

	return (
		<>
			<PageWrapper name='Edit Color' isProtectedRoute={true}>
				<Subheader>
					<SubheaderLeft>
						<Button
							icon='HeroArrowLeft'
							className='!px-0'
							onClick={() => navigate(`${PathRoutes.coating}`)}>
							{`${window.innerWidth > 425 ? 'Back to List' : ''}`}
						</Button>
						<SubheaderSeparator />
					</SubheaderLeft>
				</Subheader>
				<Container className='flex shrink-0 grow basis-auto flex-col '>
					<Card>
						<CardBody>
							<CoatingForm formik={formik} />
							<div className='mt-4 flex gap-2'>
								<Button
									variant='solid'
									color='blue'
									type='button'
									isLoading={formik?.isSubmitting}
									isDisable={formik?.isSubmitting}
									onClick={formik.handleSubmit}>
									Update Coating Data
								</Button>
							</div>
						</CardBody>
					</Card>
				</Container>
			</PageWrapper>
		</>
	);
};
export default EditCoatingPage;
