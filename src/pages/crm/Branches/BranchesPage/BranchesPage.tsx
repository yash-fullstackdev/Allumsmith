

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

const BranchesPage = () => {
    const navigate = useNavigate();
    const formik:any = useFormik({
        initialValues: {
        },
        validationSchema:branchSchema,
        onSubmit: async () => {
            
        },
    });

    const saveBranches = async() =>{
        try {
            const check = await formik.validateForm();

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

            if (Object.keys(check).length > 0) {
                handleNestedErrors(check);

                toast.error(`Please fill all the mandatory fields and check all formats`);
                return;
            }

            const payload = formik.values
            await post('/branches', payload);
            toast.success('Branch added Successfully!');
            navigate(PathRoutes.branches);
        } catch (error:any) {
            console.error("Error Saving Branch", error);
            toast.error('Error Saving Branch', error);
        } 
    }
    
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
                                                    Add Branches
                                                </Button>
                                            </div>
                                        </div>

                                        <form onSubmit={formik.handleSubmit}>
                                            <div className='mt-1 grid grid-cols-12 gap-2 '>
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
                                                    <Label htmlFor='address_line1'>
                                                    Address Line 1
                                                    </Label>
                                                    <Input
                                                        id="address_line1"
                                                        name="address_line1"
                                                        value={formik.values.address_line1}
                                                        onChange={formik.handleChange}
                                                        onBlur={formik.handleBlur}
                                                    />
                                                    {formik.touched.address_line1 && formik.errors.address_line1 ? (
                                                        <div className='text-red-500'>{formik.errors.address_line1}</div>
                                                    ) : null}
                                                </div>
                                                <div className='col-span-12 lg:col-span-4'>
                                                    <Label htmlFor='address_line2'>
                                                    Address Line 2
                                                    </Label>
                                                    <Input
                                                        id="address_line2"
                                                        name="address_line2"
                                                        value={formik.values.address_line2}
                                                        onChange={formik.handleChange}
                                                        onBlur={formik.handleBlur}
                                                    />
                                                    {formik.touched.address_line2 && formik.errors.address_line2 ? (
                                                        <div className='text-red-500'>{formik.errors.address_line2}</div>
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
                                                <div className='col-span-12 lg:col-span-4'>
                                                    <Label htmlFor='phone'>
                                                    Phone
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
                                                    <Label htmlFor='contact_name'>
                                                    Contact Name
                                                    </Label>
                                                    <Input
                                                        id="contact_name"
                                                        name="contact_name"
                                                        value={formik.values.contact_name}
                                                        onChange={formik.handleChange}
                                                        onBlur={formik.handleBlur}
                                                    />
                                                    {formik.touched.contact_name && formik.errors.contact_name ? (
                                                        <div className='text-red-500'>{formik.errors.contact_name}</div>
                                                    ) : null}
                                                </div>
                                                <div className='col-span-12 lg:col-span-4'>
                                                    <Label htmlFor='contact_phone'>
                                                   Contact Phone
                                                    </Label>
                                                    <Input
                                                        id="contact_phone"
                                                        name="contact_phone"
                                                        value={formik.values.contact_phone}
                                                        onChange={formik.handleChange}
                                                        onBlur={formik.handleBlur}
                                                    />
                                                    {formik.touched.contact_phone && formik.errors.contact_phone ? (
                                                        <div className='text-red-500'>{formik.errors.contact_phone}</div>
                                                    ) : null}
                                                </div>

                                            </div>

                                            <div className='flex mt-4 gap-2'>
                                                <Button variant='solid' color='blue' onClick={saveBranches}>
                                                    Save Branch
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

export default BranchesPage;
