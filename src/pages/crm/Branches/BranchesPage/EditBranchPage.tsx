
import React, { useEffect, useState } from "react";
import { get, put } from "../../../../utils/api-helper.util";
import Card, { CardBody } from "../../../../components/ui/Card";
import Button from "../../../../components/ui/Button";
import Label from "../../../../components/form/Label";
import Input from "../../../../components/form/Input";
import PageWrapper from "../../../../components/layouts/PageWrapper/PageWrapper";
import Container from "../../../../components/layouts/Container/Container";
import Checkbox from "../../../../components/form/Checkbox";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import { PathRoutes } from "../../../../utils/routes/enum";
import Subheader, { SubheaderLeft, SubheaderSeparator } from "../../../../components/layouts/Subheader/Subheader";
import { useFormik } from "formik";
import { branchSchema } from "../../../../utils/formValidations";
import BranchesForm from "../../../../components/PageComponets/BranchesForm/BranchesForm";

const EditBranchPage = () => {
    const { id } = useParams();
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
                const editedBranch = await put(`/branches/${id}`, values);
                console.log("edited Branch", editedBranch);
                toast.success('Branch edited Successfully!')
            } catch (error: any) {
                console.error("Error updatin Branch", error);
                toast.error('Error updating Branch', error);
            }
            finally {
                navigate(PathRoutes.branches)
            }
        }
    });

    const fetchBranchById = async () => {
        try {
            const branchData = await get(`/branches/${id}`);
            const { name, address_line1, address_line2, city, state, zipcode, phone, contact_name, contact_phone } = branchData.data;
            formik.setValues({ name, address_line1, address_line2, city, state, zipcode, phone, contact_name, contact_phone })
        } catch (error) {
            console.error("Error fetching branch data:", error);
        }
    }

    useEffect(() => {
        fetchBranchById();
    }, []);



    return (
        <PageWrapper name='Edit Branch' isProtectedRoute={true}>
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
            <Container className='flex shrink-0 grow basis-auto flex-col '>
                <Card>
                    <CardBody>
                        <BranchesForm formik={formik} />
                        <div className='flex mt-4 gap-2'>
                            <Button variant='solid' color='blue' isLoading={formik?.isSubmitting} isDisable={formik?.isSubmitting}  type='button' onClick={formik.handleSubmit}>
                                Update Branch
                            </Button>
                        </div>
                    </CardBody>
                </Card>
            </Container>
        </PageWrapper >
    );
};

export default EditBranchPage;
