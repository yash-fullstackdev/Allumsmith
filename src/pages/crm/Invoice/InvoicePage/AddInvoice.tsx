import { useEffect, useState } from 'react';
import {
    createColumnHelper,
} from '@tanstack/react-table';
import PageWrapper from '../../../../components/layouts/PageWrapper/PageWrapper';
import Container from '../../../../components/layouts/Container/Container';
import Card, {
    CardBody,
} from '../../../../components/ui/Card';

import { get, post } from '../../../../utils/api-helper.util';
import Select from '../../../../components/form/Select';
import Button from '../../../../components/ui/Button';
import { toast } from 'react-toastify';
import Input from '../../../../components/form/Input';
import Subheader, { SubheaderLeft, SubheaderRight, SubheaderSeparator } from '../../../../components/layouts/Subheader/Subheader';
import Label from '../../../../components/form/Label';
import { useNavigate } from 'react-router';
import { PathRoutes } from '../../../../utils/routes/enum';
import SelectReact from '../../../../components/form/SelectReact';
import Textarea from '../../../../components/form/Textarea';
import Checkbox from '../../../../components/form/Checkbox';
import FieldWrap from '../../../../components/form/FieldWrap';



const AddInvoice = () => {
    const navigate = useNavigate();
    const [entries, setEntries] = useState<any>([{ product_id: '', customer_id: '', delivered_quantity: '', customer_email: '', customer_number: '', alluminium_rate: '', coating_discount: '', customer_discount: '', gst: 0, tax: 0, total_amount: '', origin_point: '', delivery_point: '', totalProductweight: 0 }]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [customerList, setCustomerList] = useState<any[]>([]);
    const [purchaseOrderData, setPurchaseOrderData] = useState<any>({});
    const [customerId, setCustomerId] = useState<any>('');
    const [branchId, setBranchId] = useState<any>('');
    const [deliveredQuantities, setDeliveredQuantities] = useState<Array<number>>([]);
    const [quantityAndDiscounts, setQuantityAndDiscounts] = useState<any[]>([]);
    const [totalAmount, setTotalAmount] = useState<any>(0);
    const [invoiceNumber, setInvoiceNumber] = useState<any>('');
    const [branch, setBranch] = useState<any>([]);
    const [totalWeights, setTotalWeights] = useState<Array<number>>([]);
    const [totalCoatingRate, setTotalCoatingRate] = useState<Array<number>>([]);
    const [totalProductWeight, setTotalProducWeight] = useState<any>(0);
    const [totalProductPrice, setTotalProductPrice] = useState<number>(0);
    const [alluminiumRate, setAlluminiumRate] = useState<any>();
    const [finalCoatingPrice, setFinalCoatingPrice] = useState<number>(0);
    const [discount, setDiscount] = useState<number>(0);
    const [amountBeforeTaxAndGst, setAmountBeforeTaxAndGst] = useState<number>(0);

    const getCustomerName = async () => {
        setIsLoading(true);
        try {
            const { data: customerList } = await get(`/customer-order`);
            setCustomerList(customerList);
            setIsLoading(false);
        } catch (error: any) {
            console.error('Error fetching users:', error.message);
            setIsLoading(false);
        } finally {
            setIsLoading(false);
        }
    };
    const getPurchaseOrderByid = async () => {
        try {
            const { data: allPurchaseOrderById } = await get(`/customer-order/${customerId}`);
            setPurchaseOrderData(allPurchaseOrderById);
        } catch (error: any) {
            console.error('Error fetching users:', error.message);
        } finally {
        }
    };
    const getCounterValue = async () => {
        const { data } = await get('/counter/invoiceCounter');
        setInvoiceNumber(`I${data.value}`)
    }
    useEffect(() => {
        getCounterValue();
        getAllBranch()
        getCustomerName()
        getPurchaseOrderByid()
    }, [customerId])

    const handleDeleteProduct = (index: number) => {
        const updatedEntries = [...purchaseOrderData.entries];
        updatedEntries.splice(index, 1);
        setPurchaseOrderData({ ...purchaseOrderData, entries: updatedEntries });
    };


    const handleSendMailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEntries({ ...entries, send_mail: e.target.checked });
    };

    // const handleDeliveredQuantityChange = (value: any, index: number) => {
    //     const updatedDeliveredQuantities = [...deliveredQuantities];
    //     updatedDeliveredQuantities[index] = parseFloat(value);
    //     setDeliveredQuantities(updatedDeliveredQuantities);
    // };
    const handleDeliveredQuantityChange = (value: any, index: number) => {
        const updatedDeliveredQuantities = [...deliveredQuantities];
        updatedDeliveredQuantities[index] = parseFloat(value);
        setDeliveredQuantities(updatedDeliveredQuantities);

        // Calculate total weight for the current entry
        const totalWeight = purchaseOrderData.entries[index]?.product?.weight * parseFloat(value);
        const updatedTotalWeights = [...totalWeights];
        updatedTotalWeights[index] = parseFloat(totalWeight.toFixed(2));
        setTotalWeights((updatedTotalWeights));
        console.log(purchaseOrderData)
        const totalRate = purchaseOrderData.entries[index]?.coating?.coating_rate ? purchaseOrderData.entries[index]?.product?.length * parseFloat(value) * purchaseOrderData.entries[index]?.coating?.coating_rate : purchaseOrderData.entries[index]?.product?.length * parseFloat(value) * purchaseOrderData.entries[index]?.coating_rate;
        const updatedTotalCoatingRate = [...totalCoatingRate];
        updatedTotalCoatingRate[index] = parseFloat(totalRate.toFixed(2));
        setTotalCoatingRate(updatedTotalCoatingRate);
    };

    const handleTotalWeight = (index: number) => {
        return totalWeights[index] || 0;
    }

    const handleTotalCoatingRate = (index: number) => {
        return totalCoatingRate[index] || 0
    }


    const calculateTotalAmount = () => {
        const gst: number = entries.gst
        const tax: number = entries.tax

        const myTotalCoatingPrice: number = finalCoatingPrice
        const myProductPrice: number = totalProductPrice
        const estimateGrandTotal: number = myTotalCoatingPrice + myProductPrice
        setAmountBeforeTaxAndGst(estimateGrandTotal);

        const amountAfterGst = estimateGrandTotal * (gst / 100)
        const amountAfterTax = estimateGrandTotal * (tax / 100)

        return parseFloat((estimateGrandTotal + amountAfterGst + amountAfterTax).toFixed(2));
    };

    const getAllBranch = async () => {
        try {
            const { data } = await get('/branches');
            // Update origin_point for each entry
            setBranch(data);
        } catch (error) {
            console.error('Error fetching branches:', error);
        }
    };

    const calcTotalWeight = () => {
        let weight = 0;
        totalWeights.forEach((data: any) => (
            weight += data
        ));
        let totalWeight = weight || 0;
        setTotalProducWeight(totalWeight);
    }

    const calculateTotalCoatingPrice = () => {
        let estimateCoatingPrice: number = 0;
        totalCoatingRate.forEach((item: number) => {
            estimateCoatingPrice += item
        })
        estimateCoatingPrice = (estimateCoatingPrice) * (1 - (discount / 100));
        setFinalCoatingPrice(estimateCoatingPrice || 0)
    }
    useEffect(() => {
        calculateTotalCoatingPrice();
    }, [discount])
    const calculateTotalProductPrice = (alluminiumRate: number, totalProductWeight: number) => {
        const totalPrice = alluminiumRate * totalProductWeight
        setTotalProductPrice(parseFloat(totalPrice.toFixed(2)))
    }

    useEffect(() => {
        calcTotalWeight();
    }, [totalWeights]);

    useEffect(() => {
        calculateTotalCoatingPrice()
    }, [totalCoatingRate])

    useEffect(() => {
        if (purchaseOrderData?.entries?.length > 0) {

            const grandTotal = calculateTotalAmount();
            setTotalAmount(grandTotal);
        }
    }, [totalProductPrice, finalCoatingPrice, entries.gst, entries.tax]);

    useEffect(() => {
        calculateTotalProductPrice(alluminiumRate, totalProductWeight)
    }, [alluminiumRate, totalProductWeight])

    const handleSaveEntries = async () => {
        let amountBeforeTax = 0; // Initialize amountBeforeTax variable

        try {
            // Calculate total specificProductPrice
            const totalSpecificProductPrice = purchaseOrderData.entries.reduce((acc: number, entry: any, index: number) => {
                const specificProductPrice = entry.product?.weight * parseInt(entry.product?.rate) * deliveredQuantities[index];
                return acc + (specificProductPrice || 0);
            }, 0);

            // Calculate total coatingTotal
            const totalCoatingTotal = purchaseOrderData.entries.reduce((acc: number, entry: any, index: number) => {
                const coatingTotal = (parseFloat(entry.coating?.coatingWeight) || 0) * parseFloat(entry.coating.rate);
                const finalCoatingTotal = coatingTotal - (coatingTotal * (parseFloat(quantityAndDiscounts[index]?.coating_discount) || 0) / 100);
                return acc + (finalCoatingTotal || 0);
            }, 0);

            // Calculate amountBeforeTax
            amountBeforeTax = totalSpecificProductPrice + totalCoatingTotal;



            const payload = {
                customerOrder_id: purchaseOrderData._id || '',
                customerName: purchaseOrderData.customer?._id || '',
                customerEmail: purchaseOrderData.customer?.email || '',
                customerPhone: purchaseOrderData.customer?.phone || '',
                products: purchaseOrderData.entries.map((entry: any, index: any) => {
                    const specificProductPrice = entry.product?.weight * parseInt(entry.product?.rate) * deliveredQuantities[index];
                    const coatingTotal = (entry.coating?.coatingWeight || 0) * entry.coating.rate;
                    const finalCoatingTotal = coatingTotal - (coatingTotal * (parseFloat(quantityAndDiscounts[index]?.coating_discount) || 0) / 100)
                    const amount = specificProductPrice + finalCoatingTotal;
                    let finalPayload = {}
                    if (entry?.mm) {
                        finalPayload = {
                            product: entry.product._id,
                            name: entry?.product?.name,
                            color: entry.color?._id || '',
                            coating: entry.coating?._id || '',
                            delieveryQuantity: deliveredQuantities[index] || '',
                            weight: parseFloat(entry?.product?.weight) || '',
                            length: entry.product?.length || '',
                            rate: entry.product?.rate || '',
                            coatingRate: parseFloat(entry.coating_rate),
                            coatingName: entry?.coating?.name,
                            mm: entry?.mm,
                            total_weight: totalWeights[index] || 0,
                            toatl_coating_rate: totalCoatingRate[index] || 0
                        };
                    } else {
                        finalPayload = {
                            product: entry.product._id,
                            name: entry?.product?.name,
                            color: entry.color?._id || '',
                            coating: entry.coating?._id || '',
                            delieveryQuantity: deliveredQuantities[index] || '',
                            weight: parseFloat(entry?.product?.weight) || '',
                            length: entry.product?.length || '',
                            rate: entry.product?.rate || '',
                            coatingRate: parseFloat(entry.coating_rate),
                            coatingName: entry?.coating?.name,
                            total_weight: totalWeights[index] || 0,
                            total_coating_rate: totalCoatingRate[index] || 0,
                        }
                    }
                    return finalPayload;
                }),
                send_mail: entries.send_mail || false,
                gst: parseFloat(entries.gst) || '',
                other_tax: parseFloat(entries.tax) || '',
                totalAmount: parseFloat(totalAmount) || '',
                origin_point: branchId || '',
                delivery_point: entries.delivery_point || '',
                totalCoatingCharges: finalCoatingPrice,
                totalProductPrice: totalProductPrice,
                amountBeforeTax: amountBeforeTaxAndGst,
                discount,
                invoiceNumber,

            };
            console.log('Payload', payload);

            const respones = await post('/invoice', payload)
            console.log('Response:', respones);
            toast.success('Invoice Generated Successfully')
            navigate(PathRoutes.invoice_list)
        } catch (error) {
            console.error('Error saving data:', error);
        }
    };


    return (
        <PageWrapper name='ADD INVOICE' isProtectedRoute={true}>
            <Subheader>
                <SubheaderLeft>
                    <Button
                        icon='HeroArrowLeft'
                        className='!px-0'
                        onClick={() => navigate(`${PathRoutes.invoice_list}`)}
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
                                                    Add Invoice
                                                </Button>
                                            </div>
                                        </div>
                                        <div>
                                            <div className='mt-2 grid grid-cols-12 gap-1'>
                                                <div className='col-span-4 lg:col-span-3 mt-5'>
                                                    <Label htmlFor='customerName'>
                                                        Customer
                                                        <span className='ml-1 text-red-500'>*</span>
                                                    </Label>

                                                    <SelectReact
                                                        id='customerName'
                                                        name='customerName'
                                                        options={customerList.map((data: any) => ({
                                                            value: data._id,
                                                            label: `${data.customer.name} (${data?.customerOrderNumber || 'NA'})`
                                                        }))}
                                                        value={{ value: customerId, label: customerList.find((customer: any) => customer._id === customerId)?.customer.name || 'Select Customer' }}
                                                        onChange={(selectedOption: any) => {
                                                            setCustomerId(selectedOption.value);
                                                        }}
                                                    />

                                                </div>
                                                <div className='col-span-4 lg:col-span-3 mt-5'>
                                                    <Label htmlFor='customerName'>
                                                        Inovice Number
                                                        <span className='ml-1 text-red-500'>*</span>
                                                    </Label>
                                                    <Input
                                                        id='invoiceNumber'
                                                        name='invoiceNumber'
                                                        value={invoiceNumber}

                                                        disabled

                                                    />
                                                </div>
                                                {
                                                    customerId && customerId !== '' && <>
                                                        <div className='col-span-4 lg:col-span-3 mt-5'>
                                                            <Label htmlFor='customerName'>
                                                                Customer Email
                                                                <span className='ml-1 text-red-500'>*</span>
                                                            </Label>
                                                            <Input
                                                                type='text'
                                                                value={purchaseOrderData && purchaseOrderData?.customer?.email}
                                                                name="customer_email"
                                                                disabled
                                                            />
                                                        </div>
                                                        <div className='col-span-4 lg:col-span-3 mt-5'>
                                                            <Label htmlFor='customerName'>
                                                                Customer Number
                                                                <span className='ml-1 text-red-500'>*</span>
                                                            </Label>
                                                            <Input
                                                                type='text'
                                                                value={purchaseOrderData && purchaseOrderData?.customer?.phone}
                                                                name="customer_number"
                                                                disabled

                                                            />
                                                        </div>
                                                    </>
                                                }
                                                <div className='col-span-12 lg:col-span-12'>
                                                    {customerId && Array.isArray(purchaseOrderData.entries) && purchaseOrderData.entries.map((entry: any, index: number) => {
                                                        return (<>
                                                        {console.log(entry)}
                                                            <div className='flex items-end justify-end mt-2'>
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
                                                            </div>
                                                            <div className='mt-2 grid grid-cols-12 gap-1' key={entry._id}>
                                                                <div className='col-span-12 lg:col-span-3 '>
                                                                    <Label htmlFor="name tex" className='!text-sm'>
                                                                        Name
                                                                        <span className='ml-1 text-red-500'>*</span>
                                                                    </Label>
                                                                    <Input
                                                                        type='text'
                                                                        id={`product${index}`}
                                                                        name={`product${index}`}
                                                                        value={entry?.product?.name}
                                                                        disabled
                                                                    />
                                                                </div>
                                                                <div className='col-span-12 lg:col-span-1'>
                                                                    <Label htmlFor="name" className='!text-sm'>
                                                                        Length(ft)
                                                                        <span className='ml-1 text-red-500'>*</span>
                                                                    </Label>
                                                                    <Input
                                                                        type='text'
                                                                        id={`product${index}`}
                                                                        name={`product${index}`}
                                                                        value={entry?.product?.length}
                                                                        onChange={(e) => {
                                                                            const updatedProducts = [...purchaseOrderData.entries];
                                                                            updatedProducts[index] = { ...updatedProducts[index], product: { ...updatedProducts[index].product, length: e.target.value } };
                                                                            setPurchaseOrderData({ ...purchaseOrderData, entries: updatedProducts });
                                                                        }}
                                                                    />
                                                                </div>

                                                                <div className='col-span-12 lg:col-span-2'>
                                                                    <Label htmlFor="name" className='!text-sm'>
                                                                        Product Weight(kg)
                                                                        <span className='ml-1 text-red-500'>*</span>
                                                                    </Label>
                                                                    <Input
                                                                        type='number'
                                                                        id={`product${index}`}
                                                                        name={`product${index}`}
                                                                        value={entry?.product?.weight}
                                                                        onChange={(e) => {
                                                                            const updatedProducts = [...purchaseOrderData.entries];
                                                                            updatedProducts[index] = { ...updatedProducts[index], product: { ...updatedProducts[index].product, weight: e.target.value } };
                                                                            setPurchaseOrderData({ ...purchaseOrderData, entries: updatedProducts });
                                                                        }}
                                                                    />
                                                                </div>



                                                                <div className='col-span-12 lg:col-span-2'>
                                                                    <Label htmlFor={`coating`} className='!text-sm'>
                                                                        Coating
                                                                        <span className='ml-1 text-red-500'>*</span>
                                                                    </Label>
                                                                    <Input
                                                                        type='text'
                                                                        id={`coating${index}`}
                                                                        name={`coating${index}`}
                                                                        value={entry?.coating?.name}
                                                                        disabled
                                                                    />
                                                                </div>
                                                                <div className='col-span-12 lg:col-span-2'>
                                                                    <Label htmlFor={`coatingRate`} className='!text-sm'>
                                                                        Coating/Anodize Rate(rf)
                                                                        <span className='ml-1 text-red-500'>*</span>
                                                                    </Label>
                                                                    <Input
                                                                        type='text'
                                                                        id={`coatingRate${index}`}
                                                                        name={`coating_rate${index}`}
                                                                        value={ entry?.coating_rate || ''}
                                                                        min={0}
                                                                        onChange={(e) => {
                                                                            const updatedProducts = [...purchaseOrderData.entries];
                                                                            updatedProducts[index] = { ...updatedProducts[index], coating_rate: e.target.value };
                                                                            setPurchaseOrderData({ ...purchaseOrderData, entries: updatedProducts });
                                                                        }}

                                                                    />
                                                                </div>


                                                                <div className='col-span-12 lg:col-span-2'>
                                                                    <Label htmlFor='color' className='!text-sm'>
                                                                        Color
                                                                        <span className='ml-1 text-red-500'>*</span>
                                                                    </Label>
                                                                    <Input
                                                                        type='text'
                                                                        id={`color${index}`}
                                                                        name={`color${index}`}
                                                                        value={entry?.color?.name}
                                                                        disabled

                                                                    />
                                                                </div>
                                                                {entry?.mm && (
                                                                    <div className='col-span-12 lg:col-span-3'>
                                                                        <Label htmlFor="name" className='!text-sm'>
                                                                            MM
                                                                            <span className='ml-1 text-red-500'>*</span>
                                                                        </Label>
                                                                        <Input
                                                                            type='text'
                                                                            id={`product${index}`}
                                                                            name={`product${index}`}
                                                                            value={entry?.mm || 'NA'}
                                                                            disabled
                                                                        />
                                                                    </div>
                                                                )}
                                                                <div className='col-span-12 lg:col-span-3'>
                                                                    <Label htmlFor="coatingQuantity" className='!text-sm'>
                                                                        Available Quantity
                                                                        <span className='ml-1 text-red-500'>*</span>
                                                                    </Label>
                                                                    <Input
                                                                        type='text'
                                                                        id={`coatingQuantity${index}`}
                                                                        name={`coatingQuantity${index}`}
                                                                        value={entry?.itemSummary?.coatingQuantity}
                                                                        disabled
                                                                        style={{cursor:'no-drop'}}
                                                                    />
                                                                </div>
                                                                <div className='col-span-12 lg:col-span-3'>
                                                                    <Label htmlFor="deliveredQuantity" className='!text-sm'>
                                                                        Delivered Quantity
                                                                        <span className='ml-1 text-red-500'>*</span>
                                                                    </Label>
                                                                    <Input
                                                                        type='number'
                                                                        id={`delivered_quantity${index}`}
                                                                        name={`delivered_quantity${index}`}
                                                                        value={deliveredQuantities[index]}
                                                                        min={0}
                                                                        onChange={(e) => handleDeliveredQuantityChange(e.target.value, index)}
                                                                    />
                                                                </div>

                                                                <div className='col-span-12 lg:col-span-3'>
                                                                    <Label htmlFor="totalWeight" className='!text-sm'>
                                                                        Total Weight
                                                                        <span className='ml-1 text-red-500'>*</span>
                                                                    </Label>
                                                                    <Input
                                                                        type='number'
                                                                        id={`total_weight${index}`}
                                                                        name={`total_weight${index}`}
                                                                        value={handleTotalWeight(index)}
                                                                        disabled
                                                                    />
                                                                </div>


                                                                <div className='col-span-12 lg:col-span-3'>
                                                                    <Label htmlFor={`total_rate${index}`} className='!text-sm'>
                                                                        Product Coating Rate
                                                                        <span className='ml-1 text-red-500'>*</span>
                                                                    </Label>
                                                                    <Input
                                                                        type='number'
                                                                        id={`total_rate${index}`}
                                                                        name={`total_rate${index}`}
                                                                        value={handleTotalCoatingRate(index)}
                                                                        disabled
                                                                    />
                                                                </div>

                                                            </div>

                                                        </>);
                                                    })}
                                                </div>
                                            </div>
                                        </div>
                                    </CardBody>
                                </Card>
                            </div >

                            {/* Other Detail */}
                            {customerId && purchaseOrderData.customer ? (<>
                                <div className='col-span-12 flex flex-col gap-1 xl:col-span-6'>
                                    <Card>
                                        <CardBody>
                                            <div className='flex'>
                                                <div className='bold w-full'>
                                                    <Button
                                                        variant='outlined'
                                                        className='flex w-full items-center justify-between rounded-none border-b px-[2px] py-[0px] text-start text-lg font-bold'
                                                    >
                                                        Other Detail
                                                    </Button>
                                                </div>
                                            </div>
                                            <div>
                                                <div className='mt-2 grid grid-cols-12 gap-1'>
                                                    <div className='col-span-12 lg:col-span-12'>
                                                        <div className='mt-2 grid grid-cols-12 gap-1' >


                                                            <div className='col-span-4 lg:col-span-4 mt-5'>
                                                                <Label htmlFor='customerName'>
                                                                    Alluminium Rate
                                                                    <span className='ml-1 text-red-500'>*</span>
                                                                </Label>
                                                                <Input
                                                                    type='number'
                                                                    value={alluminiumRate }
                                                                    name="gst"
                                                                    onChange={(e) => setAlluminiumRate(parseInt(e.target.value))}
                                                                />
                                                            </div>

                                                            <div className='col-span-4 lg:col-span-4 mt-5'>
                                                                <Label htmlFor='gst'>
                                                                    GST(%)
                                                                    <span className='ml-1 text-red-500'>*</span>
                                                                </Label>
                                                                <Input
                                                                    type='number'
                                                                    value={entries.gst}
                                                                    name="gst"
                                                                    min={0}
                                                                    onChange={(e) => setEntries({ ...entries, gst: e.target.value })}
                                                                />
                                                            </div>

                                                            <div className='col-span-4 lg:col-span-4 mt-5'>
                                                                <Label htmlFor='totalProductWeight'>
                                                                    Total Product Weight
                                                                    <span className='ml-1 text-red-500'>*</span>
                                                                </Label>
                                                                <Input
                                                                    type='number'
                                                                    value={totalProductWeight}
                                                                    name="totalProductWeight"

                                                                />
                                                            </div>

                                                            <div className='col-span-4 lg:col-span-4 mt-5'>
                                                                <Label htmlFor='totalProductPrice'>
                                                                    Total Product Charges
                                                                    <span className='ml-1 text-red-500'>*</span>
                                                                </Label>
                                                                <Input
                                                                    type='number'
                                                                    value={totalProductPrice || 0}
                                                                    name="totalProductPrice"
                                                                    disabled
                                                                />
                                                            </div>

                                                            <div className='col-span-4 lg:col-span-4 mt-5'>
                                                                <Label htmlFor='totalCoatingCharges'>
                                                                    Total Coating Charges
                                                                    <span className='ml-1 text-red-500'>*</span>
                                                                </Label>
                                                                <Input
                                                                    type='number'
                                                                    value={finalCoatingPrice || 0}
                                                                    name="totalCoatingCharges"
                                                                    disabled
                                                                />
                                                            </div>

                                                            <div className='col-span-4 lg:col-span-4 mt-5'>
                                                                <Label htmlFor='discount'>
                                                                    Discount(%)
                                                                    <span className='ml-1 text-red-500'>*</span>
                                                                </Label>

                                                                <Input
                                                                    type='number'
                                                                    value={discount || 0}
                                                                    name="discount"
                                                                    onChange={(e: any) => setDiscount(+e.target.value)}
                                                                    min={0}


                                                                />

                                                            </div>

                                                            <div className='col-span-4 lg:col-span-4 mt-5'>
                                                                <Label htmlFor='other_tax'>
                                                                    Other Tax(%)
                                                                    <span className='ml-1 text-red-500'>*</span>
                                                                </Label>
                                                                <Input
                                                                    type='number'
                                                                    value={entries.tax}
                                                                    name="other_tax"
                                                                    min={0}
                                                                    onChange={(e) => setEntries({ ...entries, tax: e.target.value })}
                                                                />
                                                            </div>
                                                            <div className='col-span-4 lg:col-span-4 mt-5'>
                                                                <Label htmlFor='totalAmount'>
                                                                    Total Amount(rs)
                                                                    <span className='ml-1 text-red-500'>*</span>
                                                                </Label>
                                                                <Input
                                                                    type='number'
                                                                    value={totalAmount}
                                                                    id="total_amount"
                                                                    name="total_amount"
                                                                    onChange={(e) => {
                                                                        setTotalAmount(e.target.value)
                                                                        setEntries({ ...entries, total_amount: totalAmount })
                                                                    }}
                                                                />
                                                            </div>
                                                            <div className='col-span-4 lg:col-span-4 mt-5'>
                                                                <Label htmlFor='customerName'>
                                                                    Origin Point
                                                                    <span className='ml-1 text-red-500'>*</span>
                                                                </Label>
                                                                <Select
                                                                    id='originPoint'
                                                                    name='originPoint'
                                                                    value={branchId.name}
                                                                    placeholder='Select Origin Point'
                                                                    onChange={(e: any) => {
                                                                        setBranchId(e.target.value)
                                                                    }}
                                                                >
                                                                    {branch &&
                                                                        branch.length > 0 &&
                                                                        branch?.map((data: any) => (
                                                                            <option key={data._id} value={data._id}>
                                                                                {data.name}
                                                                            </option>
                                                                        ))}
                                                                </Select>
                                                            </div>
                                                            <div className='col-span-4 lg:col-span-4 mt-5'>
                                                                <Label htmlFor='customerName'>
                                                                    Delivery Point
                                                                    <span className='ml-1 text-red-500'>*</span>
                                                                </Label>
                                                                <Textarea
                                                                    value={entries.delivery_point}
                                                                    name="delivery_point"
                                                                    onChange={(e) => setEntries({ ...entries, delivery_point: e.target.value })}
                                                                />
                                                            </div>
                                                            <div className='col-span-4 lg:col-span-4 mt-5'>
                                                                <Label htmlFor='customerName'>
                                                                    Send Mail
                                                                    <span className='ml-1 text-red-500'>*</span>
                                                                </Label>
                                                                <Checkbox label='Send Mail'
                                                                    id='send_mail'
                                                                    name='send_mail'
                                                                    checked={entries.send_mail}
                                                                    onChange={handleSendMailChange}
                                                                />

                                                            </div>
                                                        </div>
                                                        <div className='flex mt-2 gap-2 '>
                                                            <Button variant='solid' color='blue' type='button' onClick={handleSaveEntries}  >
                                                                Save entries
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </div>

                                            </div>
                                        </CardBody>
                                    </Card>
                                </div >
                            </>) : ""}


                        </div>
                    </div>
                </div>
            </Container>
        </PageWrapper>
    )
}

export default AddInvoice;