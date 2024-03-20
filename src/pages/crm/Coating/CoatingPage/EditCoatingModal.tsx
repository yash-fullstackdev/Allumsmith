
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
import { useNavigate } from "react-router-dom";
import { PathRoutes } from "../../../../utils/routes/enum";
import ReactSelect, { MultiValue, ActionMeta } from 'react-select'
import { color } from "framer-motion";
import SelectReact from "../../../../components/form/SelectReact";

// Define the ColorOption interface
interface ColorOption {
    value: any;
    label: any;
}

const EditCoatingModal = ({ coatingId, setIsEditModal, fetchData }: any) => {
    const [formData, setFormData] = useState<any>({
        name: '',
        code: '',
        rate: '',
        colors: [],
    });
    const [colorOptions, setColorOptions] = useState<ColorOption[]>([]);
    const [existingColors, setExistingColors] = useState<ColorOption[]>([]);
    useEffect(() => {
        console.log("🚀 ~ EditCoatingModal ~ formData:", formData)
        getAllColors();
    }, []);

    const getAllColors = async () => {
        try {
            const response = await get('/colors');
            const colorData = response.data.map((color: any) => ({
                value: color._id,
                label: color.name
            }));
            setColorOptions(colorData);
        } catch (error) {
            console.log("Error fetching color data:", error);
        }
    };
    const handleChange = (e: any) => {
        const { name, value, type, checked } = e.target;
        setFormData((prevState: any) => ({
            ...prevState,
            [name]: type === 'checkbox' ? checked : value
        }));
    };
    const optionsGroup: any = [];
    if (Array.isArray(colorOptions) && colorOptions.length > 0) {
        // const options = colorOptions.map((color: any) => ({
        //     value: color._id,
        //     label: color.name
        // }));
        // console.log("🚀 ~ options ~ options:", options)
        optionsGroup.push({
            label: 'Colors',
            options: colorOptions
        });
    } else {
        console.error('Invalid or empty color data.');
    }
    
    const fetchCoatingById = async () => {
        try {
            const coatingData = await get(`/coatings/${coatingId}`);
            const { name, code, rate, colors } = coatingData.data;
            setFormData({ name, code, rate, colors });
            setExistingColors(colors);
            console.log("Coating Data", coatingData.data);
        } catch (error) {
            console.error("Error fetching Coatin Data:", error);
        }
    }

    useEffect(() => {
        fetchCoatingById();
    }, []);
    const editCoatingData = async () => {
        try {
            const editedBranch = await put(`/coatings/${coatingId}`, formData);
            console.log("edited Coating", editedBranch);
            toast.success('Coating edited Successfully!')
        } catch (error: any) {
            console.error("Error updatin Coating", error);
            toast.error('Error updating Coating', error);
        }
        finally {
            setIsEditModal(false);
            fetchData();
        }
    };
    const selectedOptions = formData.colors.map((color: any) => ({
        value: color._id,
        label: color.name
    }));



    const handleSelectChange = (selectedOptions: any) => {
        const selectedValues = selectedOptions.map((option: any) => option.value);
        console.log("🚀 ~ handleSelectChange ~ selectedValues:", selectedValues);
    
        setFormData((prevState: any) => ({
            ...prevState, 
            colors: selectedValues || []
        }));
    
        const newColors = selectedOptions.map(({ value, label }:ColorOption) => ({ value, label }));
        setExistingColors(newColors);
    };
    
    
    
 console.log(existingColors,"formData1")
    return (
        <PageWrapper name='Edit Coating' isProtectedRoute={true}>
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
                                <Label htmlFor='code'>
                                    Code
                                </Label>
                                <Input
                                    id="code"
                                    name="code"
                                    value={formData.code}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className='col-span-12 lg:col-span-6'>
                                <Label htmlFor='rate'>
                                    Rate
                                </Label>
                                <Input
                                    id="rate"
                                    name="rate"
                                    value={formData.rate}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className='col-span-12 lg:col-span-6'>
                                <Label htmlFor='Colors'>
                                    Colors
                                </Label>
                                {/* <SelectReact
                                    name='colors'
                                    options={optionsGroup[0]?.options}
                                    isMulti
                                    defaultValue={selectedOptions}
                                    menuPlacement='auto'
                                    onChange={(value: any) => {
                                        const selectedValues = value.map((option: any) => option.value);
                                        setFormData((prevState: any) => ({
                                            ...prevState,
                                            colors: selectedValues
                                        }));
                                    }}
                                /> */}
                                <ReactSelect
                                    name='colors'
                                    // defaultValue={existingColors.map((color: any) => ({
                                    //     value: color._id,
                                    //     label: color.name
                                    // }))}
                                    value={existingColors.map((color:any, index:any)=>({
                                        value: color._id || index,
                                        label: color.name
                                       })      
                                 )}
                                    options={colorOptions}
                                    isMulti
                                    menuPlacement='auto'
                                    onChange={handleSelectChange}
                                />
                            </div>


                        </div>
                        <div className='flex mt-4 gap-2'>
                            <Button variant='solid' color='blue' type='button' onClick={editCoatingData}>
                                Update Coating Data
                            </Button>
                        </div>
                    </CardBody>
                </Card>
            </Container>
        </PageWrapper >
    );
};

export default EditCoatingModal;
