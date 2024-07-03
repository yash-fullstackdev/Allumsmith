
import React, { useEffect, useState } from 'react';
import { get, post, put } from '../../../../utils/api-helper.util';
import Card, { CardBody } from '../../../../components/ui/Card';
import Button from '../../../../components/ui/Button';
import Label from '../../../../components/form/Label';
import Input from '../../../../components/form/Input';
import Select from '../../../../components/form/Select';
import { useNavigate } from 'react-router-dom';
import { PathRoutes } from '../../../../utils/routes/enum';
import Container from '../../../../components/layouts/Container/Container';
import PageWrapper from '../../../../components/layouts/PageWrapper/PageWrapper';
import Subheader, { SubheaderLeft, SubheaderSeparator } from '../../../../components/layouts/Subheader/Subheader';
import { toast } from 'react-toastify';
import { use } from 'i18next';


const EditJobModal = ({ jobId, setIsEditModal, fetchData }: any) => {
    const [entries, setEntries] = useState<any>([{ product: '', quantity: '', coating: '', color: '' }]);
    const [name, setName] = useState('');
    const [branchData, setBranchData] = useState<any>([])
    const [coatingData, setCoatingData] = useState<any>([])
    const [productsData, setProductsData] = useState<any>([]);
    const [colorData, setColorData] = useState([]);
    const [branchId, setBranchId] = useState('');
    const [coatingId, setCoatingId] = useState('');
    const navigate = useNavigate();




    const getInventoryDetails = async () => {
        try {
            const { data } = await get('/inventory');
            const productsWithData = data.filter((item: any) => item.product);
            setProductsData(productsWithData);
        } catch (error) {
            console.error("Error Fetching Products", error);
        }
    }
    const getBranchDetails = async () => {
        try {
            const { data } = await get('/branches');
            setBranchData(data);
        } catch (error) {
            console.error("Error Fetching Branch", error);
        }
    }

    const getCoatingDetails = async () => {
        try {
            const { data } = await get('/coatings');
            setCoatingData(data);
        } catch (error) {
            console.error("Error Fetching Coating", error);
        }
    }
    console.log('Coatinggggg', coatingData)
    useEffect(() => {
        getInventoryDetails();
        getBranchDetails();
        getCoatingDetails();

    }, []);

    const handleAddEntry = () => {
        setEntries([...entries, { product: '', quantity: '', coating: '', color: '' }]);
    };

    const getJobById = async () => {
        try {
            const jobData = await get(`/jobs/${jobId}`);
            const { name, branch, batch } = jobData.data;
            setEntries(batch);
            setBranchId(branch);
            setName(name);

        } catch (error) {
            console.error("Error fetching Job Data:", error);
        }
    }
    console.log('Batch', entries)
    useEffect(() => {
        getJobById();
    }, [])
    const handleUpdateEntries = async () => {
        const updatedEntries = entries.map((entry: any) => ({
            ...entry,
            quantity: Number(entry.quantity)
        }));
        const finalValues = {
            // status: "pending",
            name,
            branch: branchId,
            batch: updatedEntries,
        };
        console.log("final values", finalValues);
        try {
            const { data } = await put(`/jobs/${jobId}`, finalValues);
            toast.success('Job Updated Successfully!');

        } catch (error: any) {
            console.error("Error Adding Job", error);
            toast.error('Error Creating Job', error);
        } finally {
            setIsEditModal(false);
            fetchData();
        }

    };

    const handleDeleteProduct = (index: any) => {
        const newProduct = [...entries]
        newProduct.splice(index, 1)
        setEntries(newProduct)
    }

    const updateColorOptions = (coatingId: any) => {
        // console.log('Coating id', coatingId)

        coatingData.map((coating: any) => {
            console.log('coating_id', coating._id)
            console.log('coating IDDDDD', coatingId)
        })

        const selectedCoating = coatingData.find((coating: any) => coating._id === coatingId);
        if (selectedCoating) {
            console.log("ifffffffff")
            setColorData(selectedCoating.colors);
        } else {
            setColorData([]);
        }
        // if (selectedCoating) {
        //     setColorData(selectedCoating.colors);
        //     return selectedCoating.colors
        // } else {
        //     setColorData([]);
        // }
    }
    console.log('COlor Data', colorData)

    useEffect(() => {
        console.log(coatingId, "useEffect")
        if (coatingId !== "") {
            updateColorOptions(coatingId);
        }
    }, []);
    const getColorName = (colorId: string, index: number) => {
        console.log("Coating Data", coatingData[index]?.colors)
        console.log('Coating Data', colorId)
        const selectedColor = coatingData && coatingData[index]?.colors?.find((color: any) => color._id === colorId);
        console.log('Coating Data', selectedColor && selectedColor?.name);
        return selectedColor ? selectedColor?.name : ''; // Return the name of the color if found, otherwise return an empty string
    };

    // const getColorName = (colorId: string, index: number) => {
    //     const selectedColor = coatingData && coatingData[index]?.colors?.find((color: any) => color._id === colorId);
    //     return selectedColor ? selectedColor.name : '';
    // };

    return (
        <PageWrapper name='ADD PRODUCTS' isProtectedRoute={true}>
            <Container className='flex shrink-0 grow basis-auto flex-col pb-0'>
                <div className='flex h-full flex-wrap content-start'>
                    <div className='m-5 mb-4 grid w-full grid-cols-6 gap-1'>
                        <div className='col-span-12 flex flex-col gap-1 xl:col-span-6'>
                            <div className='col-span-12 flex flex-col gap-1 xl:col-span-6'>
                                <Card>


                                    <div>
                                        <div className='mt-2 grid grid-cols-12 gap-1'>
                                            <div className='col-span-12 lg:col-span-6'>
                                                <Label htmlFor='name' require={true}>
                                                    Name
                                                </Label>
                                                <Input
                                                    type='text'
                                                    id={`name`}
                                                    name={`name`}
                                                    value={name}
                                                    onChange={(e) => setName(e.target.value)}
                                                />


                                            </div>
                                            <div className='col-span-12 lg:col-span-6'>
                                                <Label htmlFor='branch' require={true}>
                                                    Branch
                                                </Label>
                                                <Select
                                                    id={`branch`}
                                                    name={`branch`}
                                                    value={branchId}
                                                    onChange={(e) => setBranchId(e.target.value)}
                                                >
                                                    <option value="">Select Branch</option>
                                                    {branchData.map((branch: any) => (
                                                        <option key={branch._id} value={branch._id}>
                                                            {branch.name}
                                                        </option>
                                                    ))}
                                                </Select>


                                            </div>
                                            <div className='col-span-12 lg:col-span-12'>
                                                {entries && entries.map((entry: any, index: any) => (
                                                    <>
                                                        <div className='flex items-end justify-end mt-2'>
                                                            {entries.length > 1 && (
                                                                <div className='flex items-end justify-end'>
                                                                    <Button
                                                                        type='button'
                                                                        onClick={() => handleDeleteProduct(index)}
                                                                        variant='outlined'
                                                                        color='red'
                                                                    // isDisable={!privileges.canWrite()}
                                                                    >
                                                                        <svg
                                                                            xmlns='http://www.w3.org/2000/svg'
                                                                            fill='none'
                                                                            viewBox='0 0 24 24'
                                                                            strokeWidth='1.5'
                                                                            stroke='currentColor'
                                                                            data-slot='icon'
                                                                            className='h-6 w-6'>
                                                                            <path
                                                                                strokeLinecap='round'
                                                                                strokeLinejoin='round'
                                                                                d='M6 18 18 6M6 6l12 12'
                                                                            />
                                                                        </svg>
                                                                    </Button>
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div key={index} className='mt-2 grid grid-cols-12 gap-1'>

                                                            <div className='col-span-12 lg:col-span-3'>
                                                                <Label htmlFor={`name-${index}`} require={true}>
                                                                    Products
                                                                </Label>
                                                                <Select
                                                                    placeholder='Select Product'
                                                                    id={`product`}
                                                                    name={`product`}
                                                                    value={entry.product}
                                                                    onChange={(e) => {
                                                                        const updatedEntries = [...entries];
                                                                        updatedEntries[index].product = e.target.value;
                                                                        setEntries(updatedEntries);
                                                                    }}
                                                                >
                                                                    {productsData.map((item: any) => (
                                                                        <option key={item.product._id} value={item.product._id}>
                                                                            {item.product.name}
                                                                        </option>
                                                                    ))}
                                                                </Select>

                                                            </div>
                                                            <div className='col-span-12 lg:col-span-3'>
                                                                <Label htmlFor={`hsn-${index}`} require={true}>
                                                                    Quantity
                                                                </Label>
                                                                <Input
                                                                    type='number'
                                                                    id={`hsn-${index}`}
                                                                    name={`hsn-${index}`}
                                                                    value={entry.quantity}
                                                                    onChange={(e) => {
                                                                        const updatedEntries = [...entries];
                                                                        updatedEntries[index].quantity = e.target.value;
                                                                        setEntries(updatedEntries);
                                                                    }}
                                                                />
                                                            </div>
                                                            <div className='col-span-12 lg:col-span-3'>
                                                                <Label htmlFor={`hsn-${index}`} require={true}>
                                                                    Coating
                                                                </Label>
                                                                <Select
                                                                    placeholder='Select Coating'
                                                                    id={`coating-${index}`}
                                                                    name={`coating-${index}`}
                                                                    value={entry.coating}
                                                                    onChange={(e: any) => {
                                                                        const coatingId = e.target.value;
                                                                        const updatedEntries = [...entries];
                                                                        updatedEntries[index].coating = e.target.value;
                                                                        setEntries(updatedEntries);
                                                                        updateColorOptions(coatingId);

                                                                    }}
                                                                >
                                                                    {coatingData.map((coating: any) => (
                                                                        <option key={coating._id} value={coating._id}>
                                                                            {coating.name}
                                                                        </option>
                                                                    ))}
                                                                </Select>
                                                            </div>
                                                            <div className='col-span-12 lg:col-span-3'>
                                                                <Label htmlFor={`hsn-${index}`} require={true}>
                                                                    Color
                                                                </Label>

                                                                <Select
                                                                    placeholder={entry.color ? getColorName(entry.color, index) : ''}
                                                                    id={`color-${index}`}
                                                                    name={`color-${index}`}

                                                                    value={entry.color}
                                                                    onChange={(e: any) => {
                                                                        const updatedEntries = [...entries];
                                                                        updatedEntries[index].color = e.target.value;
                                                                        setEntries(updatedEntries);
                                                                    }}
                                                                >
                                                                    {colorData.map((color: any) => (
                                                                        <option key={color._id} value={color._id}>
                                                                            {color.name}
                                                                        </option>
                                                                    ))}
                                                                </Select>
                                                            </div>

                                                        </div>

                                                    </>
                                                ))}
                                                <div className='flex mt-2 gap-2 '>
                                                    <Button variant='solid' color='blue' type='button'  icon='HeroPlus' onClick={handleAddEntry}>
                                                        Add Entry
                                                    </Button>
                                                    <Button variant='solid' color='blue' type='button' onClick={handleUpdateEntries} >
                                                        Update  Entries
                                                    </Button>
                                                </div>
                                            </div>

                                        </div>


                                    </div>


                                </Card>
                            </div >
                        </div>
                    </div>
                </div>
            </Container>
        </PageWrapper>
    );
};

export default EditJobModal;
