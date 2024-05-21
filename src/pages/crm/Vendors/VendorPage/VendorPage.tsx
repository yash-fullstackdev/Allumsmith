// // import React from 'react'

// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { post } from "../../../../utils/api-helper.util";
// import { PathRoutes } from "../../../../utils/routes/enum";
// import Card, { CardBody } from "../../../../components/ui/Card";
// import Button from "../../../../components/ui/Button";
// import Label from "../../../../components/form/Label";
// import Input from "../../../../components/form/Input";
// import PageWrapper from "../../../../components/layouts/PageWrapper/PageWrapper";
// import Subheader, { SubheaderLeft, SubheaderRight, SubheaderSeparator } from "../../../../components/layouts/Subheader/Subheader";
// import Container from "../../../../components/layouts/Container/Container";
// import { toast } from "react-toastify";


// const VendorPage = () => {
//     const [formData, setFormData] = useState({
//         name: '',
//         email: '',
//         phone: '',
//         gstNumber: '',
//         company: '',
//         addressLine1: '',
//         addressLine2: '',
//         city: '',
//         state: '',
//         zipcode: '',
//     });

//     const handleChange = (e: any) => {
//         const { name, value, type, checked } = e.target;
//         setFormData(prevState => ({
//             ...prevState,
//             [name]: type === 'checkbox' ? checked : value
//         }));
//     };
//     const navigate = useNavigate();




//     const addVendorToDatabase = async () => {
//         try {
//             const vendor = await post('/vendors', formData);
//             toast.success('Vendor added Successfully!')
//         } catch (error: any) {
//             toast.error("Error Saving Vendor", error)
//         }
//         finally {
//             navigate(PathRoutes.vendor);
//         }

//     };



//     return (
//         <PageWrapper name='ADD Vendor' isProtectedRoute={true}>
//             <Subheader>
//                 <SubheaderLeft>
//                     <Button
//                         icon='HeroArrowLeft'
//                         className='!px-0'
//                         onClick={() => navigate(`${PathRoutes.vendor}`)}
//                     >
//                         {`${window.innerWidth > 425 ? 'Back to List' : ''}`}
//                     </Button>
//                     <SubheaderSeparator />
//                 </SubheaderLeft>

//             </Subheader>
//             <Container className='flex shrink-0 grow basis-auto flex-col pb-0'>
//                 <div className='flex h-full flex-wrap content-start'>
//                     <div className='m-5 mb-4 grid w-full grid-cols-6 gap-1'>
//                         <div className='col-span-12 flex flex-col gap-1 xl:col-span-6'>
//                             <div className='col-span-12 flex flex-col gap-1 xl:col-span-6'>
//                                 <Card>
//                                     <CardBody>
//                                         <div className='flex'>
//                                             <div className='bold w-full'>
//                                                 <Button
//                                                     variant='outlined'
//                                                     className='flex w-full items-center justify-between rounded-none border-b px-[2px] py-[0px] text-start text-lg font-bold'

//                                                 >
//                                                     Add Vendor
//                                                 </Button>
//                                             </div>
//                                         </div>

