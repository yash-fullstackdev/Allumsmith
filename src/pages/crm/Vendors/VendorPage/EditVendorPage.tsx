
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { get, put } from "../../../../utils/api-helper.util";
import Card, { CardBody } from "../../../../components/ui/Card";
import Button from "../../../../components/ui/Button";
import Label from "../../../../components/form/Label";
import Input from "../../../../components/form/Input";
import PageWrapper from "../../../../components/layouts/PageWrapper/PageWrapper";
import Container from "../../../../components/layouts/Container/Container";
import Checkbox from "../../../../components/form/Checkbox";
import { toast } from "react-toastify";
import { PathRoutes } from "../../../../utils/routes/enum";
import Subheader, { SubheaderLeft, SubheaderSeparator } from "../../../../components/layouts/Subheader/Subheader";
import { useFormik } from "formik";
import { vendorSchema } from "../../../../utils/formValidations";
import Textarea from "../../../../components/form/Textarea";
import VendorForm from "../../../../components/PageComponets/VendorForm/VendorForm";

const EditVendorPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    const formik: any = useFormik({
        initialValues: {
            name: '',
            email: '',
            phone: '',
            gstNumber: '',
            company: '',
            addressLine1: '',
            addressLine2: '',
            city: '',
            state: '',
            zipcode: '',
        },
        validationSchema: vendorSchema,
        onSubmit: async (value) => {
            try {
                const editedVendor = await put(`/vendors/${id}`, value);
                toast.success("Vendor edited Successfully!")
            } catch (error: any) {
                console.error("Error Updating Vendor", error);
                toast.error('Error Updating Vendor', error)
            }
            finally {
                navigate(PathRoutes.vendor);
            }
        }
    });

    const fetchVendorById = async () => {
        try {
            const vendorData = await get(`/vendors/${id}`);
            const { name, email, phone, gstNumber, company, addressLine1, addressLine2, city, state, zipcode } = vendorData.data;
            formik.setValues({ name, email, phone, gstNumber, company, addressLine1, addressLine2, city, state, zipcode })
        } catch (error) {
            console.error("Error fetching vendor data:", error);
        }
    }

    useEffect(() => {
        fetchVendorById();
    }, []);

    return (
        <PageWrapper name='Edit Vendor' isProtectedRoute={true}>
            <Subheader>
                <SubheaderLeft>
                    <Button
                        icon='HeroArrowLeft'
                        className='!px-0'
                        onClick={() => navigate(`${PathRoutes.vendor}`)}
                    >
                        {`${window.innerWidth > 425 ? 'Back to List' : ''}`}
                    </Button>
                    <SubheaderSeparator />
                </SubheaderLeft>

            </Subheader>
            <Container className='flex shrink-0 grow basis-auto flex-col '>
                <Card>
                    <CardBody>
                        <VendorForm formik={formik}/>
                        <div className='flex mt-4 gap-2'>
                            <Button variant='solid' color='blue' type='button' onClick={formik.handleSubmit} >
                                Update Vendor
                            </Button>
                        </div>
                    </CardBody>
                </Card>
            </Container>
        </PageWrapper >
    );
};

export default EditVendorPage;

