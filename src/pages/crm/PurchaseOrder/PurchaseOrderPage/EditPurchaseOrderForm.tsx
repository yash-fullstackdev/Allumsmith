
import React, { useEffect } from 'react';
import { get, put } from '../../../../utils/api-helper.util';
import { useFormik } from 'formik';
import Card, { CardBody } from '../../../../components/ui/Card';
import Button from '../../../../components/ui/Button';
import { useNavigate, useParams } from 'react-router-dom';
import { PathRoutes } from '../../../../utils/routes/enum';
import { toast } from 'react-toastify';
import { purchaseOrderSchema } from '../../../../utils/formValidations';
import PageWrapper from '../../../../components/layouts/PageWrapper/PageWrapper';
import Subheader, { SubheaderLeft, SubheaderSeparator } from '../../../../components/layouts/Subheader/Subheader';
import Container from '../../../../components/layouts/Container/Container';
import PurchaseOrderForm from '../../../../components/PageComponets/PurchaseOrderForm/PurchaseOrderForm';

const EditPurchaseOrderForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const formik: any = useFormik({
        initialValues: {
            vendor: "",
            po_number: "",
            entries: [{ product: '', requiredQuantity: '' }],
        },
        validationSchema: purchaseOrderSchema,
        onSubmit: async (value,{setSubmitting}) => {
            try {
                setSubmitting(true)
                const duplicateProductIds = value?.entries
                    .map((entry: any) => entry.product)
                    .filter((productId: any, index: any, array: any) => array.indexOf(productId) !== index);
                if (duplicateProductIds.length > 0) {
                    toast.error('You have selected the same product more than once');
                    return;
                }

                const body = {
                    vendor: value?.vendor,
                    products: value?.entries || [],
                    po_number: value?.po_number,
                    status: 'pending',
                };
                const { data } = await put(`/purchase-order/${id}`, body);
                toast.success('Purchase Order Updated Successfully!');
                navigate(PathRoutes.purchase_order);
            } catch (error: any) {
                toast.error('Error Creating Purchase Order', error);
            } finally {
                setSubmitting(false)
            }
        }
    });

    const fetchPurchaseOrderOrderById = async () => {
        try {
            const { data } = await get(`/purchase-order/${id}`);
            const vendor = data?.vendor?._id;
            formik.setFieldValue('vendor', vendor);
            const mappedEntries = data?.products.map((productEntry: any) => ({
                product: productEntry.product._id,
                requiredQuantity: productEntry.requiredQuantity
            }));
            formik.setFieldValue('entries', mappedEntries);
        } catch (error) {
            console.error('Error Fetching Purchase Order Data');
        }
    };

    useEffect(() => {
        fetchPurchaseOrderOrderById()
    }, []);

    const handleAddEntry = () => {
        formik.setFieldValue('entries', [...formik.values.entries, { product: '', requiredQuantity: '' }]);
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
                <Card className='m-5'>
                    <CardBody>
                        <div
                            className='flex w-full items-center justify-between rounded-none border-b px-[2px] py-[0px] text-start text-lg font-bold'
                        >
                            Edit Purchase Order
                        </div>
                        <PurchaseOrderForm formik={formik} />
                        <div className='flex mt-2 gap-2 '>
                            <Button variant='solid' color='blue' type='button' icon='HeroPlus' onClick={handleAddEntry}>
                                Add Entry
                            </Button>
                            <Button variant='solid' color='blue'  isLoading={formik?.isSubmitting} isDisable={formik?.isSubmitting} onClick={formik.handleSubmit}>
                                Save Entries
                            </Button>
                        </div>
                    </CardBody>
                </Card>
            </Container>
        </PageWrapper>
    );
};

export default EditPurchaseOrderForm;
