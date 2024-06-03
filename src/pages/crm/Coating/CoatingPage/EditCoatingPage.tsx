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
import SelectReact from "../../../../components/form/SelectReact";
import { Switch } from "@mui/material";

interface ColorOption {
    value: any;
    label: any;
}

const EditCoatingPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState<any>({
        name: '',
        code: '',
        colors: [],
        type : ''
    });
    const [colorOptions, setColorOptions] = useState<ColorOption[]>([]);
    const [existingColors, setExistingColors] = useState<ColorOption[]>([]);
    const [coatingState, setCoatingState] = useState<boolean>(true);
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
    const {id} = useParams();
    const fetchCoatingById = async () => {
        try {
            const coatingData = await get(`/coatings/${id}`);
            const { name, code, rate, colors, type } = coatingData.data;
            setFormData({ name, code, rate, colors, type });
            setExistingColors(colors);
            setCoatingState(type === "anodize");
            console.log("🚀 ~ fetchCoatingById ~ type === coatingData.data.type:", type === "coating")
        } catch (error) {
            console.error("Error fetching Coatin Data:", error);
        }
    }

    useEffect(() => {
        fetchCoatingById();
    }, []);
    const editCoatingData = async () => {
        try {
            const editedBranch = await put(`/coatings/${id}`, formData);
            console.log("edited Coating", editedBranch);
            toast.success('Coating edited Successfully!')
        } catch (error: any) {
            console.error("Error updatin Coating", error);
            toast.error(error.response.data.message, error);
        }
        finally {
            navigate(PathRoutes.coating)
        }
    };
    const selectedOptions = formData.colors.map((color: any) => ({
        value: color._id,
        label: color.name
    }));



    // const handleSelectChange = (selectedOptions: any) => {
    //     const selectedValues = selectedOptions.map((option: any) => option.value);
    //     console.log("🚀 ~ handleSelectChange ~ selectedValues:", selectedValues);

    //     setFormData((prevState: any) => ({
    //         ...prevState,
    //         colors: selectedValues || []
    //     }));

    //     const newColors = selectedOptions.map(({ value, label }: ColorOption) => ({ value, label }));
    //     setExistingColors(newColors);
    // };
    const handleSelectChange = (selectedOptions: any) => {
        const selectedValues = selectedOptions.map((option: any) => ({
            _id: option.value,
            name: option.label
        }));
        setExistingColors(selectedValues);
        setFormData((prevState: any) => ({
            ...prevState,
            colors: selectedValues.map((color: any) => color._id)
        }));
    };

    const filteredOptions = colorOptions.filter(option =>
        existingColors.some((color: any) => color._id === option.value)
    );
    console.log("Filtered Options", filteredOptions);
return(<>
<PageWrapper name='Edit Color' isProtectedRoute={true}>
            <Subheader>
                <SubheaderLeft>
                    <Button
                        icon='HeroArrowLeft'
                        className='!px-0'
                        onClick={() => navigate(`${PathRoutes.coating}`)}
                    >
                        {`${window.innerWidth > 425 ? 'Back to List' : ''}`}
                    </Button>
                    {/* <div className='flex items-center justify-center ml-4' >
                        <h4>Coating</h4>  <Switch {...Label} checked={coatingState} onClick={() => setCoatingState(!coatingState)} /><h4>Anodize</h4>
                    </div> */}
                    <SubheaderSeparator />
                </SubheaderLeft>
            </Subheader>
            <Container className='flex shrink-0 grow basis-auto flex-col '>
                <Card>
                    <CardBody>
                        <div className='mt-1 grid grid-cols-12 gap-2'>
                            <div className='col-span-12 lg:col-span-3'>
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

                            <div className='col-span-12 lg:col-span-3'>
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
                            <div className='col-span-12 lg:col-span-3'>
                                <Label htmlFor='Colors'>
                                    Colors
                                </Label>
                                <SelectReact
                                    name='colors'
                                    value={colorOptions.filter(option =>
                                        existingColors.some((color: any) => color._id === option.value)
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
</>)
}
export default EditCoatingPage;