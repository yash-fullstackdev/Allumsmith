import React, { useEffect, useState } from "react";
import { useFormik } from 'formik';
import { useNavigate, useParams } from "react-router-dom";
import { get, put } from "../../../../utils/api-helper.util";
import { PathRoutes } from "../../../../utils/routes/enum";
import Card, { CardBody } from "../../../../components/ui/Card";
import Button from "../../../../components/ui/Button";
import PageWrapper from "../../../../components/layouts/PageWrapper/PageWrapper";
import Container from "../../../../components/layouts/Container/Container";
import { toast } from "react-toastify";
import Subheader, { SubheaderLeft, SubheaderSeparator } from "../../../../components/layouts/Subheader/Subheader";
import { productsSchema } from "../../../../utils/formValidations";
import ProductForm from "../../../../components/PageComponets/ProductForm/ProductForm";

const EditProductPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    const fetchProductById = async () => {
        try {
            const productData = await get(`/products/${id}`);
            return productData.data;
        } catch (error) {
            console.error("Error fetching product data:", error);
            return null;
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            const productData = await fetchProductById();
            if (productData) {
                formik.setValues({ entries: [productData] });
            }
        };
        fetchData();
    }, []);

    const formik: any = useFormik({
        initialValues: {
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
        },
        validationSchema: productsSchema,
        onSubmit: async (values) => {
            console.log('Values', values)
            const formikValue = values?.entries?.[0];
            try {
                const formData = {
                    name: formikValue.name,
                    hsn: formikValue.hsn,
                    rate: formikValue.rate,
                    productCode: formikValue.productCode,
                    thickness: formikValue.thickness,
                    length: formikValue.length,
                    weight: formikValue.weight,
                    premium_rate: formikValue.premium_rate,
                    wooden_rate: formikValue.wooden_rate,
                    commercial_rate: formikValue.commercial_rate,
                    anodize_rate: formikValue.anodize_rate
                }
                const editedProduct = await put(`/products/${id}`, formData);
                console.log("edited Product", editedProduct);
                toast.success(`Product Updated Successfully`)
                navigate(PathRoutes.product);
            } catch (error: any) {
                console.error("Error Saving Product", error)
                toast.error("Error Adding Products", error);
            }
        },
    });

    return (
        <PageWrapper name='ADD Vendor' isProtectedRoute={true}>
            <Subheader>
                <SubheaderLeft>
                    <Button
                        icon='HeroArrowLeft'
                        className='!px-0'
                        onClick={() => navigate(`${PathRoutes.product}`)}
                    >
                        {`${window.innerWidth > 425 ? 'Back to List' : ''}`}
                    </Button>
                    <SubheaderSeparator />
                </SubheaderLeft>

            </Subheader>
            <Container className='flex shrink-0 grow basis-auto flex-col '>
                <Card>
                    <CardBody>
                        <ProductForm formik={formik} />
                        <div className='flex mt-2 gap-2'>
                            <Button variant='solid' color='blue' onClick={formik.handleSubmit}>
                                Update Product
                            </Button>
                        </div>
                    </CardBody>
                </Card>
            </Container>
        </PageWrapper >
    );
};

export default EditProductPage;