//                                         <div className='mt-2 grid grid-cols-12 gap-2'>
//                                             <div className='col-span-12 lg:col-span-4'>
//                                                 <Label htmlFor='name'>
//                                                     Name
//                                                 </Label>
//                                                 <Input
//                                                     id="name"
//                                                     name="name"
//                                                     value={formData.name}
//                                                     onChange={handleChange}
//                                                 />
//                                                 {/* ... Error handling for name field */}
//                                             </div>
//                                             <div className='col-span-12 lg:col-span-4'>
//                                                 <Label htmlFor='email'>
//                                                     Email
//                                                 </Label>
//                                                 <Input
//                                                     id="email"
//                                                     name="email"
//                                                     value={formData.email}
//                                                     onChange={handleChange}
//                                                 />
//                                                 {/* ... Error handling for email field */}
//                                             </div>
//                                             <div className='col-span-12 lg:col-span-4'>
//                                                 <Label htmlFor='phone'>
//                                                     Phone
//                                                 </Label>
//                                                 <Input
//                                                     id="phone"
//                                                     name="phone"
//                                                     value={formData.phone}
//                                                     onChange={handleChange}
//                                                 />
//                                                 {/* ... Error handling for phone field */}
//                                             </div>
//                                             <div className='col-span-12 lg:col-span-4'>
//                                                 <Label htmlFor='gstNumber'>
//                                                     GST Number
//                                                 </Label>
//                                                 <Input
//                                                     id="gstNumber"
//                                                     name="gstNumber"
//                                                     value={formData.gstNumber}
//                                                     onChange={handleChange}
//                                                 />
//                                                 {/* ... Error handling for GST Number field */}
//                                             </div>
//                                             <div className='col-span-12 lg:col-span-4'>
//                                                 <Label htmlFor='company'>
//                                                     Company
//                                                 </Label>
//                                                 <Input
//                                                     id="company"
//                                                     name="company"
//                                                     value={formData.company}
//                                                     onChange={handleChange}
//                                                 />
//                                                 {/* ... Error handling for company field */}
//                                             </div>
//                                             <div className='col-span-12 lg:col-span-4'>
//                                                 <Label htmlFor='addressLine1'>
//                                                     Address Line 1
//                                                 </Label>
//                                                 <Input
//                                                     id="addressLine1"
//                                                     name="addressLine1"
//                                                     value={formData.addressLine1}
//                                                     onChange={handleChange}
//                                                 />
//                                                 {/* ... Error handling for addressLine1 field */}
//                                             </div>
//                                             <div className='col-span-12 lg:col-span-4'>
//                                                 <Label htmlFor='addressLine2'>Address Line 2</Label>
//                                                 <Input
//                                                     id="addressLine2"
//                                                     name="addressLine2"
//                                                     value={formData.addressLine2}
//                                                     onChange={handleChange}
//                                                 />
//                                                 {/* ... Error handling for addressLine2 field */}
//                                             </div>
//                                             <div className='col-span-12 lg:col-span-4'>
//                                                 <Label htmlFor='city'>
//                                                     City
//                                                 </Label>
//                                                 <Input
//                                                     id="city"
//                                                     name="city"
//                                                     value={formData.city}
//                                                     onChange={handleChange}
//                                                 />
//                                                 {/* ... Error handling for city field */}
//                                             </div>
//                                             <div className='col-span-12 lg:col-span-4'>
//                                                 <Label htmlFor='state'>
//                                                     State
//                                                 </Label>
//                                                 <Input
//                                                     id="state"
//                                                     name="state"
//                                                     value={formData.state}
//                                                     onChange={handleChange}
//                                                 />
//                                                 {/* ... Error handling for state field */}
//                                             </div>
//                                             <div className='col-span-12 lg:col-span-4'>
//                                                 <Label htmlFor='zipcode'>
//                                                     Zipcode
//                                                 </Label>
//                                                 <Input
//                                                     id="zipcode"
//                                                     name="zipcode"
//                                                     value={formData.zipcode}
//                                                     onChange={handleChange}
//                                                 />
//                                                 {/* ... Error handling for zipcode field */}
//                                             </div>

//                                         </div>


//                                         <div className='flex mt-2 gap-2'>

//                                             <Button variant='solid' color='blue' type='button' onClick={addVendorToDatabase}>
//                                                 Save Vendor
//                                             </Button>
//                                         </div>
//                                     </CardBody>
//                                 </Card>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </Container>
//         </PageWrapper >
//     );
// };

// export default VendorPage;

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
import { vendorSchema } from '../../../../utils/formValidations';
import Textarea from '../../../../components/form/Textarea';

