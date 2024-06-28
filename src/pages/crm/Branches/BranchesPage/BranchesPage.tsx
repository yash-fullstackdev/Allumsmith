

import React from 'react';
import { useFormik } from 'formik';
import { post } from '../../../../utils/api-helper.util';
import { PathRoutes } from '../../../../utils/routes/enum';
import Card, { CardBody } from '../../../../components/ui/Card';
import Button from '../../../../components/ui/Button';
import Label from '../../../../components/form/Label';
import Input from '../../../../components/form/Input';
import PageWrapper from '../../../../components/layouts/PageWrapper/PageWrapper';
import Subheader, { SubheaderLeft, SubheaderRight, SubheaderSeparator } from '../../../../components/layouts/Subheader/Subheader';
import Container from '../../../../components/layouts/Container/Container';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { branchSchema } from '../../../../utils/formValidations';
import BranchesForm from '../../../../components/PageComponets/BranchesForm/BranchesForm';

const BranchesPage = () => {
    const navigate = useNavigate();
    const formik: any = useFormik({
        initialValues: {
            name: '',
            address_line1: '',
            address_line2: '',
            city: '',
            state: '',
            zipcode: '',
            phone: '',
            contact_name: '',
            contact_phone: '',
        },
        validationSchema: branchSchema,
        onSubmit: async (values) => {
            try {
                await post('/branches', values);
                toast.success('Branch added Successfully!');
                navigate(PathRoutes.branches);
            } catch (error: any) {
                console.error("Error Saving Branch", error);
                toast.error('Error Saving Branch', error);
            }
        },
    });

    return (
        <PageWrapper name='ADD Branches' isProtectedRoute={true}>
            <Subheader>
                <SubheaderLeft>
                    <Button
                        icon='HeroArrowLeft'
                        className='!px-0'
                        onClick={() => navigate(`${PathRoutes.branches}`)}
                    >
                        {`${window.innerWidth > 425 ? 'Back to List' : ''}`}
                    </Button>
                    <SubheaderSeparator />
                </SubheaderLeft>
            </Subheader>
            <Container className='flex shrink-0 grow basis-auto flex-col pb-0'>
                <Card>
                    <CardBody>
                        <div
                            className='flex w-full items-center justify-between rounded-none border-b px-[2px] py-[0px] text-start text-lg font-bold'
                        >
                            Add Branches
                        </div>

                        <BranchesForm formik={formik} />
                        <div className='flex mt-4 gap-2'>
                            <Button variant='solid' color='blue' onClick={formik.handleSubmit}>
                                Save Branch
                            </Button>
                        </div>
                    </CardBody>
                </Card>
            </Container>
        </PageWrapper >
    );
};

export default BranchesPage;
