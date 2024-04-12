import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageWrapper from '../../../../components/layouts/PageWrapper/PageWrapper';
import Subheader, { SubheaderLeft, SubheaderSeparator } from '../../../../components/layouts/Subheader/Subheader';
import Button from '../../../../components/ui/Button';
import Container from '../../../../components/layouts/Container/Container';
import Card, { CardBody } from '../../../../components/ui/Card';
import Label from '../../../../components/form/Label';
import Input from '../../../../components/form/Input';
import SelectReact from '../../../../components/form/SelectReact';
import { get, post } from '../../../../utils/api-helper.util';
import { PathRoutes } from '../../../../utils/routes/enum';
import { toast } from 'react-toastify';
import { Switch } from '@mui/material';

const CoatingPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        code: '',
        rate: '',
        mm: '',
        colors: [],
    });
    const [colorData, setColorData] = useState([]);

    const [coatingState, setCoatingState] = useState<boolean>(true);

    useEffect(() => {
        getAllColors();
    }, []);

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

    const handleChange = (e: any) => {
        const { name, value, type, checked } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const optionsGroup = [];
    if (Array.isArray(filteredColors) && filteredColors.length > 0) {
        const options = filteredColors.map((color: any) => ({
            value: color._id,
            label: color.name
        }));
        optionsGroup.push({
            label: 'Colors',
            options: options
        });
    } else {
        console.error('Invalid or empty color data.');
    }


    const addEntryToDatabase = async (type: string) => {
        try {
            let finalData = {}
            if (type === "coating") {
                const data = {
                    code: formData.code,
                    colors: formData.colors,
                    name: formData.name,
                    rate: parseInt(formData.rate),
                    type: type // Include type in the payload
                };
                finalData = data
            } else {
                const data = {
                    code: formData.code,
                    colors: formData.colors,
                    name: formData.name,
                    rate: parseInt(formData.rate),
                    mm: parseFloat(formData.mm),
                    type: type // Include type in the payload
                };
                finalData = data
            }
            const response = await post('/coatings', finalData);
            console.log("Response:", response);
            toast.success('Data saved Successfully!');
            navigate(PathRoutes.coating);
        } catch (error) {
            console.error("Error Saving Data:", error);
            toast.error('Failed to save data. Please try again.');
        }
    };
    return (
        <PageWrapper name='ADD Colors' isProtectedRoute={true}>
            <Subheader>
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
            </Subheader>
            <Container className='flex shrink-0 grow basis-auto flex-col pb-0'>
                <div className='flex h-full flex-wrap content-start'>
                    <div className='m-5 mb-4 grid w-full grid-cols-6 gap-1'>
                        <div className='col-span-12 flex flex-col gap-1 xl:col-span-6'>
                            <div className='col-span-12 flex flex-col gap-1 xl:col-span-6'>
                                <Card>
                                    <CardBody>
                                        {coatingState ? (<> <div className='flex'>
                                            <div className='bold w-full'>
                                                <Button
                                                    variant='outlined'
                                                    className='flex w-full items-center justify-between rounded-none border-b px-[2px] py-[0px] text-start text-lg font-bold'
                                                >
                                                    Add Coating
                                                </Button>
                                            </div>
                                        </div>
                                            <div className='mt-2 grid grid-cols-12 gap-2'>
                                                <div className='col-span-12 lg:col-span-2'>
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
                                                <div className='col-span-12 lg:col-span-2'>
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
                                                <div className='col-span-12 lg:col-span-2'>
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

                                                <div className='col-span-12 lg:col-span-2'>
                                                    <Label htmlFor='mm'>
                                                        MM
                                                    </Label>
                                                    <Input
                                                        id="mm"
                                                        name="mm"
                                                        value={formData.mm}
                                                        onChange={handleChange}
                                                    />
                                                </div>
                                                <div className='col-span-12 lg:col-span-2'>
                                                    <Label htmlFor='Colors'>
                                                        Colors
                                                    </Label>
                                                    <SelectReact
                                                        name='colors'
                                                        options={optionsGroup[0]?.options}
                                                        isMulti
                                                        menuPlacement='auto'
                                                        onChange={(selectedOptions: any) => {
                                                            const selectedValues = selectedOptions.map((option: any) => option.value);
                                                            setFormData(prevState => ({
                                                                ...prevState,
                                                                colors: selectedValues
                                                            }));
                                                        }}
                                                    />


                                                </div>
                                            </div>
                                        </>) : (<>
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
                                            <div className='mt-2 grid grid-cols-12 gap-2'>
                                                <div className='col-span-12 lg:col-span-2'>
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
                                                <div className='col-span-12 lg:col-span-2'>
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
                                                <div className='col-span-12 lg:col-span-2'>
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
                                                <div className='col-span-12 lg:col-span-2'>
                                                    <Label htmlFor='Colors'>
                                                        Colors
                                                    </Label>
                                                    <SelectReact
                                                        name='colors'
                                                        options={optionsGroup[0]?.options}
                                                        isMulti
                                                        menuPlacement='auto'
                                                        onChange={(selectedOptions: any) => {
                                                            const selectedValues = selectedOptions.map((option: any) => option.value);
                                                            setFormData(prevState => ({
                                                                ...prevState,
                                                                colors: selectedValues
                                                            }));
                                                        }}
                                                    />


                                                </div>
                                            </div>
                                        </>)
                                        }
                                        <div className='flex mt-2 gap-2'>
                                            <Button variant='solid' color='blue' type='button' onClick={() => addEntryToDatabase(coatingState ? 'anodize' : 'coating')}>
                                                Save Entries
                                            </Button>
                                        </div>
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
