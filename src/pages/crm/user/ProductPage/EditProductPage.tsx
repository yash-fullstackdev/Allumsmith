
// import React, { useEffect, useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import { get, post, put } from "../../../../utils/api-helper.util";
// import { PathRoutes } from "../../../../utils/routes/enum";
// import Card, { CardBody } from "../../../../components/ui/Card";
// import Button from "../../../../components/ui/Button";
// import Label from "../../../../components/form/Label";
// import Input from "../../../../components/form/Input";
// import PageWrapper from "../../../../components/layouts/PageWrapper/PageWrapper";
// import Container from "../../../../components/layouts/Container/Container";
// import CreatableSelect from 'react-select/creatable';
// import { toast } from "react-toastify";
// import Subheader, { SubheaderLeft, SubheaderRight, SubheaderSeparator } from "../../../../components/layouts/Subheader/Subheader";

// const EditProductPage = () => {
//     const [formData, setFormData] = useState<any>({
//         name: '',
//         hsn: '',
//         rate: null,
//         productCode: null,
//         thickness: null,
//         length: null,
//         weight: null
//     });
//     const [dropDownValues, setDropDownValues] = useState<any>({});
//     const navigate = useNavigate();
//     const { id } = useParams();
//     const handleChange = (e: any) => {
//         const { name, value, type, checked } = e.target;
//         setFormData((prevState: any) => ({
//             ...prevState,
//             [name]: type === 'checkbox' ? checked : value
//         }));
//     };

//     const fetchProductById = async () => {
//         try {
//             const productData = await get(`/products/${id}`);
//             const { name, hsn, rate, productCode, thickness, length, weight } = productData.data;
//             setFormData({ name, hsn, rate, productCode, thickness, length, weight });
//         } catch (error) {
//             console.error("Error fetching product data:", error);
//         }
//     }

//     const getDropDownValues = async () => {
//         try {
//             const dropDownData = await get('/products/getDistinctValues');
//             setDropDownValues(dropDownData.data || { thickness: [], length: [], weight: [] });
//         } catch (error) {
//             console.log("Error", error);
//         }
//     }

//     useEffect(() => {
//         getDropDownValues();
//         fetchProductById();
//     }, [])

//     const editProduct = async () => {
//         console.log("entries", formData);
//         try {
//             const editedProduct = await put(`/products/${id}`, formData);
//             console.log("edited Product", editedProduct);
//             toast.success(`Product Updated Successfully`)
//         } catch (error: any) {
//             console.error("Error Saving Product", error)
//             toast.error("Error Adding Products", error);
//         }
//         finally {
//             navigate(PathRoutes.product);
//         }
//     };

//     return (
//         <PageWrapper name='ADD Vendor' isProtectedRoute={true}>
//             <Subheader>
//                 <SubheaderLeft>
//                     <Button
//                         icon='HeroArrowLeft'
//                         className='!px-0'
//                         onClick={() => navigate(`${PathRoutes.product}`)}
//                     >
//                         {`${window.innerWidth > 425 ? 'Back to List' : ''}`}
//                     </Button>
//                     <SubheaderSeparator />
//                 </SubheaderLeft>

//             </Subheader>
//             <Container className='flex shrink-0 grow basis-auto flex-col '>
//                 <Card>
//                     <CardBody>
//                         <div className='mt-1 grid grid-cols-12 gap-2'>
//                             <div className='col-span-12 lg:col-span-6'>
//                                 <Label htmlFor='name'>
//                                     Name
//                                 </Label>
//                                 <Input
//                                     id="name"
//                                     name="name"
//                                     value={formData.name}
//                                     onChange={handleChange}
//                                 />
//                             </div>
//                             <div className='col-span-12 lg:col-span-6'>
//                                 <Label htmlFor='hsn'>
//                                     HSN
//                                 </Label>
//                                 <Input
//                                     id="hsn"
//                                     name="hsn"
//                                     value={formData.hsn}
//                                     onChange={handleChange}
//                                 />
//                             </div>

//                             {/* Rate */}
//                             <div className='col-span-12 lg:col-span-6'>
//                                 <Label htmlFor='rate'>
//                                     Rate
//                                 </Label>
//                                 <Input
//                                     id="rate"
//                                     name="rate"
//                                     value={formData.rate || ""}
//                                     onChange={handleChange}
//                                 />
//                             </div>

//                             {/* Product Code */}
//                             <div className='col-span-12 lg:col-span-6'>
//                                 <Label htmlFor='productCode'>
//                                     Product Code
//                                 </Label>
//                                 <Input
//                                     id="productCode"
//                                     name="productCode"
//                                     value={formData.productCode || ""}
//                                     onChange={handleChange}
//                                 />
//                             </div>

