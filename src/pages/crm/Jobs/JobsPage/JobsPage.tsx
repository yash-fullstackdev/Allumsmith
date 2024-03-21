import React, { useEffect, useState } from 'react';
import { get, post } from '../../../../utils/api-helper.util';
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


const JobsPage = () => {
    const [entries, setEntries] = useState<any>([{ product: '', quantity: '', coating: '', color: '' }]);
    const [name, setName] = useState('');
    const [branchData, setBranchData] = useState<any>([])
    const [coatingData, setCoatingData] = useState<any>([])
    const [productsData, setProductsData] = useState<any>([]);
    const [colorData, setColorData] = useState([]);
    const [branchId, setBranchId] = useState('');
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
    useEffect(() => {
        getInventoryDetails();
        getBranchDetails();
        getCoatingDetails();

    }, []);

    const handleAddEntry = () => {
        setEntries([...entries, { product: '', quantity: '', coating: '', color: '' }]);
    };



    const handleSaveEntries = async () => {
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
            const { data } = await post('/jobs', finalValues);
            toast.success('Job Created Successfully!');

        } catch (error: any) {
            console.error("Error Adding Job", error);
            toast.error('Error Creating Job', error);
        } finally {
            navigate(PathRoutes.jobs)
        }

    };

    const handleDeleteProduct = (index: any) => {
        const newProduct = [...entries]
        newProduct.splice(index, 1)
        setEntries(newProduct)
    }





    const updateColorOptions = (coatingId: any) => {
        const selectedCoating = coatingData.find((coating: any) => coating._id === coatingId);
        if (selectedCoating) {
            setColorData(selectedCoating.colors);
        } else {
            setColorData([]);
        }
    }

    return (
        <PageWrapper name='ADD PRODUCTS' isProtectedRoute={true}>
            <Subheader>
                <SubheaderLeft>
                    <Button
                        icon='HeroArrowLeft'
                        className='!px-0'
                        onClick={() => navigate(`${PathRoutes.jobs}`)}
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
                                                    Add Jobs
                                                </Button>
                                            </div>
                                        </div>
                                        <div>
                                            <div className='mt-2 grid grid-cols-12 gap-1'>
                                                <div className='col-span-12 lg:col-span-6'>
                                                    <Label htmlFor='name'>
                                                        Name
                                                        <span className='ml-1 text-red-500'>*</span>
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
                                                    <Label htmlFor='branch'>
                                                        Branch
                                                        <span className='ml-1 text-red-500'>*</span>
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
                                                    {entries.map((entry: any, index: any) => (
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
                                                                    <Label htmlFor={`name-${index}`}>
                                                                        Products
                                                                        <span className='ml-1 text-red-500'>*</span>
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
                                                                    <Label htmlFor={`hsn-${index}`}>
                                                                        Quantity
                                                                        <span className='ml-1 text-red-500'>*</span>
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
                                                                    <Label htmlFor={`hsn-${index}`}>
                                                                        Coating
                                                                        <span className='ml-1 text-red-500'>*</span>
                                                                    </Label>
                                                                    <Select
                                                                        placeholder='Select Coating'
                                                                        id={`coating-${index}`}
                                                                        name={`coating-${index}`}
                                                                        value={entry.coating._id} // Use coating _id as the value
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
                                                                {entry.coating &&
                                                                    (<div className='col-span-12 lg:col-span-3'>
                                                                        <Label htmlFor={`hsn-${index}`}>
                                                                            Color
                                                                            <span className='ml-1 text-red-500'>*</span>
                                                                        </Label>
                                                                        <Select
                                                                            placeholder='Select Color'
                                                                            id={`color-${index}`}
                                                                            name={`color-${index}`}
                                                                            value={entry.color} // Use color value from state
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
                                                                    </div>)}

                                                            </div>

                                                        </>
                                                    ))}
                                                    <div className='flex mt-2 gap-2 '>
                                                        <Button variant='solid' color='blue' type='button' onClick={handleAddEntry}>
                                                            Add Entry
                                                        </Button>
                                                        <Button variant='solid' color='blue' type='button' onClick={handleSaveEntries} >
                                                            Save Entries
                                                        </Button>
                                                    </div>
                                                </div>

                                            </div>


                                        </div>

                                    </CardBody>
                                </Card>
                            </div >
                        </div>
                    </div>
                </div>
            </Container>
        </PageWrapper>
    );
};

export default JobsPage;
