import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik'; // Importing useFormik
import { useNavigate } from 'react-router-dom';
import PageWrapper from '../../../../components/layouts/PageWrapper/PageWrapper';
import Subheader, { SubheaderLeft, SubheaderSeparator } from '../../../../components/layouts/Subheader/Subheader';
import Button from '../../../../components/ui/Button';
import Container from '../../../../components/layouts/Container/Container';
import Card, { CardBody } from '../../../../components/ui/Card';
import Label from '../../../../components/form/Label';
import Input from '../../../../components/form/Input';
import SelectReact from '../../../../components/form/SelectReact';
import Select from '../../../../components/form/Select';
import { get, post } from '../../../../utils/api-helper.util';
import { PathRoutes } from '../../../../utils/routes/enum';
import { toast } from 'react-toastify';
import { Switch } from '@mui/material';
import { CoatingSchema } from '../../../../utils/formValidations';

const CoatingPage = () => {
    const navigate = useNavigate();

    const [colorData, setColorData] = useState([]);
    const [coatingState, setCoatingState] = useState<boolean>(false);
    const [coatingType, setCoatingType] = useState<any>({value: "", label:""});

    useEffect(() => {
        getAllColors();
    }, []);

    const coatingTypes = [
        { value: 'anodize', label: 'Anodize' },
        { value: 'wooden', label: 'Wooden' },
        { value: 'premium', label: 'Premium' },
        { value: 'commercial', label: 'Commercial' }
    ];
    
    const getAllColors = async () => {
        try {
            const response = await get('/colors');
            setColorData(response.data);
        } catch (error) {
            console.log("Error fetching color data:", error);
        }
    };

    const filteredColors = colorData.filter((color: any) => {
        if (coatingState) {
            return color.type === "anodize";
        } else {
            return color.type === "coating";
        }
    });

    // Formik initialization
    const formik: any = useFormik({
        initialValues: {
            name: '',
            code: '',
            colors: [],
            type: ''
        },
        validationSchema:CoatingSchema,
        onSubmit: async (values) => {
            try {
               
                // const type = coatingState ? 'anodize' : 'coating';
                await addEntryToDatabase(values);
            } catch (error) {
                console.error("Error Saving Data:", error);
                toast.error('Failed to save data. Please try again.');
            }
        },
    });

    const addEntryToDatabase = async (values:any) => {
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

				toast.error('Please fill in all required fields.');
				return;
			}
            const finalData = {
                ...values
            };
            console.log('FinalData', finalData);
            const response = await post('/coatings', finalData);
            toast.success('Data saved Successfully!');
            navigate(PathRoutes.coating);
        } catch (error) {
            console.error("Error Saving Data:", error);
            toast.error('Failed to save data. Please try again.');
        }
    };
    console.log(formik.touched.name && formik.errors.name)
    return (
        <PageWrapper name='ADD Colors' isProtectedRoute={true}>
            {/* <Subheader>
                <SubheaderLeft>
                    <Button
                        icon='HeroArrowLeft'
                        className='!px-0'
                        onClick={() => navigate(`${PathRoutes.coating}`)}
                    >
                        {`${window.innerWidth > 425 ? 'Back to List' : ''}`}
                    </Button>
                    <div className='flex items-center justify-center ml-4' >
                        <h4>Coating</h4>  <Switch {...Label} checked={coatingState} onClick={() => setCoatingState(!coatingState)} /><h4>Anodize</h4>
                    </div>
                    <SubheaderSeparator />
                </SubheaderLeft>
            </Subheader> */}
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
                                                    Add Coating
                                                </Button>
                                            </div>
                                        </div>
                                        <form onSubmit={formik.handleSubmit}>
                                            <div className='mt-2 grid grid-cols-12 gap-2'>
                                                <div className='col-span-12 lg:col-span-3'>
                                                    <Label htmlFor='name'>
                                                        Name
                                                    </Label>
                                                    <Input
                                                        id="name"
                                                        name="name"
                                                        onBlur={formik.handleBlur}
                                                        value={formik.values.name}
                                                        onChange={formik.handleChange}
                                                    />
                                                    {formik.touched.name && formik.errors.name ? (
                                                        <div className='text-red-500'>{formik.errors.name}</div>
                                                    ):null}
                                                </div>
                                                <div className='col-span-12 lg:col-span-3'>
                                                    <Label htmlFor='code'>
                                                        Code
                                                    </Label>
                                                    <Input
                                                        id="code"
                                                        name="code"
                                                        value={formik.values.code}
                                                        onBlur={formik.handleBlur}
                                                        onChange={formik.handleChange}
                                                    />
                                                    {formik.touched.code && formik.errors.code ? (
                                                        <div className='text-red-500'>{formik.errors.code}</div>
                                                    ):null}
                                                </div>
                                                <div className='col-span-12 lg:col-span-3'>
                                                    <Label htmlFor='Colors'>
                                                        Colors
                                                    </Label>
                                                    <SelectReact
                                                        name='colors'
                                                        options={filteredColors.map((color: any) => ({
                                                            value: color._id,
                                                            label: color.name,
                                                        }))}
                                                        isMulti
                                                        onBlur={formik.handleBlur}
                                                        menuPlacement='auto'
                                                        onChange={(selectedOptions: any) => {
                                                            formik.setFieldValue('colors', selectedOptions.map((option: any) => option.value));
                                                        }}
                                                    />
                                                    {formik.touched.colors && formik.errors.colors ? (
                                                        <div className='text-red-500'>{formik.errors.colors}</div>
                                                    ):null}
                                                </div>
                                                <div className='col-span-12 lg:col-span-3'>
                                                    <Label htmlFor='Colors'>
                                                        Coating Type
                                                    </Label>
                                                    <Select
                                                        id='type'
                                                        name='type'
                                                        value={formik.values.type}
                                                        placeholder='Select Type'
                                                        onChange={formik.handleChange}
                                                    >
                                                        {coatingTypes.map((coating:any, index) => (
                                                            <option key={index} value={coating.value}>
                                                                {coating.label}
                                                            </option>
                                                        ))}
                                                    </Select>
                                                </div>
                                            </div>
                                            
                                            <div className='flex mt-2 gap-2'>
                                                <Button variant='solid' color='blue' onClick={() =>addEntryToDatabase(formik.values)}>
                                                    Save Entries
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
        </PageWrapper>
    );
};

export default CoatingPage;
