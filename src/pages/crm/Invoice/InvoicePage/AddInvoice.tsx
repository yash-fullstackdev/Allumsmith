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

const columnHelper = createColumnHelper<any>();

const AddInvoice = () => {
    const navigate = useNavigate();
    const [entries, setEntries] = useState<any>([{ product_id: '', customer_id: '', delivered_quantity: '', customer_email: '', customer_number: '', alluminium_rate: '', coating_discount: '', customer_discount: '', gst: 0, tax: 0, total_amount: '', origin_point: '', delivery_point: '', send_mail: false, }]);
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

    const handleDeliveredQuantityChange = (value: any, index: number) => {

        const updatedDeliveredQuantities = [...deliveredQuantities];
        updatedDeliveredQuantities[index] = parseFloat(value);
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



    const calculateTotalAmount = () => {
        let totalSpecificProductPrice = 0;
        let totalCoatingTotal = 0;

        purchaseOrderData.entries.forEach((entry: any, index: number) => {
            const specificProductPrice = entry.product?.weight * parseInt(entry.product?.rate) * deliveredQuantities[index];
            totalSpecificProductPrice += specificProductPrice || 0;

            const coatingTotal = (entry?.coating?.coatingWeight || 0) * entry?.coating?.rate;

            const discount = parseFloat(quantityAndDiscounts[index]?.coating_discount) || 0;
            const finalCoatingPrice = coatingTotal * (1 - discount / 100);
            console.log("finalCoatingPrice", finalCoatingPrice);

            totalCoatingTotal += finalCoatingPrice || 0;
        });

        const totalAmount = totalSpecificProductPrice + totalCoatingTotal;

        const finalAmount = totalAmount + (totalAmount * (entries.gst / 100));

        const grandTotal = finalAmount && (finalAmount + (finalAmount * (entries.tax / 100)));
        return parseFloat(grandTotal.toFixed(2));
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

    useEffect(() => {
        if (purchaseOrderData?.entries?.length > 0) {

            const grandTotal  = calculateTotalAmount();
            setTotalAmount(grandTotal);
        }
    }, [purchaseOrderData.entries, entries.gst, entries.tax, quantityAndDiscounts]);






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
                    if(entry?.mm){
                        finalPayload =  {
                            product: entry.product._id,
                            name: entry?.product?.name,
                            color: entry.color?._id || '',
                            coating: entry.coating?._id || '',
                            coatingDiscount: parseFloat(quantityAndDiscounts[index]?.coating_discount) || '',
                            delieveryQuantity: deliveredQuantities[index] || '',
                            weight: parseFloat(entry?.product?.weight) || '',
                            length: entry.product?.length || '',
                            rate: entry.product?.rate || '',
                            specificProductPrice: parseFloat(specificProductPrice.toFixed(2)) || 0,
                            coatingWeight: parseFloat(entry?.coating?.coatingWeight) || '',
                            coatingRate: parseFloat(entry.coating.rate),
                            coatingTotal: parseFloat(finalCoatingTotal.toFixed(2)) || 0,
                            amount: parseFloat(amount.toFixed(2)),
                            coatingName: entry?.coating?.name,
                            cgst: parseFloat(((totalAmount - amountBeforeTax) / 2).toFixed(2)),
                            sgst: parseFloat(((totalAmount - amountBeforeTax) / 2).toFixed(2)),
                            specificCoatingAmount: coatingTotal,
                            mm: entry?.mm
                        };
                    }else{
                        finalPayload = {
                            product: entry.product._id,
                            name: entry?.product?.name,
                            color: entry.color?._id || '',
                            coating: entry.coating?._id || '',
                            coatingDiscount: parseFloat(quantityAndDiscounts[index]?.coating_discount) || '',
                            delieveryQuantity: deliveredQuantities[index] || '',
                            weight: parseFloat(entry?.product?.weight) || '',
                            length: entry.product?.length || '',
                            rate: entry.product?.rate || '',
                            specificProductPrice: parseFloat(specificProductPrice.toFixed(2)) || 0,
                            coatingWeight: parseFloat(entry?.coating?.coatingWeight) || '',
                            coatingRate: parseFloat(entry.coating.rate),
                            coatingTotal: parseFloat(finalCoatingTotal.toFixed(2)) || 0,
                            amount: parseFloat(amount.toFixed(2)),
                            coatingName: entry?.coating?.name,
                            cgst: parseFloat(((totalAmount - amountBeforeTax) / 2).toFixed(2)),
                            sgst: parseFloat(((totalAmount - amountBeforeTax) / 2).toFixed(2)),
                            specificCoatingAmount: coatingTotal,
                        }
                    }
                    return finalPayload;
                }),
                amountBeforeTax: parseFloat(amountBeforeTax.toFixed(2)), // Set amountBeforeTax here
                alluminiumRate: entries.alluminium_rate || '',
                send_mail: entries.send_mail || false,
                gst: parseFloat(entries.gst) || '',
                other_tax: parseFloat(entries.tax) || '',
                totalAmount: parseFloat(totalAmount) || '',
                origin_point: branchId || '',
                delivery_point: entries.delivery_point || '',
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
                                                <div className='col-span-4 lg:col-span-4 mt-5'>
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
                                                <div className='col-span-4 lg:col-span-4 mt-5'>
                                                    <Label htmlFor='customerName'>
                                                        Inovice Number
                                                        <span className='ml-1 text-red-500'>*</span>
                                                    </Label>
                                                    <Input
                                                        id='invoiceNumber'
                                                        name='invoiceNumber'
                                                        value={invoiceNumber}
                                                        // onChange={(e:any) => setInvoiceNumber(e.target.value)}
                                                        disabled

                                                    />
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
                                                                <div className='col-span-12 lg:col-span-2'>
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
                                                                        onChange={(e) => {
                                                                            const updatedProducts = [...purchaseOrderData.entries];
                                                                            updatedProducts[index] = { ...updatedProducts[index], product: { ...updatedProducts[index].product, weight: e.target.value } };
                                                                            setPurchaseOrderData({ ...purchaseOrderData, entries: updatedProducts });
                                                                        }}
                                                                    />
                                                                </div>
                                                                <div className='col-span-12 lg:col-span-2'>
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
                                                                    <Label htmlFor="deliveredQuantity" className='!text-sm'>
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
                                                                        Coating/Anodize Rate
                                                                        <span className='ml-1 text-red-500'>*</span>
                                                                    </Label>
                                                                    <Input
                                                                        type='text'
                                                                        id={`coatingRate${index}`}
                                                                        name={`coatingRate${index}`}
                                                                        value={entry?.coating?.rate}
                                                                        onChange={(e) => {
                                                                            const updatedProducts = [...purchaseOrderData.entries];
                                                                            updatedProducts[index] = { ...updatedProducts[index], coating: { ...updatedProducts[index].coating, rate: e.target.value } };
                                                                            setPurchaseOrderData({ ...purchaseOrderData, entries: updatedProducts });
                                                                        }}
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
                                                                        value={entry?.coating?.coatingWeight}
                                                                        onChange={(e) => {
                                                                            const updatedProducts = [...purchaseOrderData.entries];
                                                                            updatedProducts[index] = { ...updatedProducts[index], coating: { ...updatedProducts[index].coating, coatingWeight: e.target.value } };
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
                                                                        value={quantityAndDiscounts[index]?.coating_discount || (
                                                                            entry.coating && entry.coating.type === 'coating' ?
                                                                            purchaseOrderData.customer?.coating_discount || 0 :
                                                                            entry.coating && entry.coating.type === 'anodize' ?
                                                                            purchaseOrderData.customer?.anodize_discount || 0 :
                                                                            ''
                                                                        )}
                                                                        onChange={(e) => handleQuantityAndDiscountChange(e.target.value, index, 'coating_discount')}
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
                                                                    <div className='col-span-12 lg:col-span-2'>
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
                                                                    Origin Point
                                                                    <span className='ml-1 text-red-500'>*</span>
                                                                </Label>
                                                                <Select
                                                                    id='originPoint'
                                                                    name='originPoint'
                                                                    value={branchId}
                                                                    placeholder='Select Origin Point'
                                                                    onChange={(e: any) => {
                                                                        setBranchId(e.target.value)
                                                                    }}
                                                                >
                                                                    {branch &&
                                                                        branch.length > 0 &&
                                                                        branch?.map((data: any) => (
                                                                            <option key={data._id} value={data.name}>
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

export default AddInvoice
