import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { get, post, put } from '../../../../utils/api-helper.util';
import { PathRoutes } from '../../../../utils/routes/enum';
import Card, { CardBody } from '../../../../components/ui/Card';
import Button from '../../../../components/ui/Button';
import PageWrapper from '../../../../components/layouts/PageWrapper/PageWrapper';
import Container from '../../../../components/layouts/Container/Container';
import { toast } from 'react-toastify';
import Subheader, {
	SubheaderLeft,
	SubheaderSeparator,
} from '../../../../components/layouts/Subheader/Subheader';
import { useFormik } from 'formik';
import ColorForm from '../../../../components/PageComponets/ColorForm/ColorForm';
import { colorsSchema } from '../../../../utils/formValidations';

const EditColorPage = () => {
	const navigate = useNavigate();
	const { id } = useParams();
	const fetchColorById = async () => {
		try {
			const { data } = await get(`/colors/${id}`);
			formik.setValues({ entries: [{ name: data.name, code: data.code }], type: data.type });
		} catch (error) {
			console.error('Error fetching Color Data:', error);
		}
	};

	useEffect(() => {
		fetchColorById();
	}, []);
	const formik: any = useFormik({
		initialValues: {
			entries: [{ name: '', code: '' }],
			type: '',
		},
		validationSchema: colorsSchema,
		onSubmit: async (values) => {
			try {
				const payload = {
					...values.entries[0],
					type: values?.type,
				};
				const editedBranch = await put(`/colors/${id}`, payload);
				console.log('edited Branch', editedBranch);
				toast.success('Color edited Successfully!');
				navigate(PathRoutes.colors);
			} catch (error: any) {
				toast.error('Error updating Color', error);
			}
		},
	});

	return (
		<PageWrapper name='Edit Color' isProtectedRoute={true}>
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
			<Container className='flex shrink-0 grow basis-auto flex-col '>
				<Card>
					<CardBody>
						<ColorForm formik={formik} />
						<div className='mt-4 flex gap-2'>
							<Button
								variant='solid'
								color='blue'
								type='button'
								isLoading={formik?.isSubmitting}
								isDisable={formik?.isSubmitting}
								onClick={formik.handleSubmit}>
								Update Color
							</Button>
						</div>
					</CardBody>
				</Card>
			</Container>
		</PageWrapper>
	);
};
export default EditColorPage;