//                             {/* Thickness */}
//                             <div className='col-span-12 lg:col-span-4'>
//                                 <Label htmlFor='thickness'>
//                                     Thickness
//                                 </Label>
//                                 <CreatableSelect
//                                     id="thickness"
//                                     name="thickness"
//                                     options={dropDownValues && dropDownValues?.thickness?.map((value: any) => ({ value, label: value?.toString() ?? "" }))}
//                                     onChange={(selectedOption: any) => setFormData((prevState: any) => ({ ...prevState, thickness: selectedOption.value }))}
//                                     value={formData.thickness ? { value: formData.thickness, label: formData?.thickness?.toString() } : null}
//                                 />
//                             </div>

//                             {/* Length */}
//                             <div className='col-span-12 lg:col-span-4'>
//                                 <Label htmlFor='length'>
//                                     Length
//                                 </Label>
//                                 <CreatableSelect
//                                     id="length"
//                                     name="length"
//                                     options={dropDownValues && dropDownValues?.length?.map((value: any) => ({ value, label: value?.toString() ?? "" }))}
//                                     onChange={(selectedOption: any) => setFormData((prevState: any) => ({ ...prevState, length: selectedOption.value }))}
//                                     value={formData.length ? { value: formData.length, label: formData.length.toString() } : null}
//                                 />
//                             </div>

//                             {/* Weight */}
//                             <div className='col-span-12 lg:col-span-4'>
//                                 <Label htmlFor='weight'>
//                                     Weight
//                                 </Label>
//                                 <CreatableSelect
//                                     id="weight"
//                                     name="weight"
//                                     options={dropDownValues && dropDownValues?.weight?.map((value: any) => ({ value, label: value?.toString() ?? "" }))}
//                                     onChange={(selectedOption: any) => setFormData((prevState: any) => ({ ...prevState, weight: selectedOption.value }))}
//                                     value={formData.weight ? { value: formData.weight, label: formData.weight.toString() } : null}
//                                 />
//                             </div>
//                         </div>

//                         <div className='flex mt-2 gap-2'>
//                             <Button variant='solid' color='blue' type='button' onClick={editProduct}>
//                                 Update Product
//                             </Button>
//                         </div>
//                     </CardBody>
//                 </Card>
//             </Container>
//         </PageWrapper >
//     );
// };

// export default EditProductPage;
import React, { useEffect, useState } from "react";
import { useFormik } from 'formik';
import { useNavigate, useParams } from "react-router-dom";
import { get, put } from "../../../../utils/api-helper.util";
import { PathRoutes } from "../../../../utils/routes/enum";
import Card, { CardBody } from "../../../../components/ui/Card";
import Button from "../../../../components/ui/Button";
import Label from "../../../../components/form/Label";
import Input from "../../../../components/form/Input";
import PageWrapper from "../../../../components/layouts/PageWrapper/PageWrapper";
import Container from "../../../../components/layouts/Container/Container";
import CreatableSelect from 'react-select/creatable';
import { toast } from "react-toastify";
import Subheader, { SubheaderLeft, SubheaderRight, SubheaderSeparator } from "../../../../components/layouts/Subheader/Subheader";
import { editProductSchema } from "../../../../utils/formValidations";

