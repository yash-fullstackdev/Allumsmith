import { useEffect, useState } from 'react';
import {
    createColumnHelper,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable,
} from '@tanstack/react-table';
import PageWrapper from '../../../../components/layouts/PageWrapper/PageWrapper';
import Container from '../../../../components/layouts/Container/Container';
import Card, {
    CardBody,
    CardHeader,
    CardHeaderChild,
    CardTitle,
} from '../../../../components/ui/Card';
import TableTemplate, {
    TableCardFooterTemplate,
} from '../../../../templates/common/TableParts.template';
import Badge from '../../../../components/ui/Badge';
import { get, post } from '../../../../utils/api-helper.util';
import Select from '../../../../components/form/Select';
import Button from '../../../../components/ui/Button';
import { toast } from 'react-toastify';
import Collapse from '../../../../components/utils/Collapse';
import Input from '../../../../components/form/Input';
import Subheader, { SubheaderLeft, SubheaderRight, SubheaderSeparator } from '../../../../components/layouts/Subheader/Subheader';
import Label from '../../../../components/form/Label';
import { useNavigate } from 'react-router';
import { PathRoutes } from '../../../../utils/routes/enum';
import Checkbox from '../../../../components/form/Checkbox';

const columnHelper = createColumnHelper<any>();

const AddInvoice = () => {
    const navigate = useNavigate();
    const [entries, setEntries] = useState<any>([{ product_id: '', customer_id: '', delivered_quantity: '', customer_email: '', customer_number: '', alluminium_rate: '', coating_discount: '', customer_discount: '', gat: '', tax: '', total_amount: '', finished_weight: '', origin_point: '', delivery_point: '', send_mail: false, }]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [customerList, setCustomerList] = useState<any[]>([]);
    const [purchaseOrderData, setPurchaseOrderData] = useState<any>({});
    const [customerId, setCustomerId] = useState('');
    const [deliveredQuantities, setDeliveredQuantities] = useState<Array<number>>([]);

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

    useEffect(() => {
        getCustomerName()
        getPurchaseOrderByid()
    }, [customerId])

    const handleDeleteProduct = (index: number) => {
        const updatedEntries = [...purchaseOrderData.entries];
        updatedEntries.splice(index, 1);
        setPurchaseOrderData({ ...purchaseOrderData, entries: updatedEntries });
    };
    
    // const handleSaveEntries = async () => {
    //     try {
    //         const deliveredQuantities = Array.isArray(purchaseOrderData.entries) ?
    //             purchaseOrderData.entries.reduce((acc: any, entry: any) => {
    //                 if (Array.isArray(entry.itemSummary)) {
    //                     // Filter out undefined values before mapping
    //                     const quantities = entry.itemSummary.filter((i: any) => i && i.delivered_quantity !== undefined).map((i: any) => i.delivered_quantity);
    //                     return acc.concat(quantities);
    //                 }
    //                 return acc;
    //             }, []) : [];

    //         const productEntry = {
    //             productName: Array.isArray(purchaseOrderData.entries) ?
    //                 purchaseOrderData.entries.map((entry: any) => entry.product.name) : [],
    //             productId: Array.isArray(purchaseOrderData.entries) ?
    //                 purchaseOrderData.entries.map((entry: any) => entry.product._id) : [],
    //             customerId: purchaseOrderData.customer?._id || '',
    //             delivered_quantity: deliveredQuantities
    //         };
    //     } catch (error) {
    //         console.error('Error saving data:', error);
    //     }
    // };

    const handleSendMailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEntries({ ...entries, send_mail: e.target.checked });
    };

    const handleDeliveredQuantityChange = (value: string, index: number,entry:any) => {
        const newValue = parseInt(value, 10);
        const coatingQuantity = entry?.itemSummay?.[index]?.coatingQuantity || 0;
        if (newValue >= coatingQuantity) {
            alert('Delivered quantity cannot exceed coating quantity');
            return
        }
        
        const updatedDeliveredQuantities = [...deliveredQuantities];
        updatedDeliveredQuantities[index] = parseFloat(value); // Parse the input value to a number
        setDeliveredQuantities(updatedDeliveredQuantities);
    };

    // const handleDeliveredQuantityChange = (value: string, index: number) => {
    //     // Ensure the entered value is a valid number
    //     const newValue = parseInt(value, 10);

    //     // Get the current entry from purchaseOrderData.entries
    //     const updatedEntries = [...purchaseOrderData.entries];
    //     const entry = updatedEntries[index];

    //     // Get the coating quantity for the current entry
    //     const coatingQuantity = entry?.itemSummay?.[index]?.coatingQuantity || 0;

    //     // Check if the delivered quantity exceeds the coating quantity
    //     if (newValue > coatingQuantity) {
    //         // Notify the user or handle the condition as required
    //         alert('Delivered quantity cannot exceed coating quantity');
    //         return;
    //     }

    //     // Update the delivered quantity for the current entry
    //     const updatedItemSummary = [...(entry.itemSummay || [])];
    //     updatedItemSummary[index] = { ...updatedItemSummary[index], delivered_quantity: newValue };
    //     updatedEntries[index] = { ...entry, itemSummay: updatedItemSummary };

    //     // Update the state with the modified entries
    //     setPurchaseOrderData({ ...purchaseOrderData, entries: updatedEntries });
    // };


    const handleSaveEntries = async () => {
        try {
            const payload = {
                customer_order_id: purchaseOrderData._id || '',
                customer_id: purchaseOrderData.customer?._id || '',
                customer_name: purchaseOrderData.customer?.name || '',
                customer_email: purchaseOrderData.customer?.email || '',
                customer_number: purchaseOrderData.customer?.phone || '',
                products: purchaseOrderData.entries.map((entry: any, index: any) => ({
                    product_id: entry.product._id,
                    color_id: entry.color?._id || '',
                    coating_id: entry.coating?._id || '',
                    delivered_quantity: deliveredQuantities[index] || '',
                    length: entry.product?.length || '',
                    rate: entry.product?.rate || ''
                })),
                alluminium_rate: entries.alluminium_rate || '',
                send_mail: entries.send_mail || '',
                coating_discount: entries.coating_discount || '',
                customer_discount: entries.customer_discount || '',
                gst: entries.gst || '',
                tax: entries.tax || '',
                total_amount: entries.total_amount || '',
                finished_weight: entries.finished_weight || '',
                origin_point: entries.origin_point || '',
                delivery_point: entries.delivery_point || ''
            };

            // Send the payload to the server
            // const response = await post('/your-server-endpoint', payload);
            console.log('Response:', payload);
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
                                                                <div className='col-span-12 lg:col-span-3'>
                                                                    <Label htmlFor="name">
                                                                        Product Name
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
                                                                <div className='col-span-12 lg:col-span-3'>
                                                                    <Label htmlFor="name">
                                                                        Product Length
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
                                                                <div className='col-span-12 lg:col-span-3'>
                                                                    <Label htmlFor="name">
                                                                        Product Weight
                                                                        <span className='ml-1 text-red-500'>*</span>
                                                                    </Label>
                                                                    <Input
                                                                        type='text'
                                                                        id={`product${index}`}
                                                                        name={`product${index}`}
                                                                        value={entry?.product?.weight}
                                                                        disabled

                                                                    />
                                                                </div>
                                                                <div className='col-span-12 lg:col-span-3'>
                                                                    <Label htmlFor="name">
                                                                        Product Rate
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
                                                                <div className='col-span-12 lg:col-span-3'>
                                                                    <Label htmlFor={`coating`}>
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
                                                                <div className='col-span-12 lg:col-span-3'>
                                                                    <Label htmlFor='color'>
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
                                                                <div className='col-span-12 lg:col-span-3'>
                                                                    <Label htmlFor="coatingQuantity">
                                                                        Coating Quantity
                                                                        <span className='ml-1 text-red-500'>*</span>
                                                                    </Label>
                                                                    <Input
                                                                        type='text'
                                                                        id={`coatingQuantity${index}`}
                                                                        name={`coatingQuantity${index}`}
                                                                        value={entry?.itemSummay?.map((i: any) => i.coatingQuantity)}
                                                                    />
                                                                </div>
                                                                <div className='col-span-12 lg:col-span-3'>
                                                                    <Label htmlFor="pendingQuantity">
                                                                        Pending Quantity
                                                                        <span className='ml-1 text-red-500'>*</span>
                                                                    </Label>
                                                                    <Input
                                                                        type='text'
                                                                        id={`pendingQuantity${index}`}
                                                                        name={`pendingQuantity${index}`}
                                                                        value={entry?.itemSummay?.map((i: any) => i.pendingQuantity)}
                                                                    />
                                                                </div>
                                                                <div className='col-span-12 lg:col-span-3'>
                                                                    <Label htmlFor="delivered_quantity">
                                                                        Delivered Quantity
                                                                        <span className='ml-1 text-red-500'>*</span>
                                                                    </Label>
                                                                    {/* <Input
                                                                        key={`delivered_quantity_${index}`}
                                                                        type='number'
                                                                        id={`delivered_quantity${index}`}
                                                                        name={`delivered_quantity${index}`}
                                                                        value={entry?.itemSummay?.[index]?.delivered_quantity || ''}
                                                                        onChange={(e) => handleDeliveredQuantityChange(e.target.value, index)}
                                                                    /> */}

                                                                    <Input
                                                                        key={`delivered_quantity_${index}`}
                                                                        type='number'
                                                                        id={`delivered_quantity${index}`}
                                                                        name={`delivered_quantity${index}`}
                                                                        value={deliveredQuantities[index]}
                                                                        // onChange={(e) => handleDeliveredQuantityChange(e.target.value, index, entry)}
                                                                        onChange={(e) => handleDeliveredQuantityChange(e.target.value, index,entry)}
                                                                    />
                                                                    {/* <Input
                                                                        type='number'
                                                                        id={`delivered_quantity${index}`}
                                                                        name={`delivered_quantity${index}`}
                                                                        value={entries.delivered_quantity}
                                                                         onChange={(e) => setEntries({ ...entries, delivered_quantity: e.target.value })} 
                                                                          value={entry && Array.isArray(entry.itemSummary) ? entry.itemSummary[index]?.delivered_quantity : ''} 
                                                                        onChange={(e) => { 
                                                                          const updatedItemSummary = [...(entry.itemSummary || [])]; // Copy the item summary array or initialize it as an empty array if it's undefined
                                                                           updatedItemSummary[index] = { ...updatedItemSummary[index], delivered_quantity: e.target.value }; // Update delivered quantity of the specific item
                                                                            const updatedEntry = { ...entry, itemSummary: updatedItemSummary }; // Update the entry with the modified item summary
                                                                           const updatedEntries = [...purchaseOrderData.entries]; // Copy the entries array
                                                                           updatedEntries[index] = updatedEntry; // Update the entry in the entries array
                                                                          setPurchaseOrderData({ ...purchaseOrderData, entries: updatedEntries }); // Update the state with the modified entries
                                                                         }}
                                                                    > */}


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
                                                                    Coating Discount
                                                                    <span className='ml-1 text-red-500'>*</span>
                                                                </Label>
                                                                <Input
                                                                    type='number'
                                                                    value={entries.coating_discount}
                                                                    name="coating_discount"
                                                                    onChange={(e) => setEntries({ ...entries, coating_discount: e.target.value })}
                                                                />
                                                            </div>
                                                            <div className='col-span-4 lg:col-span-4 mt-5'>
                                                                <Label htmlFor='customerName'>
                                                                    Customer Discount
                                                                    <span className='ml-1 text-red-500'>*</span>
                                                                </Label>
                                                                <Input
                                                                    type='number'
                                                                    value={entries.customer_discount}
                                                                    name="customer_discount"
                                                                    onChange={(e) => setEntries({ ...entries, customer_discount: e.target.value })}
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
                                                                <Label htmlFor='customerName'>
                                                                    Other Tax
                                                                    <span className='ml-1 text-red-500'>*</span>
                                                                </Label>
                                                                <Input
                                                                    type='number'
                                                                    value={entries.tax}
                                                                    name="tax"
                                                                    onChange={(e) => setEntries({ ...entries, tax: e.target.value })}
                                                                />
                                                            </div>
                                                            <div className='col-span-4 lg:col-span-4 mt-5'>
                                                                <Label htmlFor='customerName'>
                                                                    Total Amount
                                                                    <span className='ml-1 text-red-500'>*</span>
                                                                </Label>
                                                                <Input
                                                                    type='number'
                                                                    value={entries.total_amount}
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
                                                            {/* <Button variant='solid' color='blue' type='button' >
                                                            Add Entry
                                                        </Button> */}
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
