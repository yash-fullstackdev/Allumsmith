
import React, { useEffect, useState } from 'react';
import { get, post, put } from '../../../../utils/api-helper.util';
import { useFormik } from 'formik';
import * as Yup from 'yup'; // Import Yup for validation
import Card, { CardBody } from '../../../../components/ui/Card';
import Button from '../../../../components/ui/Button';
import Label from '../../../../components/form/Label';
import Input from '../../../../components/form/Input';
import Select from '../../../../components/form/Select';
import { useNavigate, useParams } from 'react-router-dom';
import { PathRoutes } from '../../../../utils/routes/enum';
import { toast } from 'react-toastify';
import SelectReact from '../../../../components/form/SelectReact';
import { purchaseOrderSchema } from '../../../../utils/formValidations';
import PageWrapper from '../../../../components/layouts/PageWrapper/PageWrapper';
import Subheader, { SubheaderLeft, SubheaderSeparator } from '../../../../components/layouts/Subheader/Subheader';
import Container from '../../../../components/layouts/Container/Container';

const EditPurchaseOrderForm = () => {
    const [entries, setEntries] = useState([{ product: '', requiredQuantity: '' }]);
    const [vendorId, setVendorId] = useState('');
    const [vendorData, setVendorData] = useState<any>([]);
    const [productListData, setProductListData] = useState<any>([]);
    const [purchaseOrderNum, setPurchaseOrderNum] = useState<string>('');
    
    const navigate = useNavigate();

    const formik: any = useFormik({
        initialValues: {
            vendor: '',
            entries: [{ product: '', requiredQuantity: '' }],
        },
        validationSchema: purchaseOrderSchema,
        onSubmit: () => { }
    });
    const {id} = useParams();
    

    const fetchPurchaseOrderOrderById = async () => {
        try {
            const { data } = await get(`/purchase-order/${id}`);
            setPurchaseOrderNum(data?.po_number);
            const vendor = data?.vendor?._id;
            setVendorId(vendor);
            formik.setFieldValue('vendor', vendor);
            const mappedEntries = data?.products.map((productEntry: any) => ({
                product: productEntry.product._id,
                requiredQuantity: productEntry.requiredQuantity
            }));
            formik.setFieldValue('entries', mappedEntries);
            setEntries(mappedEntries);
        } catch (error) {
            console.error('Error Fetching Purchase Order Data');
        }
    }
    useEffect(() => {
        fetchData();
        fetchVendorData();
        fetchPurchaseOrderOrderById()
    }, []);

    const fetchData = async () => {
        try {
            const { data: allProductList } = await get(`/products`);
            setProductListData(allProductList?.data);
        } catch (error: any) {
            console.error('Error fetching products:', error.message);
        }
    };

    const fetchVendorData = async () => {
        try {
            const { data: allVendorData } = await get('/vendors');
            setVendorData(allVendorData);
        } catch (error: any) {
            console.error('Error fetching vendors:', error.message);
        }
    };

    const handleAddEntry = () => {
        setEntries([...entries, { product: '', requiredQuantity: '' }]);
    };

    const showProductDetails = (productArray: any, productId: string): string => {
        const product = productArray.find((product: any) => product._id.toString() === productId.toString());
        if (!product) {
            return '';
        }
        const { name, productCode, length, thickness } = product;
        return `${name} (${productCode}) (${length}) (${thickness})`
    }

    const handleSaveEntries = async () => {
        const duplicateProductIds = entries
            .map((entry: any) => entry.product)
            .filter((productId: any, index: any, array: any) => array.indexOf(productId) !== index);
        if (duplicateProductIds.length > 0) {
            toast.error('You have selected the same product more than once');
            return;
        }
        const finalValues = {
            vendor: vendorId,
            products: formik.values.entries,
            po_number: purchaseOrderNum,
            status:'pending',
        };

        try {
            console.log('api-data', finalValues);

            const { data } = await put(`/purchase-order/${id}`, finalValues);
            toast.success('Purchase Order Updated Successfully!');
            navigate(PathRoutes.purchase_order);
        } catch (error: any) {
            toast.error('Error Creating Purchase Order', error);
        }

    };

    const handleDeleteProduct = (index: number) => {
        const newEntries = [...entries];
        newEntries.splice(index, 1);
        setEntries(newEntries);
        formik.setFieldValue('entries', newEntries);
    };
    return (
        <PageWrapper name='EDIT PRODUCTS' isProtectedRoute={true}>
            <Subheader>
                <SubheaderLeft>
                    <Button
                        icon='HeroArrowLeft'
                        className='!px-0'
                        onClick={() => navigate(`${PathRoutes.purchase_order}`)}
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
                                                    Edit Purchase Order
                                                </Button>
                                            </div>
                                        </div>
                                        <form onSubmit={formik.handleSubmit}>
                                            <div>
                                                <div className='mt-2 flex gap-1'>
                                                    <div className='col-span-4 lg:col-span-4 mt-5 flex-1'>
                                                        <Label htmlFor='vendor'>
                                                            Vendor
                                                            <span className='ml-1 text-red-500'>*</span>
                                                        </Label>
                                                        <SelectReact
                                                            options={vendorData.map((vendor: any) => ({ value: vendor._id, label: vendor.name }))}
                                                            value={vendorId ? { value: vendorId, label: vendorData.find((vendor: any) => vendor._id === vendorId)?.name } : null}
                                                            onChange={(selectedOption: any) => {
                                                                setVendorId(selectedOption.value);
                                                                formik.setFieldValue('vendor', selectedOption.value);
                                                            }}
                                                            onBlur={formik.handleBlur}
                                                            name='vendor'
                                                        />
                                                        {formik.errors.vendor && formik.touched.vendor && (
                                                            <div className='text-red-500'>{formik.errors.vendorName}</div>
                                                        )}
                                                    </div>

                                                    <div className='col-span-4 lg:col-span-4 mt-5 flex-1'>
                                                        <Label htmlFor='po-number'>
                                                            PO-Number
                                                            <span className='ml-1 text-red-500'>*</span>
                                                        </Label>
                                                        <Input
                                                            value={purchaseOrderNum}
                                                            name='po-number'
                                                            id='po-number'
                                                            disabled
                                                        />
                                                    </div>
                                                </div>


                                                {entries.map((entry: any, index: number) => (
                                                    <div key={index} className='mt-2 grid grid-cols-12 gap-1'>
                                                        <div className='col-span-12 lg:col-span-3'>
                                                            <Label htmlFor={`product-${index}`}>
                                                                Products
                                                                <span className='ml-1 text-red-500'>*</span>
                                                            </Label>
                                                            <SelectReact
                                                                options={productListData && productListData.map((product: any) => ({
                                                                    value: product._id,
                                                                    label: `${product.name} (${product.productCode}) (${product.length})`,
                                                                }))}
                                                                value={entry?.product ? { value: entry?.product, label: showProductDetails(productListData, entry?.product) } : null}
                                                                // value={entry?.product ? { value: entry?.product, label: showProductDetails(productListData, entry?.product) } : null}
                                                                
                                                                onChange={(selectedOption: any) => {
                                                                    const updatedEntries = [...entries];
                                                                    updatedEntries[index].product = selectedOption.value;
                                                                    formik.setFieldValue(`entries[${index}].product`, selectedOption.value);
                                                                    setEntries(updatedEntries);
                                                                }}
                                                                name={`entries[${index}].product`}
                                                                onBlur={formik.handleBlur}
                                                            />
                                                            {formik.touched.entries && formik.touched.entries[index] && formik.errors.entries && formik.errors.entries[index] && formik.errors.entries[index].product && (
                                                                <div className='text-red-500'>{formik.errors.entries[index].product}</div>
                                                            )}

                                                        </div>
                                                        <div className='col-span-12 lg:col-span-3'>
                                                            <Label htmlFor={`hsn-${index}`}>
                                                                Quantity
                                                                {/* <span className='ml-1 text-red-500'>*</span> */}
                                                            </Label>
                                                            <Input
                                                                type='number'
                                                                id={`hsn-${index}`}
                                                                name={`hsn-${index}`}
                                                                value={entry.requiredQuantity}
                                                                onChange={(e) => {
                                                                    const updatedEntries = [...entries];
                                                                    updatedEntries[index].requiredQuantity = e.target.value;
                                                                    formik.setFieldValue(`entries[${index}].requiredQuantity`, parseInt(e.target.value));
                                                                    setEntries(updatedEntries);
                                                                }}
                                                            />
                                                            {/* {formik.touched.entries && formik.touched.entries[index] && formik.errors.entries && formik.errors.entries[index] && formik.errors.entries[index].requiredQuantity && (
                                                                <div className='text-red-500'>{formik.errors.entries[index].requiredQuantity}</div>
                                                            )} */}

                                                        </div>
                                                        <div className='col-span-12 lg:col-span-3 mt-5'>
                                                            <Button
                                                                icon='HeroXMark'
                                                                onClick={() => handleDeleteProduct(index)}
                                                            >
                                                                
                                                            </Button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                            <div className='flex mt-2 gap-2 '>
                                                <Button variant='solid' color='blue' type='button' onClick={handleAddEntry}>
                                                    Add Entry
                                                </Button>
                                                <Button variant='solid' color='blue' onClick={handleSaveEntries}>
                                                    Save Entries
                                                </Button>
                                            </div>
                                        </form>
                                    </CardBody>
                                </Card>
                            </div>
                        </div>
                    </div>
                </div>
            </Container>
        </PageWrapper>
    );
};

export default EditPurchaseOrderForm;
