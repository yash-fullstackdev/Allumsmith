import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { get, post, put } from "../../../../utils/api-helper.util";
import { PathRoutes } from "../../../../utils/routes/enum";
import Card, { CardBody } from "../../../../components/ui/Card";
import Button from "../../../../components/ui/Button";
import Label from "../../../../components/form/Label";
import Input from "../../../../components/form/Input";
import PageWrapper from "../../../../components/layouts/PageWrapper/PageWrapper";
import Container from "../../../../components/layouts/Container/Container";
import CreatableSelect from 'react-select/creatable';

const EditProductModal = ({ editProductId, setEditModal, fetchData }: any) => {
    const [formData, setFormData] = useState<any>({
        name: '',
        hsn: '',
        rate: null,
        productCode: null,
        thickness: null,
        length: null,
        weight: null
    });
    const [dropDownValues, setDropDownValues] = useState<any>({});
    const navigate = useNavigate();

    const handleChange = (e: any) => {
        const { name, value, type, checked } = e.target;
        setFormData((prevState: any) => ({
            ...prevState,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const fetchProductById = async () => {
        try {
            const productData = await get(`/products/${editProductId}`);
            const { name, hsn, rate, productCode, thickness, length, weight } = productData.data;
            setFormData({ name, hsn, rate, productCode, thickness, length, weight });
        } catch (error) {
            console.error("Error fetching product data:", error);
        }
    }

    const getDropDownValues = async () => {
        try {
            const dropDownData = await get('/products/getDistinctValues');
            setDropDownValues(dropDownData.data || { thickness: [], length: [], weight: [] });
        } catch (error) {
            console.log("Error", error);
        }
    }

    useEffect(() => {
        getDropDownValues();
        fetchProductById();
    }, [])

    const editProduct = async () => {
        console.log("entries", formData);
        try {
            const editedProduct = await put(`/products/${editProductId}`, formData);
            console.log("edited Product", editedProduct)
        } catch (error: any) {
            console.error("Error Saving Product", error)
        }
        finally {
            navigate(PathRoutes.product);
            setEditModal(false);
            fetchData();
        }
    };

    return (
        <PageWrapper name='ADD Vendor' isProtectedRoute={true}>
            <Container className='flex shrink-0 grow basis-auto flex-col '>
                <Card>
                    <CardBody>
                        <div className='mt-1 grid grid-cols-12 gap-2'>
                            <div className='col-span-12 lg:col-span-6'>
                                <Label htmlFor='name'>
                                    Name
                                </Label>
                                <Input
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className='col-span-12 lg:col-span-6'>
                                <Label htmlFor='hsn'>
                                    HSN
                                </Label>
                                <Input
                                    id="hsn"
                                    name="hsn"
                                    value={formData.hsn}
                                    onChange={handleChange}
                                />
                            </div>

                            {/* Rate */}
                            <div className='col-span-12 lg:col-span-6'>
                                <Label htmlFor='rate'>
                                    Rate
                                </Label>
                                <Input
                                    id="rate"
                                    name="rate"
                                    value={formData.rate || ""}
                                    onChange={handleChange}
                                />
                            </div>

                            {/* Product Code */}
                            <div className='col-span-12 lg:col-span-6'>
                                <Label htmlFor='productCode'>
                                    Product Code
                                </Label>
                                <Input
                                    id="productCode"
                                    name="productCode"
                                    value={formData.productCode || ""}
                                    onChange={handleChange}
                                />
                            </div>

                            {/* Thickness */}
                            <div className='col-span-12 lg:col-span-4'>
                                <Label htmlFor='thickness'>
                                    Thickness
                                </Label>
                                <CreatableSelect
                                    id="thickness"
                                    name="thickness"
                                    options={dropDownValues && dropDownValues?.thickness?.map((value: any) => ({ value, label: value?.toString() ?? "" }))}
                                    onChange={(selectedOption: any) => setFormData((prevState: any) => ({ ...prevState, thickness: selectedOption.value }))}
                                    value={formData.thickness ? { value: formData.thickness, label: formData?.thickness?.toString() } : null}
                                />
                            </div>

                            {/* Length */}
                            <div className='col-span-12 lg:col-span-4'>
                                <Label htmlFor='length'>
                                    Length
                                </Label>
                                <CreatableSelect
                                    id="length"
                                    name="length"
                                    options={dropDownValues && dropDownValues?.length?.map((value: any) => ({ value, label: value?.toString() ?? "" }))}
                                    onChange={(selectedOption: any) => setFormData((prevState: any) => ({ ...prevState, length: selectedOption.value }))}
                                    value={formData.length ? { value: formData.length, label: formData.length.toString() } : null}
                                />
                            </div>

                            {/* Weight */}
                            <div className='col-span-12 lg:col-span-4'>
                                <Label htmlFor='weight'>
                                    Weight
                                </Label>
                                <CreatableSelect
                                    id="weight"
                                    name="weight"
                                    options={dropDownValues && dropDownValues?.weight?.map((value: any) => ({ value, label: value?.toString() ?? "" }))}
                                    onChange={(selectedOption: any) => setFormData((prevState: any) => ({ ...prevState, weight: selectedOption.value }))}
                                    value={formData.weight ? { value: formData.weight, label: formData.weight.toString() } : null}
                                />
                            </div>
                        </div>

                        <div className='flex mt-2 gap-2'>
                            <Button variant='solid' color='blue' type='button' onClick={editProduct}>
                                Update Product
                            </Button>
                        </div>
                    </CardBody>
                </Card>
            </Container>
        </PageWrapper >
    );
};

export default EditProductModal;