const EditProductPage = () => {
    const [dropDownValues, setDropDownValues] = useState<any>({});
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
                formik.setValues(productData);
            }
        };
        fetchData();
    }, []);

    const formik :any = useFormik({
        initialValues: { 
        },
        validationSchema: editProductSchema,
        enableReinitialize: true,
        onSubmit: async (values) => {
        console.log('Values', values)
        },
    });

    const getDropDownValues = async () => {
        try {
            const dropDownData = await get('/products/getDistinctValues');
            setDropDownValues(dropDownData.data || { thickness: [], length: [], weight: [] });
        } catch (error) {
            console.error("Error fetching dropdown values:", error);
        }
    }

    useEffect(() => {
        getDropDownValues();
    }, []);
    const updateProduct = async () => {

        try {
            await formik.validateForm();

			const handleNestedErrors = (errors: any, prefix = '') => {
				//  logic to touch the field which are not validated
				Object.keys(errors).forEach((errorField) => {
					const fieldName = prefix ? `${prefix}.${errorField}` : errorField;

					if (typeof errors[errorField] === 'object' && errors[errorField] !== null) {
						// Recursive call for nested errors
						handleNestedErrors(errors[errorField], fieldName);
					} else {
						// Set the field as touched and set the error
						formik.setFieldTouched(fieldName, true, false);
						formik.setFieldError(fieldName, errors[errorField]);
					}
				});
			};

			if (Object.keys(formik.errors).length > 0) {
				handleNestedErrors(formik.errors);

				toast.error(`Please fill all the mandatory fields and check all formats`);
				return;
			}
            const formData = {
                name: formik.values.name,
                hsn: formik.values.hsn,
                rate: formik.values.rate,
                productCode: formik.values.productCode,
                thickness: formik.values.thickness,
                length: formik.values.length,
                weight: formik.values.weight,

            }
            const editedProduct = await put(`/products/${id}`, formData);
            console.log("edited Product", editedProduct);
            toast.success(`Product Updated Successfully`)
            navigate(PathRoutes.product);
        } catch (error: any) {
            console.error("Error Saving Product", error)
            toast.error("Error Adding Products", error);
        }
        
    };

    console.log('Formik ', formik.touched.name)

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
                        <form >
                            <div className='mt-1 grid grid-cols-12 gap-2'>
                                <div className='col-span-12 lg:col-span-6'>
                                    <Label htmlFor='name'>
                                        Name
                                    </Label>
                                    <Input
                                        id="name"
                                        type="text"
                                        name="name"
                                        value={formik.values.name}
                                        onBlur={formik.handleBlur}
                                        onChange={formik.handleChange}
                                    />
                                    {formik.touched.name && formik.errors.name ? (
                                        <div className='text-red-500'>{formik.errors.name}</div>
                                    ) : null}
                                </div>
                                <div className='col-span-12 lg:col-span-6'>
                                    <Label htmlFor='hsn'>
                                        HSN
                                    </Label>
                                    <Input
                                        id="hsn"
                                        name="hsn"
                                        value={formik.values.hsn}
                                        onBlur={formik.handleBlur}
                                        onChange={formik.handleChange}
                                    />
                                    {formik.touched.hsn && formik.errors.hsn ? (
                                        <div className='text-red-500'>{formik.errors.hsn}</div>
                                    ) : null}
                                </div>

                                {/* Rate */}
                                <div className='col-span-12 lg:col-span-6'>
                                    <Label htmlFor='rate'>
                                        Rate
                                    </Label>
                                    <Input
                                        id="rate"
                                        name="rate"
                                        value={formik.values.rate}
                                        onBlur={formik.handleBlur}
                                        onChange={formik.handleChange}
                                    />
                                    {formik.touched.rate && formik.errors.rate ? (
                                        <div className='text-red-500'>{formik.errors.rate}</div>
                                    ) : null}
                                </div>

                                {/* Product Code */}
                                <div className='col-span-12 lg:col-span-6'>
                                    <Label htmlFor='productCode'>
                                        Product Code
                                    </Label>
                                    <Input
                                        id="productCode"
                                        name="productCode"
                                        onBlur={formik.handleBlur}
                                        value={formik.values.productCode}
                                        onChange={formik.handleChange}
                                    />
                                    {formik.touched.productCode && formik.errors.productCode ? (
                                        <div className='text-red-500'>{formik.errors.productCode}</div>
                                    ) : null}
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
                                        onChange={(selectedOption: any) => formik.setFieldValue('thickness', selectedOption?.value || '')}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.thickness ? { value: formik.values.thickness, label: formik.values.thickness?.toString() } : null}
                                    />
                                    {formik.touched.thickness && formik.errors.thickness ? (
                                        <div className='text-red-500'>{formik.errors.thickness}</div>
                                    ) : null}
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
                                        onChange={(selectedOption: any) => formik.setFieldValue('length', selectedOption?.value || '')}
                                        value={formik.values.length ? { value: formik.values.length, label: formik.values.length?.toString() } : null}
                                        onBlur={formik.handleBlur}
                                    />
                                    {formik.touched.length && formik.errors.length ? (
                                        <div className='text-red-500'>{formik.errors.length}</div>
                                    ) : null}
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
                                        onChange={(selectedOption: any) => formik.setFieldValue('weight', selectedOption?.value || '')}
                                        value={formik.values.weight ? { value: formik.values.weight, label: formik.values.weight?.toString() } : null}
                                        onBlur={formik.handleBlur}
                                    />

                                    {formik.touched.weight && formik.errors.weight ? (
                                        <div className='text-red-500'>{formik.errors.weight}</div>
                                    ) : null}
                                </div>
                            </div>

                            <div className='flex mt-2 gap-2'>
                                <Button variant='solid' color='blue' onClick={updateProduct}>
                                    Update Product
                                </Button>
                            </div>
                        </form>
                    </CardBody>
                </Card>
            </Container>
        </PageWrapper >
    );
};

export default EditProductPage;
