import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { get, post, put } from "../../../../utils/api-helper.util";
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
import { Switch } from "@mui/material";
import { useFormik } from "formik";
import * as Yup from 'yup';

const EditColorPage = () => {
    const navigate = useNavigate();
    const [colorState, setColorState] = useState<boolean>(true);
    const [formData, setFormData] = useState<any>({
        name: '',
        code: '',
        type: '',
    });
    const validationSchema = Yup.object().shape({
        name:Yup.string().required('Name is Required'),
        code:Yup.string().required('Code is Required'),
    });
    const formik: any = useFormik({
        initialValues: {},
        validationSchema,
        onSubmit: () => { }
    });

    const handleChange = (e: any) => {
        const { name, value, type, checked } = e.target;
        setFormData((prevState: any) => ({
            ...prevState,
            [name]: type === 'checkbox' ? checked : value
        }));
    };
    const { id } = useParams();
    const fetchColorById = async () => {
        try {
            const { data } = await get(`/colors/${id}`);
            // const { name, code,type } = colorData.data;
            // setFormData({ name, code, type });
            // setColorState(type === "anodize");
            formik.setFieldValue('name', data.name);
            formik.setFieldValue('code', data.code);
            formik.setFieldValue('type', data.type);
        } catch (error) {
            console.error("Error fetching Color Data:", error);
        }
    }

    useEffect(() => {
        fetchColorById();
    }, []);

    const editColor = async () => {
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
            const editedBranch = await put(`/colors/${id}`, formik.values);
            console.log("edited Branch", editedBranch);
            toast.success('Color edited Successfully!')
            navigate(PathRoutes.colors)
        } catch (error: any) {
            toast.error('Error updating Color', error);
        }
        
    };
    return (<>
        <PageWrapper name='Edit Color' isProtectedRoute={true}>
            <Subheader>
                <SubheaderLeft>
                    <Button
                        icon='HeroArrowLeft'
                        className='!px-0'
                        onClick={() => navigate(`${PathRoutes.colors}`)}
                    >
                        {`${window.innerWidth > 425 ? 'Back to List' : ''}`}
                    </Button>
                    {/* <div className='flex items-center justify-center ml-4'>
                        <h4>Coating</h4>  <Switch {...Label} checked={colorState} onClick={() => setColorState(!colorState)} /><h4>Anodize</h4>
                    </div> */}
                    <SubheaderSeparator />
                </SubheaderLeft>
            </Subheader>
            <Container className='flex shrink-0 grow basis-auto flex-col '>
                <Card>
                    <CardBody>
                        <div className='mt-1 grid grid-cols-12 gap-2'>
                            <div className='col-span-12 lg:col-span-4'>
                                <Label htmlFor='name'>
                                    Name
                                </Label>
                                <Input
                                    id="name"
                                    name="name"
                                    value={formik.values.name}
                                    onChange={formik.handleChange}
                                />
                                {formik.touched.name && formik.errors.name && (
                                    <div className='text-red-500'>{formik.errors.name}</div>
                                )}
                            </div>

                            <div className='col-span-12 lg:col-span-4'>
                                <Label htmlFor='code'>
                                    Code
                                </Label>
                                <Input
                                    id="code"
                                    name="code"
                                    value={formik.values.code}
                                    onChange={formik.handleChange}
                                />
                                {formik.touched.code && formik.errors.code && (
                                    <div className='text-red-500'>{formik.errors.code}</div>
                                )}
                            </div>


                        </div>
                        <div className='flex mt-4 gap-2'>
                            <Button variant='solid' color='blue' type='button' onClick={editColor}>
                                Update Color
                            </Button>
                        </div>
                    </CardBody>
                </Card>
            </Container>
        </PageWrapper >
    </>)
}
export default EditColorPage;