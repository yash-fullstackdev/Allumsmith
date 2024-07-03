import { useNavigate } from "react-router-dom";
import { post } from "../../../../utils/api-helper.util";
import PageWrapper from "../../../../components/layouts/PageWrapper/PageWrapper";
import Subheader, { SubheaderLeft, SubheaderSeparator } from "../../../../components/layouts/Subheader/Subheader";
import Button from "../../../../components/ui/Button";
import { PathRoutes } from "../../../../utils/routes/enum";
import Container from "../../../../components/layouts/Container/Container";
import { useFormik } from "formik";
import { purchaseOrderSchema } from "../../../../utils/formValidations";
import { toast } from "react-toastify";
import PurchaseOrderForm from "../../../../components/PageComponets/PurchaseOrderForm/PurchaseOrderForm";
import Card, { CardBody } from "../../../../components/ui/Card";


const AddPurchaseOrderPage = () => {
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
                    po_number: value?.po_number
                };

                const { data } = await post("/purchase-order", body);
                toast.success('Purchase Order Created Successfully!');
                navigate(PathRoutes.purchase_order);
            } catch (error: any) {
                toast.error(error.response.data.message, error);
            }finally{
                setSubmitting(false)
            }
        }
    });

    const handleAddEntry = () => {
        formik.setFieldValue('entries', [...formik.values.entries, { product: '', requiredQuantity: '' }]);
    };

    return (
        <PageWrapper name='ADD PRODUCTS' isProtectedRoute={true}>
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
                    <Card>
                        <CardBody>
                            <div
                                className='flex w-full items-center justify-between rounded-none border-b px-[2px] py-[0px] text-start text-lg font-bold'
                            >
                                Add Purchase Order
                            </div>
                            <PurchaseOrderForm formik={formik} />
                            <div className='flex mt-2 gap-2 '>
                                <Button variant='solid' color='blue' icon='HeroPlus' type='button' onClick={handleAddEntry}>
                                    Add Entry
                                </Button>
                                <Button variant='solid' isLoading={formik?.isSubmitting} isDisable={formik?.isSubmitting} color='blue' onClick={formik.handleSubmit}>
                                    Save Entries
                                </Button>
                            </div>
                        </CardBody>
                    </Card>
            </Container>
        </PageWrapper>
    );
};

export default AddPurchaseOrderPage;
