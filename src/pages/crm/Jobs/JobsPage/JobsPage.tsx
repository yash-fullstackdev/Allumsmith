import React, { useState } from 'react';
import { get, post } from '../../../../utils/api-helper.util';
import Button from '../../../../components/ui/Button';
import Label from '../../../../components/form/Label';

import { useNavigate } from 'react-router-dom';
import { PathRoutes } from '../../../../utils/routes/enum';
import Container from '../../../../components/layouts/Container/Container';
import PageWrapper from '../../../../components/layouts/PageWrapper/PageWrapper';
import Subheader, { SubheaderLeft, SubheaderRight, SubheaderSeparator } from '../../../../components/layouts/Subheader/Subheader';

import { Switch } from '@mui/material';
import WithoutMaterialPage from './WithoutMaterialPage';
import JobForm from '../../../../components/PageComponets/JobForm/JobForm';
import { useFormik } from 'formik';
import ReviewJobProcess from './ReviewJobProcess';
import { jobWithMaterialSchema } from '../../../../utils/formValidations';


const JobsPage = () => {
    const navigate = useNavigate();
    const [quantityStatusModal, setQuantityStatusModal] = useState<boolean>(false);
    const [withMaterial, setWithMaterial] = useState<boolean>(true);

    const formik: any = useFormik({
        initialValues: {
            name: "",
            branch: "",
            batch: [{
                co_id: '',
                products: [{}]
            }],
            self_products: [{}],

        },
        validationSchema: jobWithMaterialSchema,
        onSubmit: async () => {
            const coProducts = formik?.values?.batch?.length ? formik?.values?.batch?.flatMap((item: any) => item?.products?.length ? item?.products?.map((product: any) => product?.product?._id) : null) : null;
            const selfProdduct = formik?.values?.self_products?.length ? formik?.values?.self_products?.map((item: any) => item?.value) : null;
            const products = [...coProducts, ...selfProdduct]?.filter(Boolean);

            const body = {
                branchId: formik?.values?.branch,
                name: formik?.values?.name,
                products
            }
            try {
                const reviewProducts = await post('/inventory/findQuantity', body);
                formik?.values?.batch.forEach((mainItem: any) => {
                    const matchedSubvalue = reviewProducts.data.find((subItem: any) => subItem.product._id === mainItem.products[0].product._id);
                    if (matchedSubvalue) {
                        mainItem.products[0].quantityInBranch = matchedSubvalue?.quantity || 0;
                    }
                });
                formik?.values?.self_products.forEach((mainItem: any) => {
                    const matchedSubvalue = reviewProducts.data.find((subItem: any) => subItem.product._id === mainItem?.value);
                    if (mainItem?.value) {
                        mainItem.quantityInBranch = matchedSubvalue?.quantity || 0;
                    }
                });
                setQuantityStatusModal(true);
            } catch (error) {
                console.log('Error', error);
            }
        }
    });

    return (
        <PageWrapper name='ADD PRODUCTS' isProtectedRoute={true}>
            <Subheader>
                <SubheaderLeft>
                    <Button
                        icon='HeroArrowLeft'
                        className='!px-0'
                        onClick={() => navigate(`${PathRoutes.jobs}`)}
                    >
                        {`${window.innerWidth > 425 ? 'Back to List' : ''}`}
                    </Button>
                    <div className='flex items-center justify-center ml-4' >
                        <h4>Without Material</h4>  <Switch {...Label} checked={withMaterial} onClick={() => setWithMaterial(!withMaterial)} /><h4>With Material</h4>
                    </div>
                    <SubheaderSeparator />
                </SubheaderLeft>
                <SubheaderRight >

                    {withMaterial ? <Button
                        variant='solid'
                        color='blue'
                        onClick={formik.handleSubmit}
                    >
                        Review Process
                    </Button> : ""}
                </SubheaderRight>
            </Subheader>
            {withMaterial ? (
                <Container className='flex shrink-0 grow basis-auto flex-col pb-0'>
                    <JobForm formik={formik} />
                    {quantityStatusModal ?
                        <ReviewJobProcess
                            formik={formik}
                            isOpen={quantityStatusModal}
                            setIsOpen={setQuantityStatusModal}
                        />
                        : null}
                </Container>
            ) :
                <Container>
                    <WithoutMaterialPage />
                </Container>}
        </PageWrapper >
    );
};

export default JobsPage;