const VendorPage = () => {
    const formik:any = useFormik({
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
        onSubmit: async (values) => {
            console.log('Values', values);
            try {
                await post('/vendors', values);
                toast.success('Vendor added Successfully!');
            } catch (error:any) {
                toast.error("Error Saving Vendor", error);
            }
            finally {
             navigate(PathRoutes.vendor);
            }
        },
    });

     
    const navigate  = useNavigate();
    return (
        <PageWrapper name='ADD Vendor' isProtectedRoute={true}>
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
            <Container className='flex shrink-0 grow basis-auto flex-col pb-0'>
                <div className='flex h-full flex-wrap content-start'>
                    <div className='m-5 mb-4 grid w-full grid-cols-6 gap-1'>
                        <div className='col-span-12 flex flex-col gap-1 xl:col-span-6'>
                            <div className='col-span-12 flex flex-col gap-1 xl:col-span-6'>
                                <Card>
                                    <CardBody>
                                        <div className='flex'>
                                            <div className='bold w-full'>
                                                <Button
                                                    variant='outlined'
                                                    className='flex w-full items-center justify-between rounded-none border-b px-[2px] py-[0px] text-start text-lg font-bold'
                                                >
                                                    Add Vendor
                                                </Button>
                                            </div>
                                        </div>

                                        <form onSubmit={formik.handleSubmit}>
                                            <div className='mt-2 grid grid-cols-12 gap-2'>
                                                <div className='col-span-12 lg:col-span-4'>
                                                    <Label htmlFor='name'>
                                                        Name
                                                    </Label>
                                                    <Input
                                                        id="name"
                                                        name="name"
                                                        value={formik.values.name}
                                                        onChange={formik.handleChange}
                                                        onBlur={formik.handleBlur}
                                                    />
                                                    {formik.touched.name && formik.errors.name ? (
                                                        <div className='text-red-500'>{formik.errors.name}</div>
                                                    ) : null}
                                                </div>
                                                <div className='col-span-12 lg:col-span-4'>
                                                    <Label htmlFor='email'>
                                                        Email
                                                    </Label>
                                                    <Input
                                                        id="email"
                                                        name="email"
                                                        value={formik.values.email}
                                                        onChange={formik.handleChange}
                                                        onBlur={formik.handleBlur}
                                                    />
                                                    {formik.touched.email && formik.errors.email ? (
                                                        <div className='text-red-500'>{formik.errors.email}</div>
                                                    ) : null}
                                                </div>
                                                <div className='col-span-12 lg:col-span-4'>
                                                    <Label htmlFor='phone'>
                                                        phone
                                                    </Label>
                                                    <Input
                                                        id="phone"
                                                        name="phone"
                                                        value={formik.values.phone}
                                                        onChange={formik.handleChange}
                                                        onBlur={formik.handleBlur}
                                                    />
                                                    {formik.touched.phone && formik.errors.phone ? (
                                                        <div className='text-red-500'>{formik.errors.phone}</div>
                                                    ) : null}
                                                </div>
                                                <div className='col-span-12 lg:col-span-4'>
                                                    <Label htmlFor='gstNumber'>
                                                        GST Number
                                                    </Label>
                                                    <Input
                                                        id="gstNumber"
                                                        name="gstNumber"
                                                        value={formik.values.gstNumber}
                                                        onChange={formik.handleChange}
                                                        onBlur={formik.handleBlur}
                                                    />
                                                    {formik.touched.gstNumber && formik.errors.gstNumber ? (
                                                        <div className='text-red-500'>{formik.errors.gstNumber}</div>
                                                    ) : null}
                                                </div>
                                                <div className='col-span-12 lg:col-span-4'>
                                                    <Label htmlFor='company'>
                                                    Company
                                                    </Label>
                                                    <Input
                                                        id="company"
                                                        name="company"
                                                        value={formik.values.company}
                                                        onChange={formik.handleChange}
                                                        onBlur={formik.handleBlur}
                                                    />
                                                    {formik.touched.company && formik.errors.company ? (
                                                        <div className='text-red-500'>{formik.errors.company}</div>
                                                    ) : null}
                                                </div>
                                               
                                                <div className='col-span-12 lg:col-span-4'>
                                                    <Label htmlFor='city'>
                                                    City
                                                    </Label>
                                                    <Input
                                                        id="city"
                                                        name="city"
                                                        value={formik.values.city}
                                                        onChange={formik.handleChange}
                                                        onBlur={formik.handleBlur}
                                                    />
                                                    {formik.touched.city && formik.errors.city ? (
                                                        <div className='text-red-500'>{formik.errors.city}</div>
                                                    ) : null}
                                                </div>
                                                <div className='col-span-12 lg:col-span-4'>
                                                    <Label htmlFor='state'>
                                                    State
                                                    </Label>
                                                    <Input
                                                        id="state"
                                                        name="state"
                                                        value={formik.values.state}
                                                        onChange={formik.handleChange}
                                                        onBlur={formik.handleBlur}
                                                    />
                                                    {formik.touched.state && formik.errors.state ? (
                                                        <div className='text-red-500'>{formik.errors.state}</div>
                                                    ) : null}
                                                </div>
                                                <div className='col-span-12 lg:col-span-4'>
                                                    <Label htmlFor='zipcode'>
                                                    Zipcode
                                                    </Label>
                                                    <Input
                                                        id="zipcode"
                                                        name="zipcode"
                                                        value={formik.values.zipcode}
                                                        onChange={formik.handleChange}
                                                        onBlur={formik.handleBlur}
                                                    />
                                                    {formik.touched.zipcode && formik.errors.zipcode ? (
                                                        <div className='text-red-500'>{formik.errors.zipcode}</div>
                                                    ) : null}
                                                </div>  
                                                <div className='col-span-12 lg:col-span-6'>
                                                    <Label htmlFor='addressLine1'>
                                                        Address 1
                                                    </Label>
                                                    <Textarea
                                                        id="addressLine1"
                                                        name="addressLine1"
                                                        value={formik.values.addressLine1}
                                                        onChange={formik.handleChange}
                                                        onBlur={formik.handleBlur}
                                                    />
                                                    {formik.touched.addressLine1 && formik.errors.addressLine1 ? (
                                                        <div className='text-red-500'>{formik.errors.addressLine1}</div>
                                                    ) : null}
                                                </div>
                                                <div className='col-span-12 lg:col-span-6'>
                                                    <Label htmlFor='addressLine2'>
                                                    Address 2
                                                    </Label>
                                                    <Textarea
                                                        id="addressLine2"
                                                        name="addressLine2"
                                                        value={formik.values.addressLine2}
                                                        onChange={formik.handleChange}
                                                        onBlur={formik.handleBlur}
                                                    />
                                                    {formik.touched.addressLine2 && formik.errors.addressLine2 ? (
                                                        <div className='text-red-500'>{formik.errors.addressLine2}</div>
                                                    ) : null}
                                                </div>
                                            </div>

                                            <div className='flex mt-2 gap-2'>
                                                <Button variant='solid' color='blue' type='submit'>
                                                    Save Vendor
                                                </Button>
                                            </div>
                                        </form>
                                    </CardBody>
                                </Card>
                            </div>
                        </div>
                    </div>
                </div>
            </Container>
        </PageWrapper >
    );
};

export default VendorPage;