import React, { useEffect, useState } from 'react';
import { get, post } from '../../../../utils/api-helper.util';
import Card, { CardBody } from '../../../../components/ui/Card';
import Button from '../../../../components/ui/Button';
import Label from '../../../../components/form/Label';
import Input from '../../../../components/form/Input';
import Select from '../../../../components/form/Select';
import { useNavigate } from 'react-router-dom';
import Container from '../../../../components/layouts/Container/Container';
import { toast } from 'react-toastify';
import Collapse from '../../../../components/utils/Collapse';
import { PathRoutes } from '../../../../utils/routes/enum';

const WithoutMaterialPage = () => {
    const [name, setName] = useState('');
    const [branchData, setBranchData] = useState<any>([])
    const [customerData, setCustomerData] = useState([])
    const [branchId, setBranchId] = useState({ id: "", name: '' });
    const [coatingData, setCoatingData] = useState<any>([])
    const [productsData, setProductsData] = useState<any>([]);
    const navigate = useNavigate();
    const [colorDataList, setColorDataList] = useState<Array<any>>([]);
    const [customerOrderData, setCustomerOrderData] = useState<any>([]);
    const [customerOrders, setCustomerOrders] = useState<any>([{ name: '', products: [] }]);
    const [collapsible, setCollapsible] = useState<boolean[]>(customerOrders.map(() => false));
    const [selectedCustomerOrderData, setSelectedCustomerOrderData] = useState<any>(null);

    const getProductDetails = async () => {
        try {
            const { data } = await get('/products');
            console.log('Data of Products', data);
            const productsWithData = data?.data?.filter((item: any) => item.name);
            setProductsData(productsWithData);
        } catch (error) {
            console.error("Error Fetching Products", error);
        }
    }

    const getCustomerOrder = async () => {
        try {
            const { data } = await get('/customer-order')
            setCustomerOrderData(data)
        } catch (error) {

        }
    }

    useEffect(() => {
        getCustomerOrder();
    }, [])

    const fetchCustomers = async () => {
        try {
            const { data: allCustomerData } = await get('/customers')
            setCustomerData(allCustomerData)
        } catch (error: any) {
            console.error('Error fetching users:', error.message);
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
        fetchCustomers()
        getProductDetails();
        getCoatingDetails();
        getBranchDetails();
    }, []);




    const updateColorOptions = (coatingId: any, entryIndex: number) => {
        const selectedCoating = coatingData.find((coating: any) => coating._id === coatingId);
        if (selectedCoating) {
            const newColorDataList = [...colorDataList];
            newColorDataList[entryIndex] = selectedCoating.colors;
            setColorDataList(newColorDataList);
        } else {
            const newColorDataList = [...colorDataList];
            newColorDataList[entryIndex] = [];
            setColorDataList(newColorDataList);
        }
    };

    // const handleSaveData = () => {
    //     // Construct finalValues object
    //     const finalValues = {
    //         customerOrderId: customerOrderId,
    //         products: entries,
    //         withoutMaterial: "true"
    //     };

    //     // Log finalValues object
    //     console.log("Final Values:", finalValues);
    // };

    const handleSaveData = async () => {
        const regularBatches = customerOrders.map((order: any) => ({
            coEntry: order.name.id,
            products: order.products.map((product: any) => ({
                product: product.product,
                quantity: Number(product.quantity),
                coating: product?.coating?._id,
                color: product?.color?._id,
                mm:product?.mm || null
            }))
        }));
        const finalValues: any = {
            name,
            branch: branchId.id,
            batch: [...regularBatches],
            // withoutMaterial: "true"
        };
        console.log("🚀 ~ handleSaveData ~ finalValues:", finalValues)
        try {
            const { data } = await post('jobwm', finalValues);
            console.log("🚀 ~ handleSaveEntries ~ data:", data)
            toast.success('Without Material created successfully!');
            navigate(PathRoutes.jobs)
        } catch (error: any) {
            toast.error('Error Creating Without Material', error);
        }
    };

    const handleAddCustomerOrder = () => {
        setCustomerOrders([...customerOrders, { name: '', products: [] }]);
    };

    const handleDeleteCustomerOrder = (index: any) => {
        const updatedCustomerOrders = [...customerOrders];
        updatedCustomerOrders.splice(index, 1);
        setCustomerOrders(updatedCustomerOrders);
    };

    const toggleCollapse = (index: number) => {
        const updatedCollapsible = [...collapsible];
        updatedCollapsible[index] = !updatedCollapsible[index];
        setCollapsible(updatedCollapsible);
    };

    return (
        <Container>
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
                                                    value={branchId.id}
                                                    placeholder='Select Branch'
                                                    onChange={(e) => {
                                                        const selectedBranchId = e.target.value;
                                                        const selectedBranchName = e.target.options[e.target.selectedIndex].text;
                                                        setBranchId({ id: selectedBranchId, name: selectedBranchName });
                                                    }}
                                                >
                                                    {branchData.map((branch: any) => (
                                                        <option key={branch._id} value={branch._id}>
                                                            {branch.name}
                                                        </option>
                                                    ))}
                                                </Select>
                                            </div>
                                            <div className='col-span-12 lg:col-span-6 mt-3'>
                                                <Button

                                                    variant='outline'
                                                    color='zinc'
                                                    size='lg'
                                                    className='w-64'
                                                    onClick={handleAddCustomerOrder}
                                                >
                                                    Add Customer Order
                                                </Button>

                                            </div>
                                        </div>
                                    </div>
                                </CardBody>
                            </Card>
                        </div >
                    </div>
                </div>
            </div>

            {customerOrders.map((order: any, index: any) => (

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
                                                    rightIcon={
                                                        !collapsible[index]
                                                            ? 'HeroChevronUp'
                                                            : 'HeroChevronDown'
                                                    }
                                                    onClick={() => toggleCollapse(index)}
                                                >
                                                    Customer Order Data
                                                </Button>
                                            </div>
                                        </div>
                                        <Collapse isOpen={!collapsible[index]}>
                                            <div>

                                                <div className='flex items-end justify-end mt-2'>
                                                    {customerOrders.length > 1 && (
                                                        <div className='flex items-end justify-end'>
                                                            <Button
                                                                type='button'
                                                                onClick={() => handleDeleteCustomerOrder(index)}
                                                                variant='outlined'
                                                                color='red'
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
                                                <div className='mt-2 grid grid-cols-12 gap-1'>

                                                    <div key={index} className='col-span-12 lg:col-span-4'>
                                                        <Label htmlFor={`customerOrder${index}`}>
                                                            Customer Order {index + 1}
                                                            <span className='ml-1 text-red-500'>*</span>
                                                        </Label>
                                                        <Select
                                                            id={`customerOrder${index}`}
                                                            name={`customerOrder${index}`}
                                                            value={order._id}
                                                            placeholder='Select Customer Order'
                                                            onChange={(e) => {
                                                                console.log('order name', order.name.name)
                                                                const selectedOrderId = e.target.value;
                                                                const selectedOrderName = e.target.options[e.target.selectedIndex].text;
                                                                const updatedOrders = customerOrders.map((orderItem: any, idx: any) => {
                                                                    if (idx === index) {
                                                                        return {
                                                                            ...orderItem,
                                                                            name: { id: selectedOrderId, name: selectedOrderName },
                                                                            products: customerOrderData?.find((co: any) => co._id === selectedOrderId)?.wmproducts || [],
                                                                        };
                                                                    }
                                                                    return orderItem;
                                                                });
                                                                setCustomerOrders(updatedOrders);
                                                                setSelectedCustomerOrderData(selectedOrderId); // Set the selected order ID
                                                            }}
                                                        >
                                                            {customerOrderData?.map((co: any) => {
                                                                return (
                                                                    <option key={co._id} value={co._id}>
                                                                        {co.customer.name}
                                                                    </option>
                                                                );
                                                            })}
                                                        </Select>
                                                    </div>

                                                    {order.products.map((product: any, productIndex: any) => (
                                                        <div key={productIndex} className='col-span-12 lg:col-span-12 grid grid-cols-12 gap-1'>
                                                            <div className='col-span-12 lg:col-span-2'>
                                                                <Label htmlFor={`product${productIndex}`}>
                                                                    Product {productIndex + 1}
                                                                </Label>
                                                                <Input
                                                                    type='text'
                                                                    id={`product${productIndex}`}
                                                                    name={`product${productIndex}`}
                                                                    value={product.product}
                                                                    disabled
                                                                />
                                                            </div>
                                                            <div className='col-span-12 lg:col-span-2'>
                                                                <Label htmlFor={`quantity${productIndex}`}>
                                                                    Quantity
                                                                </Label>
                                                                <Input
                                                                    type='text'
                                                                    id={`pickQuantity${productIndex}`}
                                                                    name={`pickQuantity${productIndex}`}
                                                                    value={product.quantity}
                                                                    onChange={(e) => {
                                                                        const updatedProduct = { ...product, quantity: e.target.value };
                                                                        const updatedProducts = [...order.products];
                                                                        updatedProducts[productIndex] = updatedProduct;
                                                                        const updatedOrders = [...customerOrders];
                                                                        updatedOrders[index].products = updatedProducts;
                                                                        setCustomerOrders(updatedOrders);
                                                                    }}
                                                                />
                                                            </div>

                                                            <div className='col-span-12 lg:col-span-2'>

                                                                <Label htmlFor={`coating${productIndex}`}>
                                                                    Coating
                                                                </Label>
                                                                <Input
                                                                    type='text'
                                                                    id={`coating${productIndex}`}
                                                                    name={`coating${productIndex}`}
                                                                    value={product?.coating?.name}
                                                                    disabled
                                                                />
                                                            </div>
                                                            <div className='col-span-12 lg:col-span-2'>
                                                                <Label htmlFor={`color${productIndex}`}>
                                                                    Color
                                                                </Label>
                                                                <Input
                                                                    type='text'
                                                                    id={`color${productIndex}`}
                                                                    name={`color${productIndex}`}
                                                                    value={product?.color?.name}
                                                                    disabled
                                                                />
                                                            </div>
                                                            <div className='col-span-12 lg:col-span-2'>
                                                                <Label htmlFor={`mm${productIndex}`}>
                                                                    MM
                                                                </Label>
                                                                <Input
                                                                    type='text'
                                                                    id={`mm${productIndex}`}
                                                                    name={`mm${productIndex}`}
                                                                    value={product?.mm}
                                                                    disabled
                                                                />
                                                            </div>        
                                                            <div className='col-span-12 lg:col-span-1 mt-[20px]'>
                                                                <Button
                                                                    variant='outlined'
                                                                    color='red'
                                                                    onClick={() => {
                                                                        const updatedProducts = [...order.products];
                                                                        updatedProducts.splice(productIndex, 1);
                                                                        const updatedOrders = [...customerOrders];
                                                                        updatedOrders[index].products = updatedProducts;
                                                                        setCustomerOrders(updatedOrders);
                                                                    }}
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
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </Collapse>

                                    </CardBody>
                                </Card>
                            </div >
                        </div>
                    </div>
                </div>
            ))
            }
            <div className='flex h-full flex-wrap content-start'>
                <div className='m-5 mb-4 grid w-full grid-cols-6 gap-1'>
                    <div className='col-span-12 flex flex-col gap-1 xl:col-span-6'>
                        <div className='col-span-12 flex flex-col gap-1 xl:col-span-6'>
                            <Card>
                                <CardBody>
                                    <div className='flex mt-2 gap-2 '>
                                        <Button variant='solid' color='blue' type='button' onClick={handleSaveData}>
                                            SaveData
                                        </Button>
                                    </div>
                                </CardBody>
                            </Card>
                        </div >
                    </div>
                </div>
            </div>
            {/* <div className='mt-2 grid grid-cols-12 gap-1'>
                <div className='col-span-12 lg:col-span-4'>
                    <Label htmlFor={`customerOrder`}>
                        Customer Order
                        <span className='ml-1 text-red-500'>*</span>
                    </Label>
                    <Select
                        id={`customerOrder`}
                        name={`customerOrder`}
                        value={customerOrderId}
                        onChange={(e) => setCustomerOrderId(e.target.value)}
                        placeholder='Select Customer Order'
                    >
                        {customerOrderData.map((order: any) => (
                            <option key={order._id} value={order._id}>
                                {order.customer.name}
                            </option>
                        ))}
                    </Select>
                </div>
                <div className='col-span-12 lg:col-span-12'>
                    {entries?.map((entry: any, index: any) => (
                        <>
                            <div className='flex items-end justify-end mt-2'>
                                {entries.length > 1 && (
                                    <div className='flex items-end justify-end'>
                                        <Button
                                            type='button'
                                            onClick={() => handleDeleteProduct(index)}
                                            variant='outlined'
                                            color='red'
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
                                <div className='col-span-12 lg:col-span-2'>
                                    <Label htmlFor={`product`}>
                                        Product
                                        <span className='ml-1 text-red-500'>*</span>
                                    </Label>
                                    <Input
                                        type='text'
                                        id={`product`}
                                        name={`product`}
                                        value={entry.product}
                                        onChange={(e) => {
                                            const updatedEntries = [...entries];
                                            updatedEntries[index].product = e.target.value;
                                            setEntries(updatedEntries);
                                        }}
                                    />
                                </div>
                                <div className='col-span-12 lg:col-span-2'>
                                    <Label htmlFor={`length`}>
                                        Length
                                        <span className='ml-1 text-red-500'>*</span>
                                    </Label>
                                    <Input
                                        type='number'
                                        id={`length`}
                                        name={`length`}
                                        value={entry.length}
                                        onChange={(e) => {
                                            const updatedEntries = [...entries];
                                            updatedEntries[index].length = e.target.value;
                                            setEntries(updatedEntries);
                                        }}
                                    />
                                </div>
                                <div className='col-span-12 lg:col-span-2'>
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
                                <div className='col-span-12 lg:col-span-2'>
                                    <Label htmlFor={`hsn-${index}`}>
                                        Coating
                                        <span className='ml-1 text-red-500'>*</span>
                                    </Label>
                                    <Select
                                        placeholder='Select Coating'
                                        id={`coating-${index}`}
                                        name={`coating-${index}`}
                                        value={entry.coating.id} // Assuming entry.coating is an object containing id and name
                                        onChange={(e: any) => {
                                            const selectedCoatingId = e.target.value;
                                            const selectedCoating = coatingData.find((coating: any) => coating._id === selectedCoatingId);
                                            if (selectedCoating) {
                                                const updatedEntries = [...entries];
                                                updatedEntries[index].coating = {
                                                    id: selectedCoatingId,
                                                    name: selectedCoating.name // Assigning the name property
                                                };
                                                setEntries(updatedEntries);
                                                updateColorOptions(selectedCoatingId, index);
                                            }
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
                                            value={entry.color.id}
                                            onChange={(e: any) => {
                                                const selectedColorId = e.target.value;
                                                const updatedEntries = [...entries];
                                                updatedEntries[index].color = {
                                                    id: selectedColorId,
                                                    name: e.target.selectedOptions[0].text
                                                };
                                                setEntries(updatedEntries);
                                            }}
                                        >
                                            {colorDataList[index]?.map((color: any) => (
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
                        <Button variant='solid' color='blue' type='button' onClick={handleSaveData}>
                            SaveData
                        </Button>
                    </div>
                </div>
            </div> */}

        </Container>

    );
};

export default WithoutMaterialPage;