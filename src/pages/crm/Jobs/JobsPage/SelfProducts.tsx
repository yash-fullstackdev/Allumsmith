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
import { toast } from 'react-toastify';

const SelfProducts = ({ entries, setEntries }: any) => {

    const [customerId, setCustomerId] = useState('');
    const [customerData, setCustomerData] = useState([])
    const [coatingData, setCoatingData] = useState<any>([])
    const [productsData, setProductsData] = useState<any>([]);
    const navigate = useNavigate();
    const [productTransfer, setProductTransfer] = useState(false)
    const [colorDataList, setColorDataList] = useState<Array<any>>([]);


    const getProductDetails = async () => {
        try {
            const { data } = await get('/products');
            console.log('Data of Products', data);
            const productsWithData = data.filter((item: any) => item.name);
            setProductsData(productsWithData);
        } catch (error) {
            console.error("Error Fetching Products", error);
        }
    }



    const fetchCustomers = async () => {
        try {
            const { data: allCustomerData } = await get('/customers')
            setCustomerData(allCustomerData)
        } catch (error: any) {
            console.error('Error fetching users:', error.message);
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


    }, []);

    const handleAddEntry = () => {
        setEntries([...entries, { product: '', quantity: '', coating: '', color: '' }]);
    };



    const handleDeleteProduct = (index: any) => {
        const newProduct = [...entries]
        newProduct.splice(index, 1)
        setEntries(newProduct)
    }


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

    return (

        <div>
            <div className='mt-2 grid grid-cols-12 gap-1'>

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
                                {!productTransfer ? (<>
                                    <div className='col-span-12 lg:col-span-2'>
                                        <Label htmlFor={`name-${index}`}>
                                            Products
                                            <span className='ml-1 text-red-500'>*</span>
                                        </Label>
                                        <Select
                                            placeholder='Select Product'
                                            id={`product-${index}`}
                                            name={`product-${index}`}
                                            value={entry.product.id} // Assuming entry.product is an object containing id and name
                                            onChange={(e) => {
                                                const selectedProductId = e.target.value;
                                                const selectedProduct = productsData.find((product: any) => product._id === selectedProductId);
                                                if (selectedProduct) {
                                                    const updatedEntries = [...entries];
                                                    updatedEntries[index].product = {
                                                        id: selectedProductId,
                                                        name: selectedProduct.name // Assigning the name property
                                                    };
                                                    setEntries(updatedEntries);
                                                }
                                            }}
                                        >
                                            {productsData.map((item: any) => (
                                                <option key={item._id} value={item._id}>
                                                    {`${item.name} (${item.productCode})`}
                                                </option>
                                            ))}
                                        </Select>

                                    </div>

                                </>
                                )
                                    : (<>
                                        <div className='col-span-12 lg:col-span-3'>
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

                                    </>)}
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
                                            value={entry.color.id} // Assuming entry.color is an object containing id and name
                                            onChange={(e: any) => {
                                                const selectedColorId = e.target.value;
                                                const updatedEntries = [...entries];
                                                updatedEntries[index].color = {
                                                    id: selectedColorId,
                                                    name: e.target.selectedOptions[0].text // Assigning the name property
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

                    </div>
                </div>
            </div>
        </div>

    );
};

export default SelfProducts;