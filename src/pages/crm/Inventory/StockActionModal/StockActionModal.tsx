/* eslint-disable react/react-in-jsx-scope */
import React, { useEffect, useState } from 'react';
import { get, post } from '../../../../utils/api-helper.util';
import Card, { CardBody } from '../../../../components/ui/Card';
import Button from '../../../../components/ui/Button';
import Label from '../../../../components/form/Label';
import Input from '../../../../components/form/Input';
import Select from '../../../../components/form/Select';
import { toast } from 'react-toastify';
import { Switch } from '@mui/material';
import SelectReact from '../../../../components/form/SelectReact';



const StockActionModal = ({ SetStockActionModal }: any) => {
    const [entries, setEntries] = useState<any>([{ product: '', requiredQuantity: '', }]);
    const [fromBranchId, setFromBranchId] = useState('');
    const [toBranchId, setToBranchId] = useState('');
    const [allBranchData, setAllBranchData] = useState([])
    const [productListData, setProductListData] = useState<any>([])
    console.log("🚀 ~ StockActionModal ~ productListData:", productListData)
    const [branchTransfer, setBranchTransfer] = useState(false)
    const [actionType, setActionType] = useState("")


    // TO:DO MAYBE REQURIED IN FUTURE
    // const handleAddEntry = () => {
    //     setEntries([...entries, { product: '', requiredQuantity: '', }]);
    // };



    const handleSaveEntries = async () => {

        if (!branchTransfer) {
            console.log("in if ")
            const submitedData = {
                product: entries && entries[0]?.product,
                quantity: entries && entries[0]?.requiredQuantity,
                fromBranch: fromBranchId,
                toBranch: toBranchId
            }
            try {
                const { data } = await post("/stock-actions/b2btransfer", submitedData);
                console.log("data", data)
                toast.success('Stock Action Completed');
                SetStockActionModal();
            } catch (error) {
                console.error("Error Adding stocks", error);
            }
            console.log("in if ", submitedData)
        } else {
            const submitedData = {
                product: entries && entries[0]?.product,
                quantity: entries && entries[0]?.requiredQuantity,
                branch: toBranchId,
                actionType: actionType
            }
            try {
                const { data } = await post("/stock-actions", submitedData);
                console.log("data", data)
                toast.success('Stock Action Completed');
                SetStockActionModal();
            } catch (error:any) {
                console.error("Error Adding stocks", error);
                toast.error(error?.response.data.message,error)
            }
        }
    };

    const handleDeleteProduct = (index: any) => {
        const newProduct = [...entries]
        newProduct.splice(index, 1)
        setEntries(newProduct)
    }

    const fetchData = async () => {

        try {
            const { data: allProductList } = await get(`/products`);
            setProductListData(allProductList);
        } catch (error: any) {
            console.error('Error fetching users:', error.message);
        } finally {
        }
    };

    const fetchAllBranches = async () => {
        try {
            const { data: allVendorData } = await get('/branches')
            setAllBranchData(allVendorData)
        } catch (error: any) {
            console.error('Error fetching users:', error.message);
        }
    }

    useEffect(() => {
        fetchAllBranches();
        fetchData();
    }, [])

    return (
        <div className='col-span-12 flex flex-col gap-1 xl:col-span-6'>
            <Card>
                <CardBody>
                    <div className='flex items-center justify-center' >
                        <h4>Branch to branch</h4>  <Switch {...Label} checked={branchTransfer} onClick={() => setBranchTransfer(!branchTransfer)} /><h4>Stock Action</h4>
                    </div>
                    <div>
                        {!branchTransfer ? (
                            <div>
                                <div className='col-span-4 lg:col-span-4 mt-5'>
                                    <Label htmlFor='fromBranch'>
                                        From Branch
                                        <span className='ml-1 text-red-500'>*</span>
                                    </Label>
                                    <Select
                                        id='fromBranch'
                                        name='fromBranch'
                                        value={fromBranchId}
                                        placeholder='Select Branch'
                                        onChange={(e: any) => {
                                            console.log(e.target.value)
                                            setFromBranchId(e.target.value)
                                        }}
                                    >
                                        {allBranchData &&
                                            allBranchData.length > 0 &&
                                            allBranchData?.map((data: any) => (
                                                <option key={data._id} value={data._id}>
                                                    {data.name}
                                                </option>
                                            ))}
                                    </Select>

                                </div>
                                <div className='col-span-4 lg:col-span-4 mt-5'>
                                    <Label htmlFor='toBranch'>
                                        To Branch
                                        <span className='ml-1 text-red-500'>*</span>
                                    </Label>
                                    <Select
                                        id='toBranch'
                                        name='toBranch'
                                        value={toBranchId}
                                        placeholder='Select Branch'
                                        onChange={(e: any) => {
                                            console.log(e.target.value)
                                            setToBranchId(e.target.value)
                                        }}
                                    >
                                        {allBranchData &&
                                            allBranchData.length > 0 &&
                                            allBranchData?.map((data: any) => (
                                                <option key={data._id} value={data._id}>
                                                    {data.name}
                                                </option>
                                            ))}
                                    </Select>

                                </div>
                            </div>
                        ) : (
                            <>
                                <div className='col-span-4 lg:col-span-4 mt-5'>
                                    <Label htmlFor='toBranch'>
                                        Branch
                                        <span className='ml-1 text-red-500'>*</span>
                                    </Label>
                                    <Select
                                        id='toBranch'
                                        name='toBranch'
                                        value={toBranchId}
                                        placeholder='Select Branch'
                                        onChange={(e: any) => {
                                            console.log(e.target.value)
                                            setToBranchId(e.target.value)
                                        }}
                                    >
                                        {allBranchData &&
                                            allBranchData.length > 0 &&
                                            allBranchData?.map((data: any) => (
                                                <option key={data._id} value={data._id}>
                                                    {data.name}
                                                </option>
                                            ))}
                                    </Select>

                                </div>
                                <div className='col-span-4 lg:col-span-4 mt-5'>
                                    <Label htmlFor='actionType'>
                                        Action Type
                                        <span className='ml-1 text-red-500'>*</span>
                                    </Label>
                                    <Select
                                        id='actionType'
                                        name='actionType'
                                        value={actionType}
                                        placeholder='Select Action Type'
                                        onChange={(e: any) => {
                                            setActionType(e.target.value)
                                        }}
                                    >
                                        <option value="add">
                                            PURCHASE
                                        </option>
                                        <option value="sub">
                                            SELL
                                        </option>
                                    </Select>
                                </div>
                            </>
                        )
                        }
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
                                <div key={index} className='mt-2 grid grid-cols-4 gap-1'>

                                    <div className='col-span-12 lg:col-span-2'>
                                        <Label htmlFor={`name-${index}`}>
                                            Products
                                            <span className='ml-1 text-red-500'>*</span>
                                        </Label>
                                        {/* <Select
                                            placeholder='Select Product'
                                            id={`product-${index}`}
                                            name={`product-${index}`}
                                            value={entry.product}
                                            onChange={(e: any) => {
                                                const updatedEntries = [...entries];
                                                updatedEntries[index].product = e.target.value;
                                                setEntries(updatedEntries);
                                            }}
                                        >
                                            {productListData.map((data: any) => (
                                                <option key={data._id} value={data._id}>  {/* Set value to product ID */}
                                        {/* {data.name}

                                                </option>
                                            ))}
                                        </Select> */}
                                        <SelectReact
                                            id={`product-${index}`}
                                            name={`product-${index}`}
                                            options={productListData.map((product: any) => ({ value: product._id, label: `${product.name} (${product.productCode} ) (${product.length} )` }))}
                                            // value={{ value: entry.product, label: productListData.find((product: any) => product._id === entry.product)?.`${name} ${productCode} ${productCode} ` }}
                                            value={{
                                                value: entry.product,
                                                label: productListData.find((product: any) => product._id === entry.product)
                                                    ? `${productListData.find((product: any) => product._id === entry.product)?.name} (${productListData.find((product: any) => product._id === entry.product)?.productCode}) (${productListData.find((product: any) => product._id === entry.product)?.length})`
                                                    : ''
                                            }}
                                            onChange={(selectedOption: any) => {
                                                const selectedProductName = productListData.find((product: any) => product._id === selectedOption.value)?.name;
                                                const updatedEntries = [...entries];
                                                updatedEntries[index].product = selectedOption.value;
                                                setEntries(updatedEntries);
                                                const dropdown: any = document.getElementById(`product-${index}`);
                                                if (dropdown) {
                                                    dropdown.querySelector('.select__single-value').textContent = selectedProductName;
                                                }
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
                                            value={entry.requiredQuantity}
                                            min={0}
                                            onChange={(e) => {
                                                const updatedEntries = [...entries];
                                                updatedEntries[index].requiredQuantity = e.target.value;
                                                setEntries(updatedEntries);
                                            }}
                                        />
                                        {/* ... Error handling for hsn field */}
                                    </div>

                                </div>
                            </>
                        ))}
                    </div>
                    <div className='flex mt-2 gap-2 '>
                        {/* TO:DO MAYBE REQUIRED IN FUTURE */}
                        {/* <Button variant='solid' color='blue' type='button' onClick={handleAddEntry}>
                            Add Entry
                        </Button> */}
                        <Button variant='solid' color='blue' type='button' onClick={handleSaveEntries} >
                            Save Entries
                        </Button>
                    </div>
                </CardBody>
            </Card>
        </div >
    );
};

export default StockActionModal;
