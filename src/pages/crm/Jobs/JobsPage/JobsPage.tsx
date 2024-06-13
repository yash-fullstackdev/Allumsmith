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
import Subheader, { SubheaderLeft, SubheaderRight, SubheaderSeparator } from '../../../../components/layouts/Subheader/Subheader';
import Collapse from '../../../../components/utils/Collapse';
import Modal, { ModalBody, ModalHeader } from '../../../../components/ui/Modal';
import ReviewQuantityStatus from './ReviewQuantityStatus';
import SelfProducts from './SelfProducts';
import { Switch } from '@mui/material';
import WithoutMaterialPage from './WithoutMaterialPage';
import { toast } from 'react-toastify';


const JobsPage = () => {
    const [name, setName] = useState('');
    const [branchData, setBranchData] = useState<any>([])
    const [coatingData, setCoatingData] = useState<any>([])
    const [productsData, setProductsData] = useState<any>([]);
    const [branchId, setBranchId] = useState({ id: "", name: '' });
    const [customerOrders, setCustomerOrders] = useState<any>([{ name: '', products: [] }]);
    const navigate = useNavigate();
    const [selectedCustomerOrderData, setSelectedCustomerOrderData] = useState<any>(null);
    const [collapsible, setCollapsible] = useState<boolean[]>(customerOrders.map(() => false));
    const [customerOrderData, setCustomerOrderData] = useState<any>([]);
    const [quantityStatusModal, setQuantityStatusModal] = useState<boolean>(false);
    const [productIdsForReview, setProductIdsForReview] = useState<string[]>([]);
    const [processReviewData, setProcessReviewData] = useState<any>({});
    const [productQuantityDetails, setProductQuantityDetails] = useState<any>([]);
    const [entries, setEntries] = useState<any>([{ product: '', quantity: '', coating: '', color: '' }]);
    const [withMaterial, setWithMaterial] = useState<boolean>(true);
    const getProductDetails = async () => {
        try {
            const { data } = await get('/products');
            const productsWithData = data?.data?.filter((item: any) => item.name);
            setProductsData(productsWithData);
        } catch (error) {
            console.error("Error Fetching Products", error);
        }
    }

    const getCustomerOrderDetails = async () => {
        try {
            const { data } = await get('/customer-order');
            setCustomerOrderData(data);
        } catch (error) {
            console.error('Error Fetching Customer Order');
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
        getCustomerOrderDetails();
        getProductDetails();
        getBranchDetails();
        getCoatingDetails();

    }, []);

    const handleReviewProcess = async () => {
        const regularBatches = customerOrders.map((order: any) => ({
            coEntry: order.name.id,
            products: order.products.map((product: any) => ({
                productId: product.product._id, // Include product ID
                product: { id: product.product._id, name: product.product.name },
                pendingQuantity: product.pendingQuantity || product.quantity,
                quantity: Number(product.pickQuantity),
                coating: { id: product?.coating?._id, name: product?.coating?.name },
                color: { id: product?.color?._id, name: product?.color?.name },
                mm: product?.mm
            }))
        }));
        const finalValues: any = {
            name,
            branchId: { id: branchId.id, name: branchId.name },
            batch: [...regularBatches],
        };

        const hasSelfProducts = entries.some((entry: any) => entry.product.name !== undefined);

        if (hasSelfProducts) {
            const validSelfProducts = entries.filter((entry: any) => entry.product.name !== undefined);
            finalValues.selfProducts = validSelfProducts.map((entry: any) => ({
                productId: entry.product.id, // Include product ID
                product: { id: entry.product.id, name: entry.product.name },
                quantity: entry.quantity,
                coating: { id: entry.coating.id, name: entry.coating.name },
                color: { id: entry.color.id, name: entry.color.name },
                mm: entry?.mm
            }));
        }

        setProcessReviewData(finalValues);

        const allProductIds = [
            ...customerOrders.flatMap((order: any) => order.products.map((product: any) => product.product._id)),
            ...(finalValues.selfProducts || []).map((selfProduct: any) => selfProduct.productId) // Use productId for self products
        ];
        const reviewQuantityFromBranch = {
            branchId: branchId.id,
            products: allProductIds
        };
        finalValues?.selfProducts.forEach((selfProducts: any) => {
            if (selfProducts?.productId && !selfProducts?.coating?.id) {
                toast.error('Please Select a Coating')
                throw new Error('Please Select a Coating')
            }
            if (selfProducts?.productId && !selfProducts?.color?.id) {
                toast.error('Please Select a Color')
                throw new Error('Please Select a Color')
            }
        })

        setQuantityStatusModal(true);
        try {
            const reviewProducts = await post('/inventory/findQuantity', reviewQuantityFromBranch);
            const formattedProducts = reviewProducts.data.map((reviewProduct: any) => ({
                _id: reviewProduct.product._id,
                name: reviewProduct.product.name,
                quantity: reviewProduct.quantity
            }));
            setProductQuantityDetails(formattedProducts);
        } catch (error) {
            console.log('Error', error);
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

    console.log('Customer Or', customerOrderData);

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
                    <div className='flex items-center justify-center ml-4' >
                        <h4>Without Material</h4>  <Switch {...Label} checked={withMaterial} onClick={() => setWithMaterial(!withMaterial)} /><h4>With Material</h4>
                    </div>
                    <SubheaderSeparator />
                </SubheaderLeft>
                <SubheaderRight >

                    {withMaterial ? <Button
                        variant='solid'
                        color='blue'
                        onClick={handleReviewProcess}
                    >
                        Review Process
                    </Button> : ""}
                </SubheaderRight>
            </Subheader>
            {withMaterial ? (
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
                                                                                    products: customerOrderData?.find((co: any) => co._id === selectedOrderId)?.entries || [],
                                                                                };
                                                                            }
                                                                            return orderItem;
                                                                        });
                                                                        setCustomerOrders(updatedOrders);
                                                                        setSelectedCustomerOrderData(selectedOrderId);
                                                                    }}
                                                                >
                                                                    {customerOrderData?.map((co: any) => {
                                                                        return (
                                                                            <option key={co._id} value={co._id}>
                                                                                {co.customer.name} ({co.customerOrderNumber})
                                                                            </option>
                                                                        );
                                                                    })}
                                                                </Select>
                                                            </div>
                                                            {order.products
                                                                ?.filter((item: any) => item?.coating?.name && item?.color?.name)
                                                                ?.map((product: any, productIndex: any) => (
                                                                    <div key={productIndex} className='mt-[10px] col-span-12 lg:col-span-12 grid grid-cols-12 gap-1'>


                                                                        <div className='col-span-12 lg:col-span-2'>
                                                                            <Label htmlFor={`product${productIndex}`}>
                                                                                Product {productIndex + 1}
                                                                            </Label>
                                                                            <Input
                                                                                type='text'
                                                                                id={`product${productIndex}`}
                                                                                name={`product${productIndex}`}
                                                                                value={product.product.name}
                                                                                disabled
                                                                            />
                                                                        </div>
                                                                        <div className='col-span-12 lg:col-span-2'>
                                                                            <Label htmlFor={`quantity${productIndex}`}>
                                                                                Pending Quantity(Pcs)
                                                                            </Label>
                                                                            <Input
                                                                                type='text'
                                                                                id={`quantity${productIndex}`}
                                                                                name={`quantity${productIndex}`}
                                                                                value={product.pendingQuantity || product.quantity}

                                                                            />
                                                                        </div>
                                                                        <div className='col-span-12 lg:col-span-2'>
                                                                            <Label htmlFor={`pickQuantity${productIndex}`}>
                                                                                Pick Quantity(Pcs)
                                                                            </Label>
                                                                            <Input
                                                                                type='number'
                                                                                id={`pickQuantity${productIndex}`}
                                                                                name={`pickQuantity${productIndex}`}
                                                                                value={product.pickQuantity}
                                                                                onChange={(e) => {
                                                                                    const updatedProduct = { ...product, pickQuantity: e.target.value };
                                                                                    const updatedProducts = [...order.products];
                                                                                    updatedProducts[productIndex] = updatedProduct;
                                                                                    const updatedOrders = [...customerOrders];
                                                                                    updatedOrders[index].products = updatedProducts;
                                                                                    setCustomerOrders(updatedOrders);
                                                                                }}
                                                                                min={0}
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
                                                                        {product?.mm && (<div className='col-span-12 lg:col-span-1'>
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
                                                                        </div>)}


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
                                            <div className='flex'>
                                                <div className='bold w-full'>
                                                    <Button
                                                        variant='outlined'
                                                        className='flex w-full items-center justify-between rounded-none border-b px-[2px] py-[0px] text-start text-lg font-bold'
                                                    >
                                                        Self Product Data
                                                    </Button>
                                                </div>
                                            </div>
                                            <div>
                                                <SelfProducts entries={entries} setEntries={setEntries} />
                                            </div>
                                        </CardBody>
                                    </Card>
                                </div >
                            </div>
                        </div>
                    </div>
                    <Modal isOpen={quantityStatusModal} setIsOpen={setQuantityStatusModal} isScrollable fullScreen>
                        <ModalHeader
                            className='m-5 flex items-center justify-between rounded-none border-b text-lg font-bold'

                        >
                            Review Job Process
                        </ModalHeader>
                        <ModalBody>
                            <ReviewQuantityStatus pendingQuantity={0} productIds={productIdsForReview} processReviewData={processReviewData} productQuantityDetails={productQuantityDetails} setProcessReviewData={setProcessReviewData} setQuantityStatusModal={setQuantityStatusModal} />
                        </ModalBody>
                    </Modal>
                </Container>) :
                <Container>
                    {/* <div> */}
                    <WithoutMaterialPage />
                    {/* </div> */}
                </Container>}
        </PageWrapper >
    );
};

export default JobsPage;
