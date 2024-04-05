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
import Checkbox from '../../../../components/form/Checkbox';

const columnHelper = createColumnHelper<any>();

const AddInvoice = () => {
    const navigate = useNavigate();
    const [entries, setEntries] = useState<any>([{ product_id: '', customer_id: '', delivered_quantity: '', customer_email: '', customer_number: '', alluminium_rate: '', coating_discount: '', customer_discount: '', gst: '', tax: '', total_amount: '', finished_weight: '', origin_point: '', delivery_point: '', send_mail: false, }]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [customerList, setCustomerList] = useState<any[]>([]);
    const [purchaseOrderData, setPurchaseOrderData] = useState<any>({});
    const [customerId, setCustomerId] = useState('');
    const [deliveredQuantities, setDeliveredQuantities] = useState<Array<number>>([]);
    const [quantityAndDiscounts, setQuantityAndDiscounts] = useState<any[]>([]);
    const [totalAmount, setTotalAmount] = useState<any>(0);
    const [amountBeforeTax,setAmountBeforeTax] = useState<any>(0);
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
    console.log('PODATA', purchaseOrderData);
    
    useEffect(() => {
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

    const handleDeliveredQuantityChange = (value: any, index: number) => {
        console.log("New Delivered Quantity:", value);  
        console.log("Index:", index);
      
       
        const updatedDeliveredQuantities = [...deliveredQuantities];
        updatedDeliveredQuantities[index] = parseFloat(value);
        console.log("Updated Delivered Quantities:", updatedDeliveredQuantities); // Log the updated state
        setDeliveredQuantities(updatedDeliveredQuantities);
        };
        const handleQuantityAndDiscountChange = (value: any, index: number, field: string) => {
        setQuantityAndDiscounts(prevQuantityAndDiscounts => {
            const updatedQuantityAndDiscounts = [...prevQuantityAndDiscounts];
            const currentItem = updatedQuantityAndDiscounts[index] || {};
            const updatedItem = {
                ...currentItem,
                [field]: value,
            };
            updatedQuantityAndDiscounts[index] = updatedItem;
            return updatedQuantityAndDiscounts;
        });
    };
    console.log('PurchaseOrderData', purchaseOrderData);
    
 

    const calculateTotalAmount = () => {
        let totalSpecificProductPrice = 0;
        let totalCoatingTotal = 0;
    
        purchaseOrderData.entries.forEach((entry: any, index: number) => {
            const specificProductPrice = entry.product?.weight * parseInt(entry.product?.rate) * deliveredQuantities[index];
            totalSpecificProductPrice += specificProductPrice || 0;
    
            const coatingTotal = (entry.product?.coatingWeight || 0) * entry.coating.rate ;
            console.log('<><></></>',coatingTotal);
            
            const discount = parseFloat(quantityAndDiscounts[index]?.coating_discount) || 0;
            const finalCoatingPrice = coatingTotal * (1 - discount / 100);
            console.log(finalCoatingPrice);
            
            totalCoatingTotal += finalCoatingPrice || 0;
        });
    
        const totalAmount = totalSpecificProductPrice + totalCoatingTotal;
        console.log('tax', entries.tax);
        
        const finalAmount = totalAmount + (totalAmount * (entries.gst/100));
        console.log('Final Amount', finalAmount);
        
        const grandTotal = finalAmount &&  (finalAmount + (finalAmount * (entries.tax/100)));
        setTotalAmount(grandTotal.toFixed(2));
    };
    
   
    
    useEffect(() => {
        if(purchaseOrderData?.entries?.length > 0){
        calculateTotalAmount();
        }
    }, [purchaseOrderData.entries, entries.gst, entries.tax]);

    

  
    const handleSaveEntries = async () => {
        try {
            // Calculate total specificProductPrice
            const totalSpecificProductPrice = purchaseOrderData.entries.reduce((acc: number, entry: any, index: number) => {
                const specificProductPrice = entry.product?.weight * parseInt(entry.product?.rate) * deliveredQuantities[index];
                return acc + (specificProductPrice || 0);
            }, 0);
    
            // Calculate total coatingTotal
            const totalCoatingTotal = purchaseOrderData.entries.reduce((acc: number, entry: any, index: number) => {
                const coatingTotal = (entry.product?.coatingWeight || 0) * entry.coating.rate;
                const totalCoatingPrice = coatingTotal - (coatingTotal * (parseFloat(quantityAndDiscounts[index]?.coating_discount) || 0) / 100);
                return acc + (totalCoatingPrice || 0);
            }, 0);
    
            // Calculate total amount including specificProductPrice, coatingTotal, and gst
            // const totalAmount = totalSpecificProductPrice + totalCoatingTotal + parseFloat(entries.gst || 0);
            let amountBT = 0;
            const payload = {
                customerOrder_id: purchaseOrderData._id || '',
                customerName: purchaseOrderData.customer?._id || '',
                customerEmail: purchaseOrderData.customer?.email || '',
                customerPhone: purchaseOrderData.customer?.phone || '',
                products: purchaseOrderData.entries.map((entry: any, index: any) => {
                    const specificProductPrice = entry.product?.weight * parseInt(entry.product?.rate) * deliveredQuantities[index];
                    const coatingTotal = (entry.product?.coatingWeight || 0) * entry.coating.rate ;
                    const finalCoatingTotal = coatingTotal - (coatingTotal * (parseFloat(quantityAndDiscounts[index]?.coating_discount) || 0) / 100)
                    const amount = specificProductPrice + finalCoatingTotal;
                    amountBT += amount
                    setAmountBeforeTax(parseFloat(amountBT.toFixed(2)));
                    return {
                        product: entry.product._id,
                        color: entry.color?._id || '',
                        coating: entry.coating?._id || '',
                        coatingDiscount: parseFloat(quantityAndDiscounts[index]?.coating_discount) || '',
                        delieveryQuantity: deliveredQuantities[index] || '',
                        weight: entry?.product?.weight || '',
                        length: entry.product?.length || '',
                        rate: entry.product?.rate || '',
                        specificProductPrice: parseFloat(specificProductPrice.toFixed(2)) || 0,
                        coatingWeight: parseFloat(entry?.product?.coatingWeight) || '',
                        coatingRate: entry.coating.rate,
                        coatingTotal: coatingTotal || 0,
                        amount:parseFloat(amount.toFixed(2)),
                    };
                }),
                amountBeforeTax: amountBeforeTax || 0,
                alluminiumRate: entries.alluminium_rate || '',
                sendMail: entries.send_mail || false,
                gst: parseFloat(entries.gst) || '',
                other_tax: parseFloat(entries.tax) || '',
                totalAmount: parseFloat(totalAmount) || '',
                finished_weight: entries.finished_weight || '',
                origin_point: entries.origin_point || '',
                delivery_point: entries.delivery_point || ''
                // 
                // customerOrder_id: purchaseOrderData._id || '',
                // customerName: purchaseOrderData.customer?._id || '',
                // customerEmail: purchaseOrderData.customer?.email || '',
                // customerPhone: purchaseOrderData.customer?.phone || '',
                // products: purchaseOrderData.entries.map((entry: any, index: any) => ({
                //     product: entry.product._id,
                //     color: entry.color?._id || '',
                //     coating: entry.coating?._id || '',
                //     delieveryQuantity: deliveredQuantities[index] || '',
                //     length: entry.product?.length || '',
                //     rate: entry.product?.rate || '',
                //     weight: entry.product?.weight || '',
                //     discount: entry.product?.discount || '',
                //     amount: entry.product?.amount || '',
                // })),
                // alluminiumRate: entries.alluminium_rate || '',
                // sendMail: entries.send_mail || false,
                // coatingDiscount: entries.coating_discount || '',
                // customerDiscount: entries.customer_disco0unt || '',
                // gst: entries.gst || '',
                // other_tax: entries.tax || '',
                // totalAmount: entries.total_amount || '',
                // finished_weight: entries.finished_weight || '',
                // origin_point: entries.origin_point || '',
                // delivery_point: entries.delivery_point || ''
            };
            console.log('Payload',payload);
            
            const respones = await post('/invoice',payload)
            console.log('Response:', respones);
            
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
                                                <div className='col-span-4 lg:col-span-4 mt-5'>
                                                    <Label htmlFor='customerName'>
                                                        Customer
                                                        <span className='ml-1 text-red-500'>*</span>
                                                    </Label>
                                                    <Select
                                                        id='customerName'
                                                        name='customerName'
                                                        value={customerId}
                                                        placeholder='Select Customer'
                                                        onChange={(e: any) => {
                                                            setCustomerId(e.target.value)
                                                        }}
                                                    >
                                                        {customerList &&
                                                            customerList.length > 0 &&
                                                            customerList?.map((data: any) => (
                                                                <option key={data._id} value={data._id}>
                                                                    {data.customer.name}
                                                                </option>
                                                            ))}
                                                    </Select>
                                                </div>
                                                <div className='col-span-12 lg:col-span-12'>
                                                    {customerId && Array.isArray(purchaseOrderData.entries) && purchaseOrderData.entries.map((entry: any, index: number) => {
                                                        return (<>
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
                                                                <div className='col-span-12 lg:col-span-2 '>
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
                                                                         Length
                                                                        <span className='ml-1 text-red-500'>*</span>
                                                                    </Label>
                                                                    <Input
                                                                        type='text'
                                                                        id={`product${index}`}
                                                                        name={`product${index}`}
                                                                        value={entry?.product?.length}
                                                                        disabled
                                                                    />
                                                                </div>
                                                                <div className='col-span-12 lg:col-span-2'>
                                                                    <Label htmlFor="name" className='!text-sm'>
                                                                        Product Weight
                                                                        <span className='ml-1 text-red-500'>*</span>
                                                                    </Label>
                                                                    <Input
                                                                        type='number'
                                                                        id={`product${index}`}
                                                                        name={`product${index}`}
                                                                        value={entry?.product?.weight}
                                                                    />
                                                                </div>
                                                                <div className='col-span-12 lg:col-span-1'>
                                                                    <Label htmlFor="name" className='!text-sm'>
                                                                         Rate
                                                                        <span className='ml-1 text-red-500'>*</span>
                                                                    </Label>
                                                                    <Input
                                                                        type='text'
                                                                        id={`product${index}`}
                                                                        name={`product${index}`}
                                                                        // value={entry?.product?.rate}
                                                                        value={entry?.product?.rate}
                                                                        onChange={(e) => {
                                                                            const updatedProducts = [...purchaseOrderData.entries]; // Copy the products array
                                                                            updatedProducts[index] = { ...updatedProducts[index], product: { ...updatedProducts[index].product, rate: e.target.value } }; // Update the rate of the specific product
                                                                            setPurchaseOrderData({ ...purchaseOrderData, entries: updatedProducts }); // Update the state with the modified products
                                                                        }}

                                                                    />
                                                                </div>
                                                                <div className='col-span-12 lg:col-span-1'>
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
                                                                <div className='col-span-12 lg:col-span-1'>
                                                                    <Label htmlFor={`coatingRate`} className='!text-sm'>
                                                                        Coating Rate
                                                                        <span className='ml-1 text-red-500'>*</span>
                                                                    </Label>
                                                                    <Input
                                                                        type='text'
                                                                        id={`coatingRate${index}`}
                                                                        name={`coatingRate${index}`}
                                                                        value={entry?.coating?.rate}
                                                                        disabled
                                                                    />
                                                                </div>
                                                                <div className='col-span-12 lg:col-span-2'>
                                                                    <Label htmlFor="coatingWeight" className='!text-sm'>
                                                                        Coating Weight
                                                                        <span className='ml-1 text-red-500'>*</span>
                                                                    </Label>
                                                                    <Input
                                                                        type='text'
                                                                        id={`coatingWeight${index}`}
                                                                        name={`coatingWeight${index}`}
                                                                        value={entry?.product?.coatingWeight}
                                                                        onChange={(e) => {
                                                                            const updatedProducts = [...purchaseOrderData.entries]; 
                                                                            updatedProducts[index] = { ...updatedProducts[index], product: { ...updatedProducts[index].product, coatingWeight: e.target.value } }; 
                                                                            setPurchaseOrderData({ ...purchaseOrderData, entries: updatedProducts }); 
                                                                        }}
                                                                    />
                                                                </div>
                                                                <div className='col-span-12 lg:col-span-2'>
                                                                    <Label htmlFor="coatingDiscount" className='!text-sm'>
                                                                        Coating Discount
                                                                        <span className='ml-1 text-red-500'>*</span>
                                                                    </Label>
                                                                    <Input
                                                                        type='number'
                                                                        id={`coating_discount${index}`}
                                                                        name={`coating_discount${index}`}
                                                                        value={quantityAndDiscounts[index]?.coating_discount || ''}
                                                                        onChange={(e) => handleQuantityAndDiscountChange(e.target.value, index, 'coating_discount')}
                                                                    />
                                                                </div>
                                                                <div className='col-span-12 lg:col-span-1'>
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
                                                                        onChange={(e) => console.log(e)}
                                                                    />
                                                                </div>
                                                                <div className='col-span-12 lg:col-span-2'>
                                                                    <Label htmlFor="coatingQuantity" className='!text-sm'>
                                                                        Available Quantity
                                                                        <span className='ml-1 text-red-500'>*</span>
                                                                    </Label>
                                                                    <Input
                                                                        type='text'
                                                                        id={`coatingQuantity${index}`}
                                                                        name={`coatingQuantity${index}`}
                                                                        value={entry?.itemSummary?.coatingQuantity}
                                                                    />
                                                                </div>
                                                                
                                                                <div className='col-span-12 lg:col-span-2'>
                                                                    <Label htmlFor="delivered_quantity" className='!text-sm'>
                                                                        Delivered Quantity
                                                                        <span className='ml-1 text-red-500'>*</span>
                                                                    </Label> 
                                                                    
                                                                    <Input
                                                                    type='number'
                                                                    id={`delivered_quantity${index}`}
                                                                    name={`delivered_quantity${index}`}
                                                                    value={deliveredQuantities[index]} 
                                                                    onChange={(e) => handleDeliveredQuantityChange(e.target.value, index)}
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
                                                                    Customer Email
                                                                    <span className='ml-1 text-red-500'>*</span>
                                                                </Label>
                                                                <Input
                                                                    type='text'
                                                                    value={purchaseOrderData && purchaseOrderData.customer.email}
                                                                    name="customer_email"
                                                                    disabled
                                                                />
                                                            </div>
                                                            <div className='col-span-4 lg:col-span-4 mt-5'>
                                                                <Label htmlFor='customerName'>
                                                                    Customer Number
                                                                    <span className='ml-1 text-red-500'>*</span>
                                                                </Label>
                                                                <Input
                                                                    type='text'
                                                                    value={purchaseOrderData && purchaseOrderData.customer.phone}
                                                                    name="customer_number"
                                                                    disabled

                                                                />
                                                            </div>
                                                            <div className='col-span-4 lg:col-span-4 mt-5'>
                                                                <Label htmlFor='customerName'>
                                                                    Alluminium Rate
                                                                    <span className='ml-1 text-red-500'>*</span>
                                                                </Label>
                                                                <Input
                                                                    type='number'
                                                                    value={entries.alluminium_rate}
                                                                    name="alluminium_rate"
                                                                    onChange={(e) => setEntries({ ...entries, alluminium_rate: e.target.value })}
                                                                />
                                                            </div>
                                                            <div className='col-span-4 lg:col-span-4 mt-5'>
                                                                <Label htmlFor='customerName'>
                                                                    GST
                                                                    <span className='ml-1 text-red-500'>*</span>
                                                                </Label>
                                                                <Input
                                                                    type='number'
                                                                    value={entries.gst}
                                                                    name="gst"
                                                                    onChange={(e) => setEntries({ ...entries, gst: e.target.value })}
                                                                />
                                                            </div>
                                                            <div className='col-span-4 lg:col-span-4 mt-5'>
                                                                <Label htmlFor='other_tax'>
                                                                    Other Tax
                                                                    <span className='ml-1 text-red-500'>*</span>
                                                                </Label>
                                                                <Input
                                                                    type='number'
                                                                    value={entries.tax}
                                                                    name="other_tax"
                                                                    onChange={(e) => setEntries({ ...entries, tax: e.target.value })}
                                                                />
                                                            </div>
                                                            <div className='col-span-4 lg:col-span-4 mt-5'>
                                                                <Label htmlFor='totalAmount'>
                                                                    Total Amount
                                                                    <span className='ml-1 text-red-500'>*</span>
                                                                </Label>
                                                                <Input
                                                                    type='number'
                                                                    value={totalAmount}
                                                                    name="total_amount"
                                                                    onChange={(e) => setEntries({ ...entries, total_amount: e.target.value })}
                                                                />
                                                            </div>
                                                            <div className='col-span-4 lg:col-span-4 mt-5'>
                                                                <Label htmlFor='customerName'>
                                                                    Finished Weight
                                                                    <span className='ml-1 text-red-500'>*</span>
                                                                </Label>
                                                                <Input
                                                                    type='number'
                                                                    value={entries.finished_weight}
                                                                    name="finished_weight"
                                                                    onChange={(e) => setEntries({ ...entries, finished_weight: e.target.value })}
                                                                />
                                                            </div>
                                                            <div className='col-span-4 lg:col-span-4 mt-5'>
                                                                <Label htmlFor='customerName'>
                                                                    Origin Point
                                                                    <span className='ml-1 text-red-500'>*</span>
                                                                </Label>
                                                                <Input
                                                                    type='text'
                                                                    value={entries.origin_point}
                                                                    name="origin_point"
                                                                    onChange={(e) => setEntries({ ...entries, origin_point: e.target.value })}
                                                                />
                                                            </div>
                                                            <div className='col-span-4 lg:col-span-4 mt-5'>
                                                                <Label htmlFor='customerName'>
                                                                    Delivery Point
                                                                    <span className='ml-1 text-red-500'>*</span>
                                                                </Label>
                                                                <Input
                                                                    type='text'
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

export default AddInvoice
